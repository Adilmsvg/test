import { useEffect, useRef, useState } from "react";
import { deleteNotification, receiveNotification } from "../api/greenApi";
import { RECEIVE_NOTIFICATION_ERROR, RETRY_DELAY } from "../constants";
import type { Credentials, NotificationBody } from "../types";
import { delay } from "../utils";

export const useNotifications = (
  cred: Credentials | null,
  onNotification: (body: NotificationBody) => void,
): boolean => {
  const handler = useRef(onNotification);
  handler.current = onNotification;

  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!cred) {
      setOnline(false);
      return;
    }

    let stopped = false;
    const controller = new AbortController();

    const poll = async () => {
      while (!stopped) {
        try {
          const notification = await receiveNotification(
            cred,
            controller.signal,
          );
          if (stopped) return;
          setOnline(true);

          if (notification) {
            try {
              handler.current(notification.body);
            } finally {
              await deleteNotification(cred, notification.receiptId);
            }
          }
        } catch (error) {
          if (stopped || controller.signal.aborted) return;
          console.error(RECEIVE_NOTIFICATION_ERROR, error);
          setOnline(false);
          await delay(RETRY_DELAY);
        }
      }
    };

    poll();

    return () => {
      stopped = true;
      controller.abort();
    };
  }, [cred?.idInstance, cred?.apiTokenInstance]);

  return online;
};
