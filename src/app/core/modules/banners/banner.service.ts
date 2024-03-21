import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  BannerSetting_TOKEN,
  ImageUpload_TOKEN,
} from '../../constants/system.constant';
import * as moment from 'moment';
import { IBanner, IImageUpload } from './banner.interface';
import { ServiceConstant } from '../../constants/service.constant';

@Injectable()
export class BannerService {
  constructor(
    @Inject(BannerSetting_TOKEN)
    private readonly bannerSettingModel: Model<IBanner>,
    @Inject(ImageUpload_TOKEN)
    private readonly imageUploadModel: Model<IImageUpload>,
  ) {}

  async findDetilData(query) {
    // 取得基本資訊
    let nowUtcTimeStamp = moment
      .utc()
      .utcOffset(ServiceConstant.board.default.timezone)
      .format('x')
    let queryData = {
      $and: [
        { activity_end_time: { $gte: new Date(parseInt(nowUtcTimeStamp)) } },
        { activity_start_time: { $lt: new Date(parseInt(nowUtcTimeStamp)) } },
        { enable: true },
      ],
    };
    let bannerData = await this.bannerSettingModel.find(queryData).sort({
      lastModifyTime: -1,
    });
    // 將基本資訊與圖片資訊綁定
    let bannerList = { fixed: [], carousel: [] };
    for (let element of bannerData) {
      let actionType = element['action_type'];
      // 取得該筆資訊該種語言的圖片資訊
      // 1. 取得語言內容筆數
      var size = 0,
        key;
      for (key in element['products_priority'][query.lang]) {
        if (element['products_priority'][query.lang].hasOwnProperty(key))
          size++;
      }
      // 2. 取得檔案名稱 並且加入 List
      for (let item = 0; item < size; item++) {
        let fileName = element['products_priority'][query.lang][item + 1];
        if (
          bannerList.fixed.indexOf(fileName) === -1 ||
          bannerList.carousel.indexOf(fileName) === -1
        ) {
          if (actionType === 'fixed' && bannerList.fixed.length >= 2) {
            break;
          }
          let img = await this.imageUploadModel.findOne({ id: fileName });
          bannerList[actionType].push(img);
        }
      }
    }
    return bannerList['carousel'];
  }
}
