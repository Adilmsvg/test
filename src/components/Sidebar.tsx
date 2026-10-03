import type { Chat, Message } from "../types";
import { formatChatDate } from "../utils";
import { Avatar } from "./Avatar";
import { LogoutIcon, PlusIcon } from "./icons";

interface Props {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
  online: boolean;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
}

export const Sidebar = ({
  chats,
  messages,
  activeChatId,
  online,
  onSelectChat,
  onNewChat,
  onLogout,
}: Props) => (
  <aside className="sidebar">
    <header className="sidebar__header">
      <span className="sidebar__title">WhatsApp</span>
      <span className={`sidebar__status ${online ? "is-online" : ""}`}>
        {online ? "на связи" : "нет связи"}
      </span>

      <button
        className="icon-button"
        onClick={onNewChat}
        title="Новый чат"
        aria-label="Новый чат"
      >
        <PlusIcon />
      </button>

      <button
        className="icon-button"
        onClick={onLogout}
        title="Выйти"
        aria-label="Выйти"
      >
        <LogoutIcon />
      </button>
    </header>

    <div className="sidebar__list">
      {chats.length === 0 && (
        <p className="sidebar__empty">
          Чатов пока нет.
          <br />
          Нажмите «+», чтобы начать переписку.
        </p>
      )}

      {chats.map((chat) => {
        const history = messages[chat.id] ?? [];
        const last = history[history.length - 1];

        return (
          <button
            key={chat.id}
            className={`chat-item ${chat.id === activeChatId ? "is-active" : ""}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <Avatar name={chat.name} />
            <div className="chat-item__body">
              <div className="chat-item__row">
                <span className="chat-item__name">{chat.name}</span>
                <span className="chat-item__time">
                  {formatChatDate(chat.updatedAt)}
                </span>
              </div>
              <span className="chat-item__preview">
                {last
                  ? `${last.direction === "out" ? "Вы: " : ""}${last.text}`
                  : "Нет сообщений"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  </aside>
);
