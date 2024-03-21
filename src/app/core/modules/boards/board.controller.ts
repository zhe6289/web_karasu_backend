import {
  Controller,
  Request,
  Response,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { BoardService } from './board.service';

// 取得系統公告所有資料
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  // 取得 SystemBoard 列表,依照給定的 Tag 做區分，預設是吃全部
  // 取得每一頁的資訊，一頁最多撈10筆資料(預設)
  @Get('list/sys/:tag')
  async getSystemBoardTagList(
    @Request() res,
    @Response() req,
    @Param() params,
  ) {
    let query = {
      classify: params.tag == 'all' ? null : params.tag || null,
      lang: res.query.lang || null,
      platform: res.query.platform || null,
      limit: res.query.limit > 0 ? res.query.limit : 10 || 10,
      page: res.query.page > 0 ? res.query.page : 0 || 1,
    };
    let result = await this.boardService.findBoardTagList('sys', query);
    return req.status(200).json({
      status: 0,
      data: result,
    });
  }

  // 取得 actBoard 列表
  // 取得 SystemBoard 列表,依照給定的 tag_category 欄位做區分，預設是吃全部
  // 取得每一頁的資訊，一頁最多撈10筆資料(預設)
  @Get('list/act/:tag')
  async getActBoardTagList(@Request() res, @Response() req, @Param() params) {
    let query = {
      tag_category: params.tag == 'all' ? null : params.tag || null,
      lang: res.query.lang || null,
      platform: res.query.platform || null,
      limit: res.query.limit > 0 ? res.query.limit : 10 || 10,
      page: res.query.page > 0 ? res.query.page : 0 || 1,
    };
    console.log(res.query.platform);
    let result = await this.boardService.findBoardTagList('act', query);
    return req.status(200).json({
      status: 0,
      data: result,
    });
  }
  // 取得公告類別列表(查id 帶入上列查詢))
  @Get('num/:category')
  async getTotleOfcategory(
    @Request() res,
    @Response() req,
    @Param() params, ) {
    let query = {
      category: params.category,
      classify: res.query.type || null,
      lang: res.query.lang || null,
      platform: res.query.platform || null,
    };
    console.log(query)
    let result = await this.boardService.getNum(query);
    return req.status(200).json({
      status: 0,
      data: result,
    });
  }

  // 獲取個別公告內容(sys/act)
  @Get(':type/:id')
  async getEachBoard(@Request() res, @Response() req, @Param() params) {
    let query = {
      selectId: params.id,
      boardType: params.type,
      lang: res.query.lang || null,
      platform: res.query.platform || null,
    };
    let result = await this.boardService.findEach(query);
    return req.status(200).json({
      status: 0,
      data: result,
    });
  }

  // 取得公告類別列表(查id 帶入上列查詢))
  @Get('category')
  async getBoardCategoryType(@Response() req) {
    let result = await this.boardService.findCategory();
    return req.status(200).json({
      status: 0,
      data: result,
    });
  }



  // 除了金好運日版之外，其他專案部使用以下 Rotue !
  @Get('category/system/:tag')
  async getSystemBoardTagData(
    @Request() res,
    @Response() req,
    @Param() params,
  ) {
    let query = {
      classify: params.tag,
      lang: res.query.lang || null,
      platform: res.query.platform || null,
    };
    let result = await this.boardService.findSystemBoardTagData(query);
    return req.status(200).json({
      status: 0,
      data: result,
    });
  }
}
