import {
  Controller,
  Request,
  Response,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { BannerService } from './banner.service';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}
  @Get()
  async getBennerDetils(@Request() res, @Response() req, @Param() params) {
    let query = {
      lang: res.query.lang || 'zh_Hant',
    };
    let OriginalData = await this.bannerService.findDetilData(query);
    return req.status(200).json({
      status: 0,
      data: OriginalData,
    });
  }
}
