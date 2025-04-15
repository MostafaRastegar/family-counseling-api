import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsBoolean } from "class-validator";

export class UpdateAvailabilityDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
