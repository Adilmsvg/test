import type { Chat, Credentials, Message } from "./types";

const CREDENTIALS_KEY = "green-api:credentials";
const historyKey = (idInstance: string) => `green-api:history:${idInstance}`;

export interface History {
  chats: Chat[];
  messages: Record<string, Message[]>;
}

const EMPTY_HISTORY: History = { chats: [], messages: {} };

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const loadCredentials = (): Credentials | null =>
  read<Credentials | null>(CREDENTIALS_KEY, null);

export const saveCredentials = (cred: Credentials): void =>
  write(CREDENTIALS_KEY, cred);

export const clearCredentials = (): void => {
  try {
    localStorage.removeItem(CREDENTIALS_KEY);
  } catch {}
};

export const loadHistory = (idInstance: string): History =>
  read(historyKey(idInstance), EMPTY_HISTORY);

export const saveHistory = (idInstance: string, history: History): void =>
  write(historyKey(idInstance), history);
