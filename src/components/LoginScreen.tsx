import { useState, type FormEvent } from "react";
import { getStateInstance } from "../api/greenApi";
import { LOGIN_TEXT } from "../constants";
import type { Credentials } from "../types";
import { WhatsAppIcon } from "./icons";

interface Props {
  onLogin: (cred: Credentials) => void;
}

export const LoginScreen = ({ onLogin }: Props) => {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const cred: Credentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };
    if (!cred.idInstance || !cred.apiTokenInstance) {
      setError(LOGIN_TEXT.emptyFields);
      return;
    }

    setChecking(true);
    setError(null);
    try {
      await getStateInstance(cred);
      onLogin(cred);
    } catch {
      setError(LOGIN_TEXT.connectionFailed);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="login">
      <form className="login__card" onSubmit={handleSubmit}>
        <div className="login__logo">
          <WhatsAppIcon />
        </div>

        <h1 className="login__title">WhatsApp Chat</h1>
        <p className="login__subtitle">
          Войдите с учётными данными инстанса GREEN-API
        </p>

        <label className="login__label" htmlFor="idInstance">
          Id Instance
        </label>
        <input
          id="idInstance"
          className="login__input"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          placeholder=""
          autoComplete="off"
        />

        <label className="login__label" htmlFor="apiTokenInstance">
          Api Token Instance
        </label>
        <input
          id="apiTokenInstance"
          className="login__input"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          placeholder=""
          autoComplete="off"
        />

        {error && <p className="login__error">{error}</p>}

        <button className="login__button" type="submit" disabled={checking}>
          {checking ? "Проверяем…" : "Войти"}
        </button>

        <a
          className="login__hint"
          href="https://green-api.com/"
          target="_blank"
          rel="noreferrer"
        >
          Где взять данные? Кабинет GREEN-API
        </a>
      </form>
    </div>
  );
};
