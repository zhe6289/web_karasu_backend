import { Controller, Post, Body, Get, UseInterceptors, Query, UploadedFiles, Res, Request } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CustomerService } from './customer.service';
import { Express, Response } from 'express';
import { getRecordBodyDTO } from './customer.dto';

@Controller('customer')
// tslint:disable-next-line:class-name
export class CustomerController {
    constructor(private readonly Service: CustomerService) { }

    @Get('/class')
    async getClassTypeCode(@Query('lang') lang, @Res() res: Response) {
        try {
            let result = await this.Service.getClassCode(lang);
            res.json(result)
        } catch (err) {
            res.json({ status: 489, msg: 'query fails' })
        }
    }

    @Post('/record')
    async getQuestionList(@Body() body: getRecordBodyDTO, @Res() res: Response) {
        try {
            if(!body.ark_id) throw '缺少ark_id'
            let result = await this.Service.getList(body);
            res.json(result)
        } catch (err) {
            res.json({ status: 489, msg: err });
        }
    }

    @UseInterceptors(FilesInterceptor('files'))
    @Post('/report')
    async postBugReport(@Body() body, @UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        try {
            this.Service.checkFile(files)
            if(!body.email) throw '缺少email'
            if(!body.message) throw '缺少message'
            if(!body.class_no) throw '缺少class_no'
            if(!body.username) throw '缺少username'
            const result = await this.Service.reportBug(body, files)
            res.json(result)
        } catch (error) {
            res.json({ status: 400, msg: error })
        }
    }

    @Get('/clientIp')
    getClientIp(@Request() request: any): { ip: string, ipv4: string, ipv6: string } {
        const xForwardedFor = request.headers['x-forwarded-for'];
        console.log('xForwardedFor:', xForwardedFor);
        
        const ipv6Address = request.socket.remoteAddress;
        console.log('IPv6:', ipv6Address);
        
        const ip = typeof xForwardedFor === 'string'
            ? xForwardedFor.split(',')[0]
            : xForwardedFor?.[0] || '';
        
        // 如果 IPv6 地址有 `::ffff:` 前綴，則提取出 IPv4 部分
        const ipv4MappedPrefix = '::ffff:';
        let ipv4 = '';
        if (ipv6Address.startsWith(ipv4MappedPrefix)) {
            ipv4 = ipv6Address.substring(ipv4MappedPrefix.length);
        }
        
        return { ip, ipv4, ipv6: ipv6Address };
    }
}
