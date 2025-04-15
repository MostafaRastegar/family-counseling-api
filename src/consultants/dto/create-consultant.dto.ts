import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateConsultantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ type: [String], description: "List of specialties" })
  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @ApiProperty({ description: "Consultant biography" })
  @IsNotEmpty()
  @IsString()
  bio: string;

  @ApiProperty({ description: "Education and qualifications" })
  @IsNotEmpty()
  @IsString()
  education: string;

  @ApiProperty({ required: false })
  @IsString()
  consultantLicense?: string;
}
