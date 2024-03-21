import { Module } from '@nestjs/common';
import { LoggerModule } from './core/logger/Logger.module';
import { MongoDBModule } from './core/database/MongoDB/mongo.module';
import { BannerModule } from './core/modules/banners/banner.module';
import { BoardModule } from './core/modules/boards/board.module';
import { CustomerModule } from './core/modules/Customer/customer.module';
import { ArkModule } from './core/modules/Ark/ark.module';

@Module({
  imports: [LoggerModule, MongoDBModule, BannerModule, BoardModule, CustomerModule, ArkModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
