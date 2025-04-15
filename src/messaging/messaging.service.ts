import { Injectable, NotFoundException } from "@nestjs/common";
import { TelegramProvider } from "./providers/telegram.provider";
import { WhatsAppProvider } from "./providers/whatsapp.provider";
import { SendMessageDto, MessengerType } from "./dto/send-message.dto";
import { MessengerResponse } from "./interfaces/messenger.interface";
import { SessionsService } from "../sessions/sessions.service";

@Injectable()
export class MessagingService {
  constructor(
    private telegramProvider: TelegramProvider,
    private whatsAppProvider: WhatsAppProvider,
    private sessionsService: SessionsService
  ) {}

  async sendMessage(
    sendMessageDto: SendMessageDto
  ): Promise<MessengerResponse> {
    // Get the appropriate messenger provider
    const messenger = this.getMessengerByType(sendMessageDto.messengerType);

    // Send the message
    const response = await messenger.sendMessage({
      recipientId: sendMessageDto.recipientId,
      text: sendMessageDto.text,
      sessionId: sendMessageDto.sessionId,
    });

    // If a session ID was provided and the message was sent successfully,
    // update the session with the messenger information
    if (sendMessageDto.sessionId && response.success) {
      await this.sessionsService.update(sendMessageDto.sessionId, {
        messengerId: sendMessageDto.recipientId,
        messengerType: sendMessageDto.messengerType,
      });
    }

    return response;
  }

  private getMessengerByType(type: MessengerType) {
    switch (type) {
      case MessengerType.TELEGRAM:
        return this.telegramProvider;
      case MessengerType.WHATSAPP:
        return this.whatsAppProvider;
      default:
        throw new NotFoundException(`Messenger type ${type} not found`);
    }
  }
}
