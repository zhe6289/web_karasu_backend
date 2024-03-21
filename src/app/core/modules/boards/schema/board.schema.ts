/**
 * 作者：王性驊 danielwang
 * 日期：2019-06-05
 * 檔案：board.schema.ts
 * 功能：board 種類列表
 * 資料表名稱  systemBoard 、 actBoard
 */

import { Schema } from 'mongoose';

// _id 不會寫進來
export const BoardSchema: Schema = new Schema({
  lan: Array,
  displayStartTime: Date,
  create_timestamp: String,
  name: String,
  displayEndTime: Date,
  top: Boolean,
  Id: Object,
  platform: Array,
  lastModifyTime: Date,
  lastEditor: String,
  display: Boolean,
  classify: String,
  tag_category: Array,
  html_zh_Hant: String,
  html_en: String,
  title_zh_Hant: String,
  title_en: String,
});

export const BoardCategorySchema: Schema = new Schema({
  upate_time: Date,
  ord: Number,
  id: Number,
  name: String,
});
