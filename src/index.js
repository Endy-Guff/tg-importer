const express = require("express");
const path = require("path");
const findHtmlFiles = require("./tools/find-html-files.js");
const readHtmlFile = require("./tools/read-html-file.js");
const extractTextFromHtml = require("./tools/extract-text-from-html");

const app = express();
const PORT = 5000;

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
    console.log(relativeChats);
    res.json(relativeChats);
  } catch (err) {
    res.status(500).send("Error reading directory");
  }
});

app.use("/chats", express.static(path.join(__dirname, "..", "chats")));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
