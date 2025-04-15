import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateSessionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  consultantId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @ApiProperty({ description: "Session date and time" })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    required: false,
    description: "Messenger identifier (e.g., Telegram chat ID)",
  })
  @IsOptional()
  @IsString()
  messengerId?: string;

  @ApiProperty({
    required: false,
    description: "Type of messenger (e.g., telegram, whatsapp)",
  })
  @IsOptional()
  @IsString()
  messengerType?: string;
}
