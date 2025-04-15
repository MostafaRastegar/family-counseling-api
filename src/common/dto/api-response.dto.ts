import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto<T> {
  @ApiProperty({ description: "Status of the operation", example: true })
  success: boolean;

  @ApiProperty({ description: "Response message", example: "Operation successful" })
  message: string;

  @ApiProperty({ description: "Response data", example: {} })
  data?: T;

  @ApiProperty({ description: "Error description if any", example: null })
  error?: string | null;
}