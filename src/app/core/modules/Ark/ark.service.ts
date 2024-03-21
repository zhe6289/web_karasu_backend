import { Injectable, Inject, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { Ark } from '../../../app.config';
import Axios from 'axios'
import * as CryptoJS from 'crypto-js';
import * as crypto from 'crypto';
import { LOG4JS_SYSTEM_LOGGER } from '../../constants/system.constant'
import { ArkCommandDto, ArkDirectCommandDto, ArkLoginDto } from './dto/arkcommand.dto';

@Injectable()
export class ArkService implements OnModuleInit {
    private arkKey: string;
    private ark_sn = 0;
    onModuleInit() {
        this._getKey()
    }
    constructor(
        @Inject(LOG4JS_SYSTEM_LOGGER) private readonly logger
    ) { }

    async sendCommand(arkCommandDto: ArkCommandDto) {
        let arkData = {
            ark_id: arkCommandDto.ark_id,
            ark_token: arkCommandDto.ark_token,
            cmd_sn: this.ark_sn,
            platform: arkCommandDto.platform,
            cmd_id: arkCommandDto.cmd_id,
            cmd_name: arkCommandDto.cmd_name,
            cmd_data: arkCommandDto.cmd_data
        }

        const result = await this._clientPost('/command', arkData)
        if (result.msg.cmd_sn === null && result.msg.cmd_data === null)
            throw new HttpException('Token Expired or not Login.', HttpStatus.UNAUTHORIZED)
        if (result.msg === '')
            throw new HttpException('Token Expired or not Login.', HttpStatus.UNAUTHORIZED)
        return result.msg.cmd_data
    }

    async sendDirectCommand(arkDirectCommandDto: ArkDirectCommandDto) {
        let arkData = {
            cmd_sn: this.ark_sn,
            platform: arkDirectCommandDto.platform,
            cmd_id: arkDirectCommandDto.cmd_id,
            cmd_name: arkDirectCommandDto.cmd_name,
            cmd_data: arkDirectCommandDto.cmd_data
        }

        const result = await this._clientPost('/drtcmd', arkData)
        return result
    }

    async arkLogin(arkLoginDto: ArkLoginDto){

    }

    private async _getKey() {
        let resp: any = null;
        try {
            const url = Ark.Host + ':' + Ark.Port
            const Request = Axios.create()
            let result = await Request.get(url)
            this.arkKey = result.data
            return true
        } catch (error) {
            resp = error;
            console.error('Get arkKey failed, please check server url: %s', Ark.Host);
            return false;
        }
    }

    async _clientGet(path){
        const URL = Ark.Host + ':' + Ark.Port + path
        const timeout = Ark.TimeOut
        const SendHeader = { 'Content-type': 'multipart/form-data', Accept: 'text/plain' }
        const Request = Axios.create({ headers: SendHeader, timeout })
        try {
            const result = await Request.get(URL)
            if (result.status != HttpStatus.OK)
                throw new HttpException(result.statusText, result.status)
            if (result.data === '')
                return { code: 0, msg: '' }

            const ArkResult = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(result.data))
            this.logger.info('[ark.service][_clientPost]server_return: ', ArkResult)
            return { code: 0, msg: JSON.parse(ArkResult) }
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async _clientPost(path, arkData = null) {
        this.ark_sn += 1
        this.logger.info('[ark.service][_clientPost]arkDat: ', JSON.stringify(arkData))
        console.log(this.arkKey)
        if (this.arkKey === '') {
            let get_key_success = await this._getKey()
            if (!get_key_success) {
                throw new HttpException('connect to GameServer false', HttpStatus.SERVICE_UNAVAILABLE)
            }
        }

        const timeout = Ark.TimeOut
        const data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(arkData)))
        const URL = Ark.Host + ':' + Ark.Port + path

        // 用ArkKey將arkData做Sha1加密成ArkSign
        let hmac = crypto.createHmac('sha1', this.arkKey)
        hmac.update(data)
        let ArkSign = hmac.digest('hex')
        let ArkForm = { ark_sign: ArkSign, ark_data: data }

        const Body = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(ArkForm)))
        const SendHeader = { 'Content-type': 'multipart/form-data', Accept: 'text/plain' }
        const Request = Axios.create({ headers: SendHeader, timeout })

        try {
            const result = await Request.post(URL, Body)
            if (result.status != HttpStatus.OK)
                throw new HttpException(result.statusText, result.status)
            if (result.data === '')
                return { code: 0, msg: '' }

            const ArkResult = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(result.data))
            this.logger.info('[ark.service][_clientPost]server_return: ', ArkResult)
            return { code: 0, msg: JSON.parse(ArkResult) }
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async _auth(arkData){

    }
}