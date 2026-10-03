export const INSTANCE_STATE_TEXT: Record<string, string> = {
  notAuthorized:
    "Инстанс не авторизован. Отсканируйте QR-код в кабинете GREEN-API — до этого отправка и получение сообщений не работают.",
  blocked: "Инстанс заблокирован. Сообщения не отправляются и не принимаются.",
  sleepMode:
    "Телефон не в сети — инстанс в спящем режиме. После включения телефона статус обновится в течение 5 минут.",
  starting: "Инстанс запускается. Это может занять до 5 минут.",
  suspended:
    "На аккаунте временные ограничения. Отправленные сообщения могут храниться в очереди до 24 часов.",
  yellowCard:
    "На аккаунте временные ограничения. Отправленные сообщения могут храниться в очереди до 24 часов.",
};

export const getUnknownInstanceStateText = (state: string): string =>
  `Состояние инстанса: ${state}. Сообщения могут не отправляться.`;

export const LOGIN_TEXT = {
  emptyFields: "Заполните оба поля",
  connectionFailed:
    "Не удалось подключиться. Проверьте idInstance и apiTokenInstance.",
};

export const NEW_CHAT_TEXT = {
  invalidPhone: "Введите номер в международном формате, например 77089292325",
  noWhatsapp:
    "На этом номере нет WhatsApp — сообщения не дойдут. Проверьте номер или нажмите «Создать» ещё раз.",
  checkFailed:
    "Номер не принят GREEN-API — вероятно, он указан неверно. Нажмите «Создать» ещё раз, чтобы всё равно открыть чат.",
};

export const SEND_MESSAGE_ERROR = "Не удалось отправить сообщение";

export const RECEIVE_NOTIFICATION_ERROR = "Ошибка опроса уведомлений";

export const NO_MESSAGE_ID_ERROR = "GREEN-API не вернул idMessage";

export const RECEIVE_TIMEOUT_SECONDS = 5;

export const INSTANCE_STATE_POLL_INTERVAL = 30_000;

export const RETRY_DELAY = 5000;
