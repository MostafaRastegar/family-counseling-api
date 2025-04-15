import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export enum MessengerType {
  TELEGRAM = "telegram",
  WHATSAPP = "whatsapp",
}

export class SendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ enum: MessengerType })
  @IsNotEmpty()
  @IsEnum(MessengerType)
  messengerType: MessengerType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  sessionId?: string;
}
