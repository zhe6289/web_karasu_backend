import { Connection } from 'mongoose';
import { ImageUploadSchema, BannerSchema } from './BannerSetting.schema';

import {
  DB_CONNECTION_TOKEN,
  BannerSetting_TOKEN,
  ImageUpload_TOKEN,
} from '../../constants/system.constant';
export const BannerProviders = [
  {
    provide: BannerSetting_TOKEN,
    useFactory: (connection: Connection) =>
      connection.model('BannerSetting', BannerSchema, 'BannerSetting'),
    inject: [DB_CONNECTION_TOKEN],
  },
  {
    provide: ImageUpload_TOKEN,
    useFactory: (connection: Connection) =>
      connection.model('ImageUpload', ImageUploadSchema, 'ImageUpload'),
    inject: [DB_CONNECTION_TOKEN],
  },
];
