import { IsString, IsNotEmpty, IsNumber} from 'class-validator';

export class ArkCommandDto {
    @IsString()
    @IsNotEmpty()
    ark_id: string;

    @IsString()
    @IsNotEmpty()
    ark_token: string;

    @IsString()
    @IsNotEmpty()
    platform: string;

    @IsString()
    @IsNotEmpty()
    cmd_id: string;

    @IsString()
    @IsNotEmpty()
    cmd_name: string;

    @IsNotEmpty()
    cmd_data: object;
}

export class ArkDirectCommandDto {
    @IsString()
    @IsNotEmpty()
    platform: string;

    @IsString()
    @IsNotEmpty()
    cmd_id: string;

    @IsString()
    @IsNotEmpty()
    cmd_name: string;

    @IsNotEmpty()
    cmd_data: object;
}

export class ArkLoginDto {
    @IsString()
    @IsNotEmpty()
    from_id: string;

    @IsString()
    @IsNotEmpty()
    from_token: string;

    @IsString()
    @IsNotEmpty()
    from_type: string;
}