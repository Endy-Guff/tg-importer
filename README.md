## Начало работы

В первую очередь нужно поместить директории с телеграмм-чатами в директорию chats.
Пример структуры:

```bash
tg-importer/
├── chats/
│   ├── ChatExport_2024-01-01/
│       └── messages.html
│   └── ChatExport_2024-01-02/
│       └── messages.html
└── package.json
```

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

Откройте [http://localhost:5000](http://localhost:5000)
