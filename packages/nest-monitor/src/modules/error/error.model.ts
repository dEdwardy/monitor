import { prop, modelOptions, post } from '@typegoose/typegoose';
import IP2Region from 'ip2region';

@modelOptions({ schemaOptions: { versionKey: false } })
@post<ErrorModel>('find', function (errorModels: ErrorModel[]) {
  const IPQuery = new IP2Region({ disableIpv6: true });
  for (const item of errorModels) {
    let ip;
    if (item.ip.includes(',')) {
      ip = item.ip.split(',')[0];
    } else {
      ip = item.ip;
    }
    const {
      country = '未知',
      province = '未知',
      city = '未知',
      isp = '未知',
    } = IPQuery.search(ip);
    ip = `${country}-${province}-${city}-${isp} ${ip}`;
    item.ip = ip;
  }
})
@post<ErrorModel>('findOne', function (errorModel: ErrorModel) {
  const IPQuery = new IP2Region({ disableIpv6: true });
  let ip = errorModel.ip.includes(',')
    ? errorModel.ip.split(',')[0]
    : errorModel.ip;
  const {
    country = '未知',
    province = '未知',
    city = '未知',
    isp = '未知',
  } = IPQuery.search(ip);
  ip = `${country}-${province}-${city}-${isp} ${ip}`;
  errorModel.ip = ip;
})
export class ErrorModel {
  @prop()
  requestId?: string;

  @prop()
  id: string;

  @prop()
  name: string;

  @prop()
  type: string;

  @prop()
  message: string;

  @prop()
  filename: string;

  @prop()
  remote?: string;

  @prop()
  lineno?: number;

  @prop()
  colno?: number;

  // 项目id 根据项目id 查找对应得sourcemap文件
  @prop({ required: true })
  projectId: string;

  @prop({ default: Date.now })
  created: Date;

  @prop()
  ip: string;

  @prop()
  ua: string;
}
