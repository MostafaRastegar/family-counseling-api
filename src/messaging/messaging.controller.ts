import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { MessagingService } from "./messaging.service";
import { SendMessageDto } from "./dto/send-message.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("messaging")
@Controller("messaging")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post("send")
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Send a message to a client" })
  @ApiResponse({ status: 200, description: "Message sent successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messagingService.sendMessage(sendMessageDto);
  }
}
