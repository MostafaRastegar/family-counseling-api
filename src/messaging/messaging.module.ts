import { Module } from "@nestjs/common";
import { MessagingService } from "./messaging.service";
import { MessagingController } from "./messaging.controller";
import { TelegramProvider } from "./providers/telegram.provider";
import { WhatsAppProvider } from "./providers/whatsapp.provider";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [SessionsModule],
  controllers: [MessagingController],
  providers: [MessagingService, TelegramProvider, WhatsAppProvider],
  exports: [MessagingService],
})
export class MessagingModule {}
