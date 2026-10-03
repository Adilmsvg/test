import type { Message } from "../types";
import { formatTime } from "../utils";
import { CheckIcon, ClockIcon } from "./icons";

const StatusIcon = ({ status }: { status?: Message["status"] }) => {
  if (status === "sending") return <ClockIcon className="bubble__status" />;
  if (status === "error")
    return <span className="bubble__status bubble__status--error">!</span>;
  return <CheckIcon className="bubble__status" />;
};

export const MessageBubble = ({ message }: { message: Message }) => {
  const outgoing = message.direction === "out";

  return (
    <div className={`bubble-row ${outgoing ? "is-out" : "is-in"}`}>
      <div className={`bubble ${outgoing ? "bubble--out" : "bubble--in"}`}>
        <span className="bubble__text">{message.text}</span>
        <span className="bubble__meta">
          <span className="bubble__time">{formatTime(message.timestamp)}</span>
          {outgoing && <StatusIcon status={message.status} />}
        </span>
      </div>
    </div>
  );
};
