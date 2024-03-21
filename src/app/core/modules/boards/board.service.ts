import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  actBoard_MODEL_TOKEN,
  sysBoard_MODEL_TOKEN,
  CategoryBoard_MODEL_TOKEN,
} from '../../constants/system.constant';
import { IBoard, IQueryActBoardData } from './interface/board.interface';
import { IBoardService } from './interface/board.service';
import { BoardError } from './error/board.error';
import * as moment from 'moment';
import { ServiceConstant, isDevMode } from '../../constants/service.constant';

@Injectable()
export class BoardService implements IBoardService {
  constructor(
    @Inject(actBoard_MODEL_TOKEN)
    private readonly actBoardModel: Model<IBoard>,
    @Inject(sysBoard_MODEL_TOKEN)
    private readonly sysBoardModel: Model<IBoard>,
    @Inject(CategoryBoard_MODEL_TOKEN)
    private readonly categoryBoardModel: Model<IBoard>,
  ) {}

  // ====================================== 取得公告筆數 ======================================
  public async getNum(query: Object) {
    let category = query["category"]
    try {
      // 直接取得 utc 時間 跟資料庫內的 utc 時間做比較
      let nowUtcTimeStamp = moment
        .utc()
        .utcOffset(ServiceConstant.board.default.timezone)
        .format('x')
      // query 的條件
      let queryString = {
        platform: query['platform'] || ServiceConstant.board.default.platform,
        lan: query['lang'] || ServiceConstant.board.default.lang,
        displayStartTime: { $lte: new Date(parseInt(nowUtcTimeStamp)) },
        displayEndTime: { $gte: new Date(parseInt(nowUtcTimeStamp)) },
        display: true
      };
      if (query['classify'] && query['classify'] !== 'all'){
          queryString['classify'] = query['classify']
      }
      if (category === 'sys') {
        return await this.sysBoardModel.count(queryString, function(err, count){
          return count
        })
      }
      if (category === "act") {
        return await this.actBoardModel.count(queryString, function (err, count) {
          return count
        })
      }
      return 0
    } catch (e) {
      // query 時出問題
      let errMsg = {
        code: 3,
        message: '錯誤代碼: 5，請聯絡客服人員',
      };
      if (isDevMode) {
        errMsg['error'] = e;
      }
      throw new BoardError(errMsg, 400);
    }
  }
  // ====================================== 取得公告資料列表專區 ======================================

  public async findBoardTagList(board: string, data: IQueryActBoardData) {
    // step 1 組合資料
    let queryString = await this.getQueryData(data);
    // step2 組合過濾資料
    let position = await this.getPositionData(board, queryString.lan);
    // 跳頁要用的資訊
    let skipNum = (data['page'] - 1) * data['limit'];
    // step4 取得資訊
    let result = await this.getQueryResult(
      board,
      queryString,
      position,
      skipNum,
      data['limit'],
    );
    return result;
  }

  // step 1 組合資料
  private async getQueryData(data: IQueryActBoardData) {
    try {
      // 直接取得 utc 時間 跟資料庫內的 utc 時間做比較
      let nowUtcTimeStamp = moment
        .utc()
        .utcOffset(ServiceConstant.board.default.timezone)
        .format('x');
      // query 的條件
      let queryString = {
        lan: data['lang'] || ServiceConstant.board.default.lang,
        displayStartTime: { $lte: new Date(parseInt(nowUtcTimeStamp)) },
        displayEndTime: { $gte: new Date(parseInt(nowUtcTimeStamp)) },
        display: true,
      };
      if (data['platform']) {
        queryString['platform'] = data['platform'];
      }
      if (data['tag_category']) {
        queryString['tag_category'] = data['tag_category'];
      }
      if (data['classify'] && data['classify'] !=='all') {
        queryString['classify'] = data['classify'];
      }
      return queryString;
    } catch (e) {
      // query 時出問題
      let errMsg = {
        code: 1,
        message: '查詢時參數出錯，請重新輸入。',
      };
      if (isDevMode) {
        errMsg['error'] = e;
      }
      throw new BoardError(errMsg, 400);
    }
  }

