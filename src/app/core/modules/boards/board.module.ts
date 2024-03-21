import { Module } from '@nestjs/common';
import { MongoDBModule } from '../../database/MongoDB/mongo.module';
import { BoardProviders } from './board.provider';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [MongoDBModule],
  controllers: [BoardController],
  providers: [...BoardProviders, BoardService],
})
export class BoardModule {}
