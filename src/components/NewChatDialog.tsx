import { useState, type FormEvent } from "react";
import { checkWhatsapp } from "../api/greenApi";
import { NEW_CHAT_TEXT } from "../constants";
import type { Credentials } from "../types";
import { toChatId } from "../utils";

interface Props {
  credentials: Credentials;
  onCreate: (chatId: string) => void;
  onClose: () => void;
}

export const NewChatDialog = ({ credentials, onCreate, onClose }: Props) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const chatId = toChatId(phone);
    if (!chatId) {
      setError(NEW_CHAT_TEXT.invalidPhone);
      return;
    }

    setError(null);
    if (warning) {
      onCreate(chatId);
      return;
    }

    setChecking(true);
    try {
      const exists = await checkWhatsapp(credentials, chatId.split("@")[0]);
      if (!exists) {
        setWarning(NEW_CHAT_TEXT.noWhatsapp);
        return;
      }
      onCreate(chatId);
    } catch {
      setWarning(NEW_CHAT_TEXT.checkFailed);
    } finally {
      setChecking(false);
    }
  };

  const handleChange = (value: string) => {
    setPhone(value);
    setWarning(null);
    setError(null);
  };

  return (
    <div className="modal" onMouseDown={onClose}>
      <form
        className="modal__card"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="modal__title">Новый чат</h2>
        <p className="modal__subtitle">
          Номер телефона получателя с кодом страны
        </p>

        <input
          className="modal__input"
          value={phone}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="77089292325"
          inputMode="tel"
          autoFocus
        />

        {error && <p className="modal__error">{error}</p>}
        {warning && <p className="modal__warning">{warning}</p>}

        <div className="modal__actions">
          <button type="button" className="modal__button" onClick={onClose}>
            Отмена
          </button>
          <button
            type="submit"
            className="modal__button modal__button--primary"
            disabled={checking}
          >
            {checking ? "Проверяем…" : "Создать"}
          </button>
        </div>
      </form>
    </div>
  );
};
