# WhatsApp Chat на GREEN-API

Веб-интерфейс чата WhatsApp: отправка и получение текстовых сообщений через [GREEN-API](https://green-api.com/).
React 18 + TypeScript + Vite, без сторонних UI-библиотек и без бэкенда — браузер обращается к API напрямую.

## Запуск

```bash
npm install
npm run dev     # http://localhost:5173
```

Прочие команды: `npm run build` — сборка в `dist/`, `npm run preview` — просмотр собранной версии.

## Как пользоваться

1. В [личном кабинете GREEN-API](https://console.green-api.com/) создайте инстанс и просканируйте QR-код в WhatsApp
   на телефоне (состояние инстанса должно стать `authorized`).
2. Откройте приложение и введите `idInstance` и `apiTokenInstance` — они проверяются методом `GetStateInstance`
   и сохраняются в `localStorage`. Если инстанс не авторизован (или спит, заблокирован, запускается), над чатом
   появится жёлтый баннер с причиной: состояние берётся из `GetStateInstance` (опрос раз в 30 секунд) и из
   вебхука [`stateInstanceChanged`](https://green-api.com/docs/api/receiving/notifications-format/instance-status/).
3. Нажмите «+», введите номер получателя в международном формате (`79001234567`) и создайте чат.
4. Напишите сообщение и отправьте его (Enter — отправить, Shift+Enter — перенос строки).
5. Ответ получателя из WhatsApp появится в чате в течение нескольких секунд.

## Используемые методы API

| Назначение | Метод |
| --- | --- |
| Отправка текста | [`SendMessage`](https://green-api.com/docs/api/sending/SendMessage/) |
| Получение событий | [`ReceiveNotification`](https://green-api.com/docs/api/receiving/technology-http-api/ReceiveNotification/) |
| Подтверждение получения | [`DeleteNotification`](https://green-api.com/docs/api/receiving/technology-http-api/DeleteNotification/) |
| Проверка учётных данных и состояния | [`GetStateInstance`](https://green-api.com/docs/api/account/GetStateInstance/) |
| Проверка номера при создании чата | [`CheckWhatsapp`](https://green-api.com/docs/api/service/CheckWhatsapp/) |

Входящие сообщения получаются по HTTP API (long polling): запрос `ReceiveNotification` висит до 5 секунд,
полученное уведомление обрабатывается и сразу удаляется из очереди через `DeleteNotification` — иначе очередь
не сдвинется и следующие события не придут.

Адрес API вычисляется по номеру инстанса: первые четыре цифры `idInstance` — это номер сервера
(`7201…` → `https://7201.api.green-api.com`), для нестандартных id используется `https://api.green-api.com`.
Домен именно с дефисом — вариант `greenapi.com` для поддоменов с номером сервера не резолвится.
Сверить адрес можно с полем `apiUrl` в карточке инстанса в кабинете.

## Структура

```
src/
  api/greenApi.ts         запросы к GREEN-API
  hooks/useNotifications.ts  цикл long polling входящих событий
  components/
    LoginScreen.tsx       ввод idInstance / apiTokenInstance
    Sidebar.tsx           список чатов
    ChatWindow.tsx        переписка и поле ввода
    MessageBubble.tsx     пузырёк сообщения
    NewChatDialog.tsx     создание чата по номеру
    Avatar.tsx
  App.tsx                 состояние чатов, отправка, разбор уведомлений
  storage.ts              localStorage: учётные данные и история
  utils.ts                номер → chatId, форматирование дат
  styles.css              тёмная тема WhatsApp, десктоп и мобильная раскладка
```

## Ограничения

- Поддерживаются только текстовые сообщения (`textMessage` и `extendedTextMessage`); медиа игнорируются.
- История переписки хранится в `localStorage` браузера — прошлые сообщения из WhatsApp не подгружаются,
  чат наполняется событиями, пришедшими с момента входа.
- Учётные данные лежат в `localStorage` и уходят с браузера прямо в GREEN-API. Это допустимо для учебного
  проекта; в продакшене токен должен оставаться на сервере.
- В инстансе должны быть включены входящие уведомления (`Входящие сообщения и статусы отправленных` в настройках
  инстанса), иначе очередь будет пустой.
