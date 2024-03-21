import { Module } from '@nestjs/common';
import { MongoDBProviders } from './mongo.providers';

@Module({
  providers: [...MongoDBProviders],
  exports: [...MongoDBProviders],
})
export class MongoDBModule {}
