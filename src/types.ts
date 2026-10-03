export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface Chat {
  id: string;
  name: string;
  updatedAt: number;
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  direction: "in" | "out";
  timestamp: number;
  status?: "sending" | "sent" | "error";
}

export interface NotificationBody {
  typeWebhook: string;
  timestamp?: number;
  idMessage?: string;
  stateInstance?: string;
  senderData?: {
    chatId: string;
    sender?: string;
    senderName?: string;
  };
  messageData?: {
    typeMessage: string;
    textMessageData?: { textString: string };
    extendedTextMessageData?: { text: string };
  };
}

export interface Notification {
  receiptId: number;
  body: NotificationBody;
}
