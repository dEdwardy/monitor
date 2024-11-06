import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseExceptionFilter } from './core/filter/base-exception.filter';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Log4jsLogger } from '@nestx-log4js/core';
import helmet from 'helmet';
import { writeFileSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Apollo = require('node-apollo');
async function bootstrap() {
  // 获取配置
  const {
    APOLLO_APPID,
    APOLLO_ENV,
    APOLLO_HOST,
    APOLLO_NAMESPACE,
    APOLLO_PORT,
    APOLLO_TOKEN,
    APOLLO_CLUSTER,
  } = process.env;
  const apolloEnv = {
    configServerUrl: `${APOLLO_HOST}:${APOLLO_PORT}`,
    // configServerUrl: 'http://www.edw4rd.cn:8070',
    appId: `${APOLLO_APPID}`,
    apolloEnv: `${APOLLO_ENV}`,
    namespaceName: [`${APOLLO_NAMESPACE}`],
    token: `${APOLLO_TOKEN}`,
    clusterName: `${APOLLO_CLUSTER}`,
  };
  console.log(apolloEnv);
  const remoteConfig = await Apollo.remoteConfigService(apolloEnv);
  Object.keys(remoteConfig).forEach((key: string) => {
    if (key.trim() === '' || !key) {
      delete remoteConfig[key];
    }
  });
  process.env = Object.assign(process.env, remoteConfig);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.enableCors({
  //   origin: 'http://localhost:8111',
  //   credentials: true,
  // });
  app.use(helmet());
  app.useLogger(app.get(Log4jsLogger));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new BaseExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    // .setExternalDoc('swagger.json', 'http://localhost:5003/swagger.json')
    .setTitle('Nest Monitor')
    .setDescription('前端异常监控')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // writeFileSync(
  //   resolve(__dirname, '../public/swagger.json'),
  //   JSON.stringify(document),
  // );
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(5003);
}
bootstrap();
