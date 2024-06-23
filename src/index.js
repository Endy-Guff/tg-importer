const express = require("express");
const path = require("path");
const findHtmlFiles = require("./tools/find-html-files.js");
const readHtmlFile = require("./tools/read-html-file.js");
const extractTextFromHtml = require("./tools/extract-text-from-html");
const fileUpload = require("express-fileupload");
const unzipper = require("unzipper");
const fs = require("fs-extra");
const unzipArchive = require("./tools/unzip-archive.js");

const app = express();
const PORT = 5000;

app.use(fileUpload());

app.get("/", async (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/api/files", async (req, res) => {
  try {
    const files = await findHtmlFiles(path.join(__dirname, "..", "chats"));
    const relativeChats = await Promise.all(
      files.map(async (file) => {
        const chat = {};
        const htmlContent = await readHtmlFile(file);
        const username = extractTextFromHtml(
          htmlContent,
          "div.page_header div.text"
        );
        chat.username = username;
        chat.path = path.relative(path.join(__dirname, "chats"), file);
        return chat;
      })
    );
    res.json(relativeChats);
  } catch (err) {
    res.status(500).send("Error reading directory");
  }
});

app.post("/api/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.archive) {
      return res.status(400).send("Нет загруженного архива");
    }

    const archive = req.files.archive;
    const tempDir = path.join(__dirname, "temp");

    // Создаем временную директорию, если она не существует
    await fs.ensureDir(tempDir);

    // Путь к временному файлу архива
    const tempFilePath = path.join(tempDir, archive.name);

    // Сохраняем архив во временную папку
    await archive.mv(tempFilePath);

    // Разархивируем архив во временную папку
    await unzipArchive(tempFilePath, tempDir);
    // Извлекаем имя папки из архива
    const extractedDirName = path.basename(
      tempFilePath,
      path.extname(tempFilePath)
    );

    // Путь к папке, которую нужно переместить
    const extractedDir = path.join(tempDir, extractedDirName);

    // Путь к целевой папке 'chats'
    const targetDir = path.join(__dirname, "..", "chats", extractedDirName);

    // Перемещаем папку из временной директории в 'chats'
    await fs.move(extractedDir, targetDir, { overwrite: true });

    // Удаляем временную директорию
    await fs.remove(tempDir);

    res.send("Архив успешно загружен и разархивирован");
  } catch (err) {
    console.error("Ошибка:", err);
    res.status(500).send("Произошла ошибка при загрузке и обработке архива");
  }
});

app.use("/chats", express.static(path.join(__dirname, "..", "chats")));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