  // step2 組合過濾資料
  private async getPositionData(board: string, lang: String) {
    try {
      // 組合語言參數
      let TableLangString = 'title_' + lang;
      // 列出資料庫要返回的參數
      let position = {};
      position['_id'] = 1;
      position[TableLangString] = 1;
      position['displayStartTime'] = 1;
      position['top'] = 1;
      if (board === 'sys') {
        position['classify'] = 1;
      }
      if (board === 'act') {
        position['tag_category'] = 1;
      }
      return position;
    } catch (e) {
      // query 時出問題
      let errMsg = {
        code: 2,
        message: `錯誤代碼: 2，請聯絡客服人員`,
      };
      if (isDevMode) {
        errMsg['error'] = e;
      }
      throw new BoardError(errMsg, 400);
    }
  }
  // step4 取得資訊
  private async getQueryResult(
    board: string,
    queryString,
    position,
    skipNum: number,
    limit: number,
  ) {
    try {
      if (board === 'act') {
        return await this.actBoardModel
          .find(queryString, position)
          .sort({ top: -1, displayStartTime: -1 })
          .limit(Number(limit))
          .skip(skipNum);
      }
      return await this.sysBoardModel
        .find(queryString, position)
        .sort({ top: -1, displayStartTime: -1 })
        .limit(Number(limit))
        .skip(skipNum);
    } catch (e) {
      // query 時出問題
      let errMsg = {
        code: 3,
        message: '錯誤代碼: 3，請聯絡客服人員',
      };
      if (isDevMode) {
        errMsg['error'] = e;
      }
      throw new BoardError(errMsg, 400);
    }
  }
  // ====================================== 取得公告資料列表專區 end ======================================

  async findall() {
    return await this.sysBoardModel.find().exec();
  }
  // 依照條件個別搜尋
  // TODO 錯誤處理以及寫ＡＰＩ文件
  async findEach(query: object) {
    try {
      // 直接取得 utc 時間 跟資料庫內的 utc 時間做比較
      let nowUtcTimeStamp = moment
        .utc()
        .utcOffset(ServiceConstant.board.default.timezone)
        .format('x')
      // query 的條件
      let queryString = {
        $and: [
          { _id: Types.ObjectId(query['selectId']) },
          {
            platform:
              query['platform'] || ServiceConstant.board.default.platform,
          },
          { lan: query['lang'] || ServiceConstant.board.default.lang },
          // { displayStartTime: { $lte: nowUtcTimeStamp } },
          { displayEndTime: { $gte: new Date(parseInt(nowUtcTimeStamp)) } },
        ],
      };
      // 判斷使用哪一個 Board 就開啟哪一個連線
      // TODO 未來做動態的
      if (query['boardType'] === 'sys') {
        return await this.sysBoardModel.findOne(queryString);
      }
      if (query['boardType'] === 'act') {
        return await this.actBoardModel.findOne(queryString);
      }
      return null;
    } catch (e) {
      // HttpStatus 400
      // 由於明顯的用戶端錯誤（例如，格式錯誤的請求語法，太大的大小，無效的請求訊息或欺騙性路由請求），伺服器不能或不會處理該請求。
      let errMsg = {
        code: 5,
        message: '錯誤代碼:5 , 查詢的 ID 格式錯誤，請輸入 12 或 24 個字元長度',
      };
      if (isDevMode) {
        errMsg['error'] = e;
      }
      throw new BoardError(errMsg, 400);
    }
  }

  async findCategory() {
    try {
      let projection = { _id: 0, update_time: 0 };
      return await this.categoryBoardModel.find({}, projection);
    } catch (e) {}
  }

  // 以下即將棄用
  async findSystemBoardTagData(query) {
    try {
      // 直接取得 utc 時間 跟資料庫內的 utc 時間做比較
      let nowUtcTimeStamp = moment
        .utc()
        .utcOffset(ServiceConstant.board.default.timezone)
        .format('x')
      // query 的條件
      let queryString = {
        $and: [
          { classify: query['classify'] },
          {
            platform:
              query['platform'] || ServiceConstant.board.default.platform,
          },
          { lan: query['lang'] || ServiceConstant.board.default.lang },
          { displayStartTime: { $lte: new Date(parseInt(nowUtcTimeStamp)) } },
          { displayEndTime: { $gte: new Date(parseInt(nowUtcTimeStamp)) } },
        ],
      };
      console.log(queryString);
      return await this.sysBoardModel.find(queryString);
    } catch (e) {}
  }
}
