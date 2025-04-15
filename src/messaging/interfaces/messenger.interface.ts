export interface MessagePayload {
  recipientId: string;
  text: string;
  sessionId?: string;
}

export interface MessengerResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface Messenger {
  sendMessage(payload: MessagePayload): Promise<MessengerResponse>;
  getChannelName(): string;
}
