/**
 * 作者：王性驊 danielwang
 * 日期：2019-06-01
 * 檔案：main.ts
 * 功能：API Server 入口
 * 本程式使用 帕斯卡命名法
 *  單字之間不以空格斷開或連線號（-）、下劃線（_）連結，第一個單字首字母採用大寫字母；後續單字的首字母亦用大寫字母
 */
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cors from 'cors';
import { configure, getLogger, connectLogger } from 'log4js';
import { AppModule } from './app/app.module';

import { LoggerService } from './app/core/logger/Logger.service';
import { HttpExceptionFilter } from './app/core/filters/error.filter';
import { APP } from './app/app.config';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import * as path from 'path';


async function bootstrap(): Promise<void> {
  const envFilePath = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
  require('dotenv').config({ path: path.resolve(__dirname, '..', envFilePath) });

  const app = await NestFactory.create(AppModule, { logger: false });
  // 使用自己的 Log 系統
  app.useLogger(app.get(LoggerService));
  // 紀錄 access Log
  app.use(
    connectLogger(getLogger('request'), {
      level: 'auto',
      statusRules: [{ codes: [303, 304], level: 'info' }],
    }),
  );
  // 允許跨網域存取
  app.use(
    cors({
      origin: process.env.API_CORS || '*',
    }),
  );
  // 增加 express 使用元素
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }));
  // app.useGlobalFilters(new HttpExceptionFilter());
  // 有一些公共的模塊可以在這裡
  // app.useGlobalFilters(new HttpExceptionFilter())
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(
  //   new TransformInterceptor(new Reflector()),
  //   new ErrorInterceptor(new Reflector()),
  //   new LoggingInterceptor(),
  // );

  app.setGlobalPrefix(APP.API_PREFIX);
  if (process.env.NODE_ENV === 'development') {
    const documonetConfig = new DocumentBuilder()
        .setTitle('DemoLobby Api doc')
        .setVersion('v1')
        .build()
    const document = SwaggerModule.createDocument(app, documonetConfig)
    const customOpt: SwaggerCustomOptions = {
        customSiteTitle: "DemoLobby API Doc"
    }
    SwaggerModule.setup('api-doc', app, document, customOpt)
}
  // await app.listen(APP.PORT);
  await app.listen(8001);
}

// tslint:disable-next-line:no-console
bootstrap()
  .then(_ => {
    getLogger('system').info(
      `${APP.NAME} Run！port at ${APP.PORT}, env: ${APP.ENVIRONMENT}`,
    );
  })
  .catch(err => console.error(err));
