import {
    Controller,
    Get,
    Post,
    Query,
    Param,
    Body,
    ValidationPipe
} from '@nestjs/common';
import { ArkService } from './ark.service';
import { ArkCommandDto, ArkDirectCommandDto, ArkLoginDto } from './dto/arkcommand.dto';

@Controller('ark')
export class ArkController {
    constructor(private readonly arkServeice: ArkService) { }

    // @Post('/login')
    // login(@Body(new ValidationPipe()) ArkLoginDto: ArkLoginDto) {
    //     // return this.arkServeice.sendCommand(ArkLoginDto)
    // }

    @Post('/send')
    send(@Body(new ValidationPipe()) arkCommandDto: ArkCommandDto) {
        return this.arkServeice.sendCommand(arkCommandDto)
    }

    @Post('/sendDirect')
    sendDirect(@Body(new ValidationPipe()) arkDirectCommandDto: ArkDirectCommandDto) {
        return this.arkServeice.sendDirectCommand(arkDirectCommandDto)
    }
}
