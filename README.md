## Начало работы

Установить, Запустить:

```bash
yarn install
yarn start
```

Откройте [http://localhost:5000](http://localhost:5000)

Далее для удобства чтения можно запустить скрипт, который переименует название папок по имени собеседника:

```bash
yarn rename-chats
```

Структура будет такого формата:

```bash
tg-importer/
├── chats/
│   ├── Ivan/
│       └── messages.html
│   └── Ignat/
│       └── messages.html
└── package.json
```

