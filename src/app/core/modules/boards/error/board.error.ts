/**
 * 作者：王性驊 danielwang
 * 日期：2019-06-20
 * 檔案：board.error.ts
 * 功能：錯誤的 error 捕捉
 * 本程式使用 帕斯卡命名法
 *  單字之間不以空格斷開或連線號（-）、下劃線（_）連結，第一個單字首字母採用大寫字母；後續單字的首字母亦用大寫字母
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import {
  TExceptionOption,
  TExceptionOptionStatus,
} from '../../../interfaces/http.interface';

/**
 * @class board error
 * @classdesc default 500
 * @example new BoardError({ message: '錯誤訊息' }, 400)
 * @example new BoardError({ message: '錯誤訊息', error: new Error(xxx) })
 */
export class BoardError extends HttpException {
  constructor(options: TExceptionOptionStatus, statusCode?: HttpStatus) {
    super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
