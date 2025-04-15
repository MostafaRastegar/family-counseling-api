import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsArray } from "class-validator";

export class ConsultantFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  isVerified?: boolean = true;
}
