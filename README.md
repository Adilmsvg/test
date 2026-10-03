-WhatsApp Chat на GREEN-API

Веб-интерфейс чата WhatsApp: отправка и получение текстовых сообщений через [GREEN-API](https://green-api.com/).

 -Запуск

```bash
npm install
npm run dev     # http://localhost:5173
```

Прочие команды: `npm run build` - сборка в `dist/`, `npm run preview` - просмотр собранной версии.

 -Как пользоваться

1. В [личном кабинете GREEN-API](https://console.green-api.com/) создайте инстанс и просканируйте QR-код в WhatsApp
   на телефоне (состояние инстанса должно стать `authorized`).
2. Откройте приложение и введите `idInstance` и `apiTokenInstance` - они проверяются методом `GetStateInstance`
   и сохраняются в `localStorage`. Если инстанс не авторизован (или спит, заблокирован, запускается), над чатом
   появится жёлтый баннер с причиной: состояние берётся из `GetStateInstance` (опрос раз в 30 секунд) и из
   вебхука [`stateInstanceChanged`](https://green-api.com/docs/api/receiving/notifications-format/instance-status/).
3. Нажмите «+», введите номер получателя в международном формате (`79001234567`) и создайте чат.
4. Напишите сообщение и отправьте его (Enter - отправить, Shift+Enter - перенос строки).
5. Ответ получателя из WhatsApp появится в чате в течение нескольких секунд.
