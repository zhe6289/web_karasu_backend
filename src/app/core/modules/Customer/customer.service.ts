import { Injectable } from '@nestjs/common';
import * as Crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import Axios from 'axios';
import * as FormData from 'form-data';
import { GameTower } from 'src/app/app.config';
// import * as qs from 'qs';
// import * as atob from 'atob'

@Injectable()
export class CustomerService {
    env: string = ''
    constructor() {
        this.env = process.env.NODE_ENV
    }   
    public async getList(query) {

        try {
            let data = {
                game: GameTower.game || '',
                username: `${GameTower.game}_${query.ark_id}`,
                memberno: GameTower.member_no || '',
                uni_business: GameTower.uni_business || '',
                lan: query.lang || GameTower.lan,
                platform: GameTower.platform || '',
            };
            data['check_code'] = this.getReportSha1String(data);
            let url = this.dataToUrl('common/receive/BugReport/GetRecord.aspx', data);
            let result = await this.sendRequest(url);
            return result
        } catch (err) {
            return { status: 591, msg: 'getListError' };
        }
    }

    async getClassCode(lang) {
        let data = {
            game: GameTower.game || '',
            memberno: GameTower.member_no || '',
            uni_business: GameTower.uni_business || '',
            lan: lang || GameTower.lan,
            platform: GameTower.platform || '',
        };
        data['check_code'] = this.getReportSha1String(data);
        let url = this.dataToUrl('/common/receive/BugReport/GetClassList.aspx', data);
        let result = await this.sendRequest(url);
        return result;
    }

    async reportBug(body, files) {
        const data = {
            game: GameTower.game || '',
            class_no: body.class_no,
            member_no: GameTower.member_no || '0',
            phone: '',
            username: `${GameTower.game}_${body.username}`,
            email: body.email,
            message: body.message,
            uni_business: GameTower.uni_business || '',
            os: '',
            info: body.info || '',
            viplevel: body.viplevel || 0,
            lang: body.lang ? body.lang : GameTower.lan,
            platform: GameTower.platform || ''
        };
        data['check_code'] = this.getReportSha1String(data);
        const form = new FormData()
        for(let key in data) {
            form.append(key, data[key])
        }
        files.forEach((file) => {
            form.append('files[]', file.buffer, file.originalname)
        });
        let url = '/common/receive/BugReport/BugReportFromGame.aspx'
        try {
            let result = await this.postRequest(url, form, form.getHeaders())
            return result 
        } catch (error) {
            return error
        }
    }

    checkFile(files) {
        if(files.length) return
        let AllowMimetype = ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4', 'video/quicktime'];
        let FileLimitKB = 1024 * 1024 * 10; //10MB
        for(let idx in files) {
            if (files[idx].size > FileLimitKB) {
                throw '檔案超過10MB'
            } else if (!AllowMimetype.includes(files[idx].mimetype)) {
                throw '檔案格式錯誤'
            }
        }
    }

    decodeSTR(s) {
        let parsedWordArray = CryptoJS.enc.Base64.parse(s);
        let parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
        return parsedStr;
    }

    // ----------------------- 工具區 --------------------------

    private getCheckCode(data) {
        const keys = Object.keys(data).sort(function order(key1, key2) {
            if (key1 < key2) return -1;
            else if (key1 > key2) return +1;
            else return 0;
        });
        let str = '';
        keys.forEach(key => {
            str += data[key]
        })
        str += process.env.GameTower_private_key        
        return str;
    }

    private getReportSha1String(data) {
        let sha1_string = this.getCheckCode(data);
        let hashed_string = Crypto.createHash('sha1')
            .update(sha1_string)
            .digest('hex');
        return hashed_string.toUpperCase();
    }
    private dataToUrl(url, data) {
        let urlString = url + '?';
        for (let i in data) {
            const str = `${i}=${data[i]}&`;
            urlString += str;
        }
        return urlString.substring(0, urlString.length - 1);
    }

    private async sendRequest(url, headers = {}, timeout = 5000) {
        let Request = Axios.create({
            baseURL: GameTower['host'],
            timeout: timeout,
            headers: headers,
        });
        try{
            let result = await Request.get(url)
            if (result.data.RESULT_CODE === undefined) result.data.RESULT_CODE = 0
            return { status: parseInt(result.data.RESULT_CODE), msg: result.data };
        } catch(err) {
            return { status: 871, msg: err };
        }
    }

    private async postRequest(url, body={}, headers={}, timeout=5000) {
        let Request = Axios.create({
            baseURL: GameTower['host'],
            timeout: timeout,
            headers: headers,
        });
        try{
            let result = await Request.post(url, body)
            return { status: parseInt(result.data.RESULT_CODE), msg: result.data };
        } catch(err) {
            return { status: 871, msg: err };
        }
    }
}
