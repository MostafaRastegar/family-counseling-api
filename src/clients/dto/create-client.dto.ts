import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
