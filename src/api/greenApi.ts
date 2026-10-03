import { NO_MESSAGE_ID_ERROR, RECEIVE_TIMEOUT_SECONDS } from "../constants";
import type { Credentials, Notification } from "../types";

const baseUrl = ({ idInstance }: Credentials): string => {
  const prefix = idInstance.slice(0, 4);
  return /^\d{4}$/.test(prefix)
    ? `https://${prefix}.api.green-api.com`
    : "https://api.green-api.com";
};

const methodUrl = (cred: Credentials, method: string, tail = ""): string =>
  `${baseUrl(cred)}/waInstance${cred.idInstance}/${method}/${cred.apiTokenInstance}${tail}`;

const request = async <T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> => {
  const response = await fetch(url, init);

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `GREEN-API ${response.status}: ${details || response.statusText}`,
    );
  }

  const text = await response.text();
  if (!text || text === "null") return null;
  return JSON.parse(text) as T;
};

export const getStateInstance = async (cred: Credentials): Promise<string> => {
  const data = await request<{ stateInstance: string }>(
    methodUrl(cred, "getStateInstance"),
  );
  return data?.stateInstance ?? "unknown";
};

export const checkWhatsapp = async (
  cred: Credentials,
  phoneNumber: string,
): Promise<boolean> => {
  const data = await request<{ existsWhatsapp: boolean }>(
    methodUrl(cred, "checkWhatsapp"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: Number(phoneNumber) }),
    },
  );

  return data?.existsWhatsapp ?? false;
};

export const sendMessage = async (
  cred: Credentials,
  chatId: string,
  message: string,
): Promise<string> => {
  const data = await request<{ idMessage: string }>(
    methodUrl(cred, "sendMessage"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, message }),
    },
  );

  if (!data?.idMessage) throw new Error(NO_MESSAGE_ID_ERROR);
  return data.idMessage;
};

export const receiveNotification = async (
  cred: Credentials,
  signal?: AbortSignal,
): Promise<Notification | null> =>
  request<Notification>(
    methodUrl(
      cred,
      "receiveNotification",
      `?receiveTimeout=${RECEIVE_TIMEOUT_SECONDS}`,
    ),
    { signal },
  );

export const deleteNotification = async (
  cred: Credentials,
  receiptId: number,
): Promise<void> => {
  await request(methodUrl(cred, "deleteNotification", `/${receiptId}`), {
    method: "DELETE",
  });
};
