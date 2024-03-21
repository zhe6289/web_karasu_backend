/**
 * 作者：王性驊 danielwang
 * 日期：2019-06-19
 * 檔案：error.filter
 * 功能：將全域只要是從 controller 進來的錯誤都接回這裡，回應給請求的人
 * 本程式使用 帕斯卡命名法
 *  單字之間不以空格斷開或連線號（-）、下劃線（_）連結，第一個單字首字母採用大寫字母；後續單字的首字母亦用大寫字母
 */
import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

import { isDevMode } from '../constants/service.constant';
import {
  TMessage,
  TExceptionOption,
  EHttpStatus,
  THttpErrorResponse,
} from '../interfaces/http.interface';
import * as lodash from 'lodash';

/**
 * @class HttpExceptionFilter
 * @classdesc 攔截整個程式的異常，在這裡規範化輸出 THttpErrorResponse
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorOption: TExceptionOption = exception.message as TExceptionOption;
    const isString = (value): value is TMessage => lodash.isString(value);
    const errMessage = isString(errorOption)
      ? errorOption
      : errorOption.message;
    const errorInfo = isString(errorOption) ? null : errorOption.error;
    const parentErrorInfo = errorInfo ? String(errorInfo) : null;
    const isChildrenError = errorInfo.status && errorInfo.message;
    const resultError = isChildrenError ? errorInfo.message : parentErrorInfo;
    const resultStatus = isChildrenError ? errorInfo.status : status;
    let data: THttpErrorResponse = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: errMessage,
      error: resultError,
    };
    if (isDevMode) {
      data['debug'] = exception.stack;
    }
    // 對於預設的 404 進行特殊處理
    if (status === HttpStatus.NOT_FOUND && data.error === 'Not Found') {
      data.error = `資源不存在`;
      data.message = `API ${request.method} -> ${request.url} 無效`;
    }
    return response.status(resultStatus).jsonp(data);
  }
}
