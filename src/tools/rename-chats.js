const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");

// Функция для переименования папок
async function renameFolders(dirPath) {
  try {
    const folders = await fs.readdir(dirPath);

    // Проходимся по всем папкам внутри dirPath
    for (const folder of folders) {
      const folderPath = path.join(dirPath, folder);
      const stats = await fs.stat(folderPath);

      // Если текущий элемент - директория
      if (stats.isDirectory()) {
        // Находим HTML файл в текущей папке
        const htmlFiles = await fs.readdir(folderPath);
        const htmlFile = htmlFiles.find((file) => file.endsWith(".html"));

        // Если HTML файл найден
        if (htmlFile) {
          const htmlFilePath = path.join(folderPath, htmlFile);
          const htmlContent = await fs.readFile(htmlFilePath, "utf-8");

          // Используем Cheerio для парсинга HTML
          const $ = cheerio.load(htmlContent);
          const username = $("div.page_header div.text").text().trim(); // Здесь нужно указать селектор, соответствующий вашему HTML

          // Переименовываем папку
          const newFolderPath = path.join(dirPath, username);
          await fs.rename(folderPath, newFolderPath);
          console.log(`Переименована папка ${folderPath} в ${newFolderPath}`);
        }
      }
    }
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

// Запуск функции для переименования папок в директории "chats"
const chatsDir = path.join(__dirname, "..", "..", "chats");
renameFolders(chatsDir);
