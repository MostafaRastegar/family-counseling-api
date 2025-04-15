import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from "@nestjs/swagger";
import { MessagingService } from "./messaging.service";
import { SendMessageDto } from "./dto/send-message.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { MessengerResponse } from "./interfaces/messenger.interface";

@ApiTags("messaging")
@Controller("messaging")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post("send")
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Send a message to a client" })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: 200,
    description: "Message sent successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        messageId: { type: "string", example: "msg_12345678" },
        error: { type: "string", nullable: true, example: null },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid input" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Requires consultant or admin role",
  })
  @ApiResponse({ status: 404, description: "Messenger type not found" })
  sendMessage(
    @Body() sendMessageDto: SendMessageDto
  ): Promise<MessengerResponse> {
    return this.messagingService.sendMessage(sendMessageDto);
  }
}
