import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { IError } from './error.schema';

import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ErrorModel } from './error.model';
import { HttpService } from '@nestjs/axios';
import { async, lastValueFrom } from 'rxjs';
import { errorQueryDto } from './error.dto';
@Injectable()
export class ErrorService {
  constructor(
    // @InjectModel('ERROR_MODEL') private readonly errorModel: Model<IError>,
    @InjectModel(ErrorModel)
    private readonly errorModel: ReturnModelType<typeof ErrorModel>,
    public http: HttpService,
  ) {}

  // async addError(error: IError) {
  //   const createError = new this.errorModel(error);
  //   return createError.save();
  // }
  async create(data) {
    const createdError = new this.errorModel(data);
    return await createdError.save();
  }
  findAll(): Promise<ErrorModel[] | null> {
    return this.errorModel.find().exec();
  }
  async findWithOptions(
    { current, size, ...query } = {
      current: 1,
      size: 10,
    },
  ): Promise<any> {
    if ((query as any).startDate) {
      query = {
        created: {
          $gte: `${(query as any).startDate}T00:00:00Z`,
          $lte: `${(query as any).endDate}T23:59:59Z`,
        },
      };
    }
    console.log(query);
    const total = await this.errorModel.find(query).count().exec();
    const list = await this.errorModel
      .find(query)
      .skip((Number(current) - 1) * size)
      .limit(Number(size))
      .exec();
    return {
      list,
      current: Number(current),
      size: Number(size),
      total,
    };
  }
  findById(id: string): Promise<ErrorModel | null> {
    return this.errorModel.findById(id).exec();
  }
  updateDetailById(id: string, detail: string) {
    return this.errorModel
      .findByIdAndUpdate(id, { $set: { detail } }, { new: true })
      .exec();
  }
  getRawMapJson(url: string) {
    //lastValueFrom 替换 toPromise
    // return this.http.get(url).toPromise();
    return lastValueFrom(this.http.get(url));
  }
  // 根据type统计异常
  // created 时间段
  async getErrorByType(query: errorQueryDto) {
    const pipeline = [];
    if (query.startDate) {
      pipeline.push({
        $match: {
          created: {
            $gt: query.startDate,
          },
        },
      });
    }
    if (query.endDate) {
      pipeline.push({
        $match: {
          created: {
            $lt: query.endDate,
          },
        },
      });
    }
    if (query.type) {
      pipeline.push({
        $match: {
          type: query.type,
        },
      });
    }
    pipeline.push(
      ...[
        {
          $group: {
            _id: query.type ? '$name' : '$type',
            // _id: ['$type', '$name'],
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0, // 隐藏_id
            name: '$_id', //name 代替 _id
            count: 1, //展示count
          },
        },
      ],
    );
    console.log(pipeline);
    const res = await this.errorModel.aggregate(pipeline).exec();
    return res;
  }
}
