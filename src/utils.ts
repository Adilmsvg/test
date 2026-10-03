export const toChatId = (rawPhone: string): string | null => {
  let digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8"))
    digits = `7${digits.slice(1)}`;
  if (digits.length < 10 || digits.length > 15) return null;
  return `${digits}@c.us`;
};

export const formatChatName = (chatId: string): string => {
  const digits = chatId.split("@")[0];
  if (!/^\d+$/.test(digits)) return chatId;

  if (digits.length === 11 && digits.startsWith("7")) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }
  return `+${digits}`;
};

export const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const isSameDay = (a: Date, b: Date): boolean =>
  a.toDateString() === b.toDateString();

const getYesterday = (): Date => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

export const formatChatDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  if (isSameDay(date, new Date())) return formatTime(timestamp);
  if (isSameDay(date, getYesterday())) return "Вчера";
  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const formatDayDivider = (timestamp: number): string => {
  const date = new Date(timestamp);

  if (isSameDay(date, new Date())) return "Сегодня";
  if (isSameDay(date, getYesterday())) return "Вчера";
  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
