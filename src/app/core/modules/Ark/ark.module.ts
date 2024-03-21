import { Module } from '@nestjs/common';
import { ArkController } from './ark.controller';
import { ArkService } from './ark.service';

@Module({
  controllers: [ArkController],
  providers: [ArkService],
  exports: [ArkService]
})
export class ArkModule{}