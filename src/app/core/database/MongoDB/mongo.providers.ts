/**
 * Database providers.
 * @file Database 模組構造器
 * @module processor/database/providers
 * @author DanielWang <igs170911@gmail.com>
 */

import * as mongoose from 'mongoose';
import { getLogger } from 'log4js';
import { APP, MONGODB } from '../../../app.config';
import { IConnectOptions } from './mongo.interface';
import { DB_CONNECTION_TOKEN } from '../../constants/system.constant';

export const MongoDBProviders = [
  {
    provide: DB_CONNECTION_TOKEN,
    useFactory: async (): Promise<typeof mongoose> => {
      // 使用 Logger
      let errorLogger = getLogger('error');
      let defaultLogger = getLogger('logger');

      // MongoDB 連線參數
      const connectOptions: IConnectOptions = {
        keepAlive: true,
        useNewUrlParser: true,
        bufferMaxEntries: 0 /* B */,
        poolSize: 5 /* D, default is 5, you can ignore it */,
        useUnifiedTopology: true,
      };
      // 禁用暫存，否則連線操作不成功之後會在等待重新連線，行程不會中斷，會一直等待
      mongoose.set('bufferCommands', false);
      // mongoose.set('useCreateIndex', true)
      // print mongoose logs in dev env
      if (APP.ENVIRONMENT === 'development') {
        mongoose.set('debug', true);
      }
      // handlers
      mongoose.connection.on('connecting', () => {
        defaultLogger.info(`MongoDB 連線中....`);
      });

      mongoose.connection.on('error', err => {
        errorLogger.error(`MongoDB 連線失敗，即將關閉 Server，原因是 : ${err}`);
        mongoose.disconnect();
        process.exit(-1);
        return false;
      });

      mongoose.connection.on('connected', () => {
        defaultLogger.info(
          `MongoDB 連接資料庫 host: ${MONGODB.host}, port: ${MONGODB.port}, database: ${process.env.MONGODB_database}`,
        );
      });

      mongoose.connection.once('open', () => {
        defaultLogger.info(`MongoDB 連線成功`);
      });

      mongoose.connection.on('reconnected', () => {
        defaultLogger.info(`MongoDB 重新連線連線`);
      });

      mongoose.connection.on('reconnectFailed', () => {
        defaultLogger.info(`MongoDB 重新連線連線失敗......`);
      });

      mongoose.connection.on('disconnected', () => {
        defaultLogger.info(`MongoDB 結束連線......`);
      });

      mongoose.connection.on('fullsetup', () => {
        defaultLogger.info(`MongoDB :: reconnecting... %d`);
      });
      let uri = `mongodb://${MONGODB.host}:${MONGODB.port}/${process.env.MONGODB_database}`;
      return await mongoose.connect(uri, connectOptions);
    },
  },
];
