import { Module } from '@nestjs/common';
import { MongoDBModule } from '../../database/MongoDB/mongo.module';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { BannerProviders } from './banner.provider';

@Module({
  imports: [MongoDBModule],
  controllers: [BannerController],
  providers: [...BannerProviders, BannerService],
})
export class BannerModule {}
