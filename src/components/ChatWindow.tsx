import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { Chat, Message } from "../types";
import { formatDayDivider } from "../utils";
import { Avatar } from "./Avatar";
import { MessageBubble } from "./MessageBubble";
import { BackIcon, SendIcon } from "./icons";

interface Props {
  chat: Chat;
  messages: Message[];
  onSend: (text: string) => void;
  onBack: () => void;
}

export const ChatWindow = ({ chat, messages, onSend, onBack }: Props) => {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [chat.id, messages.length]);

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  let lastDay = "";

  return (
    <section className="chat">
      <header className="chat__header">
        <button
          className="icon-button chat__back"
          onClick={onBack}
          aria-label="Назад"
        >
          <BackIcon />
        </button>
        <Avatar name={chat.name} size={40} />
        <div className="chat__titles">
          <span className="chat__name">{chat.name}</span>
          <span className="chat__meta">{chat.id}</span>
        </div>
      </header>

      <div className="chat__messages">
        {messages.length === 0 && (
          <p className="chat__empty">Сообщений пока нет — напишите первым.</p>
        )}

        {messages.map((message) => {
          const day = formatDayDivider(message.timestamp);
          const showDivider = day !== lastDay;
          lastDay = day;

          return (
            <div key={message.id}>
              {showDivider && <div className="chat__day">{day}</div>}
              <MessageBubble message={message} />
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <textarea
          className="composer__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение"
          rows={1}
        />
        <button
          className="composer__send"
          type="submit"
          disabled={!text.trim()}
          aria-label="Отправить"
        >
          <SendIcon />
        </button>
      </form>
    </section>
  );
};
