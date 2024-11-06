import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Logger,
  Headers,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ErrorModel } from './error.model';
import { ErrorService } from './error.service';
// import SourceMap, { SourceMapConsumer } from 'source-map';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { customParseDto, errorDetailDto, errorQueryDto } from './error.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SourceMap = require('source-map');
@Controller('error')
@ApiTags('error')
export class ErrorController {
  constructor(private errorService: ErrorService) {}
  logger = new Logger();
  @Get('parse/:id')
  // @UseGuards(AuthGuard())
  @ApiParam({ name: 'id', description: '异常ID' })
  async paseError(@Param() param: errorDetailDto) {
    try {
      const {
        name,
        message,
        colno,
        lineno,
        projectId,
        filename,
        type,
        remote,
        created,
        ua,
        ip,
        requestId,
      } = await this.errorService.findById(param.id);
      if (!colno || !lineno) {
        return {
          name,
          type,
          filename,
          lineno,
          colno,
          remote: decodeURIComponent(remote),
          created,
          ua,
          ip,
          requestId,
        };
      }
      const positionName = filename.split('/')[filename.split('/').length - 1];
      const mapFileName = `${positionName}.map`;
      const url = `http://oss.edw4rd.cn/${process.env.OSS_SOURCEMAP_DIRNAME}/${projectId}/${mapFileName}`;
      const { data } = await this.errorService.getRawMapJson(url);
      const smc = await new SourceMap.SourceMapConsumer(data);
      const po = smc.originalPositionFor({ line: lineno, column: colno });
      const co = smc.sourceContentFor(po.source);
      return {
        name,
        message,
        detail: co,
        type,
        po,
        created,
        ua,
        ip,
        requestId,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        error: error?.message,
        stack: error?.stack,
      };
    }
  }

  // 自定义异常解析
  @Post('customParse')
  @ApiOperation({ description: '自定义异常解析' })
  async customParseError(@Body() param: customParseDto) {
    const { lineno, colno, sourcemap } = param;
    const { data } = await this.errorService.getRawMapJson(sourcemap);
    const smc = await new SourceMap.SourceMapConsumer(data);
    const po = smc.originalPositionFor({ line: lineno, column: colno });
    let co;
    if (po.source) co = smc.sourceContentFor(po.source);
    return {
      lineno,
      colno,
      sourcemap,
      po,
      co,
    };
  }
  @Get('add')
  async create(
    @Query() data,
    @Headers('user-agent') ua,
    @Headers('x-forwarded-for') ip,
    @Req() req,
  ) {
    data.ip = ip?.split(',')?.[0];
    data.ua = ua;
    data.requestId = req.id;
    await this.errorService.create(data);
    return true;
  }
  @Get('analysis')
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    required: false,
    description: '开始时间(从当日00:00:00开始)',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    required: false,
    description: '结束时间(从当日23:59:59点开始)',
  })
  @ApiQuery({
    name: 'type',
    type: 'string',
    required: false,
    description: '异常type 默认查所有',
  })
  getErrorByType(@Query() query: errorQueryDto) {
    console.log(query);
    return this.errorService.getErrorByType(query);
  }
  @Get(':id')
  @UseGuards(AuthGuard())
  async getErrorById(@Param('id') id): Promise<ErrorModel | null> {
    return await this.errorService.findById(id);
  }

  @Get()
  // @UseGuards(AuthGuard())
  async getErrors(@Query() query): Promise<ErrorModel[] | null> {
    const params = Object.keys(query).length === 0 ? undefined : query;
    const data = await this.errorService.findWithOptions(params);
    return data;
  }
}
