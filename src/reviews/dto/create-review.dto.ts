import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  consultantId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  sessionId: string;

  @ApiProperty({ description: "Rating from 1 to 5", minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: "Review comment" })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
