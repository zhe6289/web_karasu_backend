import { Document } from 'mongoose';

export interface IBanner extends Document {
  lan: string[];
  products_priority: object[];
  enable: boolean;
  activity_start_time: Date;
  activity_end_time: Date;
  lastModifyTime: Date;
  lastEditor: string;
  activity_name: string;
  action_type: string;
}

export interface IImageUpload extends Document {
  fileExtend: string;
  name: string;
  filePath: string;
  detail: string;
  lastModifyTime: Date;
  link: string;
  lastEditor: string;
  type: string;
  id: string;
}
