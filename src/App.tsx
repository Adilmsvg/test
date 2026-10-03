import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { InstanceStateBanner } from "./components/InstanceStateBanner";
import { LoginScreen } from "./components/LoginScreen";
import { NewChatDialog } from "./components/NewChatDialog";
import { Sidebar } from "./components/Sidebar";
import { useNotifications } from "./hooks/useNotifications";
import { getStateInstance, sendMessage } from "./api/greenApi";
import { INSTANCE_STATE_POLL_INTERVAL, SEND_MESSAGE_ERROR } from "./constants";
import {
  clearCredentials,
  loadCredentials,
  loadHistory,
  saveCredentials,
  saveHistory,
  type History,
} from "./storage";
import type { Credentials, Message, NotificationBody } from "./types";
import { formatChatName } from "./utils";

const EMPTY: History = { chats: [], messages: {} };

const extractText = (body: NotificationBody): string | null => {
  const data = body.messageData;
  if (!data) return null;
  if (data.typeMessage === "textMessage")
    return data.textMessageData?.textString ?? null;
  if (data.typeMessage === "extendedTextMessage")
    return data.extendedTextMessageData?.text ?? null;
  return null;
};

const App = () => {
  const [credentials, setCredentials] = useState<Credentials | null>(() =>
    loadCredentials(),
  );
  const [history, setHistory] = useState<History>(EMPTY);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [instanceState, setInstanceState] = useState<string | null>(null);

  useEffect(() => {
    if (!credentials) {
      setHistory(EMPTY);
      setLoadedFor(null);
      return;
    }
    setHistory(loadHistory(credentials.idInstance));
    setLoadedFor(credentials.idInstance);
    setActiveChatId(null);
  }, [credentials?.idInstance]);

  useEffect(() => {
    if (credentials && loadedFor === credentials.idInstance) {
      saveHistory(credentials.idInstance, history);
    }
  }, [credentials, loadedFor, history]);

  useEffect(() => {
    if (!credentials) {
      setInstanceState(null);
      return;
    }

    let stopped = false;
    const check = () =>
      getStateInstance(credentials)
        .then((state) => {
          if (!stopped) setInstanceState(state);
        })
        .catch(() => {});

    check();
    const timer = setInterval(check, INSTANCE_STATE_POLL_INTERVAL);

    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [credentials?.idInstance, credentials?.apiTokenInstance]);

  const upsertMessage = useCallback((message: Message) => {
    setHistory((prev) => {
      const list = prev.messages[message.chatId] ?? [];
      const index = list.findIndex((item) => item.id === message.id);
      const nextList =
        index === -1
          ? [...list, message]
          : list.map((item, i) =>
              i === index ? { ...item, ...message } : item,
            );

      const chatExists = prev.chats.some((chat) => chat.id === message.chatId);
      const chats = chatExists
        ? prev.chats.map((chat) =>
            chat.id === message.chatId
              ? {
                  ...chat,
                  updatedAt: Math.max(chat.updatedAt, message.timestamp),
                }
              : chat,
          )
        : [
            ...prev.chats,
            {
              id: message.chatId,
              name: formatChatName(message.chatId),
              updatedAt: message.timestamp,
            },
          ];

      return {
        chats,
        messages: { ...prev.messages, [message.chatId]: nextList },
      };
    });
  }, []);

  const patchMessage = useCallback(
    (chatId: string, id: string, patch: Partial<Message>) => {
      setHistory((prev) => ({
        ...prev,
        messages: {
          ...prev.messages,
          [chatId]: (prev.messages[chatId] ?? []).map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        },
      }));
    },
    [],
  );

  const handleNotification = useCallback(
    (body: NotificationBody) => {
      if (body.typeWebhook === "stateInstanceChanged") {
        setInstanceState(body.stateInstance ?? null);
        return;
      }

      const incoming = body.typeWebhook === "incomingMessageReceived";
      const outgoing =
        body.typeWebhook === "outgoingMessageReceived" ||
        body.typeWebhook === "outgoingAPIMessageReceived";
      if (!incoming && !outgoing) return;

      const chatId = body.senderData?.chatId;
      const text = extractText(body);
      if (!chatId || !text) return;

      upsertMessage({
        id: body.idMessage ?? crypto.randomUUID(),
        chatId,
        text,
        direction: incoming ? "in" : "out",
        timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
        status: "sent",
      });
    },
    [upsertMessage],
  );

  const online = useNotifications(credentials, handleNotification);

  const handleSend = async (text: string) => {
    if (!credentials || !activeChatId) return;

    const localId = `local-${Date.now()}`;
    const chatId = activeChatId;

    upsertMessage({
      id: localId,
      chatId,
      text,
      direction: "out",
      timestamp: Date.now(),
      status: "sending",
    });

    try {
      const idMessage = await sendMessage(credentials, chatId, text);
      patchMessage(chatId, localId, { id: idMessage, status: "sent" });
    } catch (error) {
      console.error(SEND_MESSAGE_ERROR, error);
      patchMessage(chatId, localId, { status: "error" });
    }
  };

  const handleCreateChat = (chatId: string) => {
    setHistory((prev) =>
      prev.chats.some((chat) => chat.id === chatId)
        ? prev
        : {
            chats: [
              ...prev.chats,
              {
                id: chatId,
                name: formatChatName(chatId),
                updatedAt: Date.now(),
              },
            ],
            messages: {
              ...prev.messages,
              [chatId]: prev.messages[chatId] ?? [],
            },
          },
    );
    setActiveChatId(chatId);
    setDialogOpen(false);
  };

  const handleLogin = (cred: Credentials) => {
    saveCredentials(cred);
    setCredentials(cred);
  };

  const handleLogout = () => {
    clearCredentials();
    setCredentials(null);
  };

  const sortedChats = useMemo(
    () => [...history.chats].sort((a, b) => b.updatedAt - a.updatedAt),
    [history.chats],
  );

  const activeChat =
    sortedChats.find((chat) => chat.id === activeChatId) ?? null;

  if (!credentials) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="shell">
      <InstanceStateBanner state={instanceState} />

      <div className={`app ${activeChat ? "app--chat-open" : ""}`}>
        <Sidebar
          chats={sortedChats}
          messages={history.messages}
          activeChatId={activeChatId}
          online={online}
          onSelectChat={setActiveChatId}
          onNewChat={() => setDialogOpen(true)}
          onLogout={handleLogout}
        />

        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            messages={history.messages[activeChat.id] ?? []}
            onSend={handleSend}
            onBack={() => setActiveChatId(null)}
          />
        ) : (
          <section className="placeholder">
            <h2 className="placeholder__title">WhatsApp Chat на GREEN-API</h2>
            <p className="placeholder__text">
              Выберите чат слева или создайте новый по номеру телефона.
            </p>
          </section>
        )}
      </div>

      {dialogOpen && (
        <NewChatDialog
          credentials={credentials}
          onCreate={handleCreateChat}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
