/**
 * 作者：王性驊 danielwang
 * 日期：2019-10-17
 * 檔案：banner.schema.ts
 * 功能：banner 輪播所需要顯示的資訊
 * 資料表名稱 BannerSetting
 */

import { Schema } from 'mongoose';

// _id 不會寫進來
export const BannerSchema: Schema = new Schema({
  lan: Array,
  products_priority: Object,
  enable: Boolean,
  activity_start_time: Date,
  activity_end_time: Date,
  lastModifyTime: Date,
  lastEditor: String,
  activity_name: String,
  action_type: String,
});

export const ImageUploadSchema: Schema = new Schema({
  fileExtend: String,
  name: String,
  filePath: String,
  detail: String,
  lastModifyTime: Date,
  link: String,
  lastEditor: String,
  type: String,
  id: String,
});
