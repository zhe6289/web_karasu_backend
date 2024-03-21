import { Document } from 'mongoose';

export interface IBoard extends Document {
  lan: string[];
  displayStartTime: Date;
  create_timestamp: Date;
  name: string;
  displayEndTime: Date;
  top: boolean;
  Id: object;
  platform: string[];
  lastModifyTime: Date;
  lastEditor: string;
  display: boolean;
  classify: string;
  tag_category: string[];
  html_zh_Hant: string;
  html_en: string;
  title_zh_Hant: string;
  title_en: string;
}

export interface IBoardCategory extends Document {
  upate_time: Date;
  ord: number;
  id: number;
  name: string;
}

export interface IQueryActBoardData extends Object {
  tag_category?: string;
  classify?: string;
  lang?: string;
  platform?: string;
  limit?: number;
  page?: number;
}
