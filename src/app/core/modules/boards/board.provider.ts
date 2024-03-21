import { Connection } from 'mongoose';
import { BoardSchema, BoardCategorySchema } from './schema/board.schema';

import {
  DB_CONNECTION_TOKEN,
  actBoard_MODEL_TOKEN,
  sysBoard_MODEL_TOKEN,
  CategoryBoard_MODEL_TOKEN,
} from '../../constants/system.constant';

export const BoardProviders = [
  {
    provide: actBoard_MODEL_TOKEN,
    useFactory: (connection: Connection) =>
      connection.model('actBoard', BoardSchema, 'actBoard'),
    inject: [DB_CONNECTION_TOKEN],
  },
  {
    provide: sysBoard_MODEL_TOKEN,
    useFactory: (connection: Connection) =>
      connection.model('systemBoard', BoardSchema, 'systemBoard'),
    inject: [DB_CONNECTION_TOKEN],
  },
  {
    provide: CategoryBoard_MODEL_TOKEN,
    useFactory: (connection: Connection) =>
      connection.model(
        'systemBoardCategory',
        BoardCategorySchema,
        'systemBoardCategory',
      ),
    inject: [DB_CONNECTION_TOKEN],
  },
];
