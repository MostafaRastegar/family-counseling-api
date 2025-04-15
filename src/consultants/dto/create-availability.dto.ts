import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUUID,
} from "class-validator";

export class CreateAvailabilityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  consultantId: string;

  @ApiProperty({ description: "Start time of availability" })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: "End time of availability" })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;
}
