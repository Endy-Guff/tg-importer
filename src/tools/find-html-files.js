const fs = require("fs-extra");
const path = require("path");

const findHtmlFiles = async (dir, fileList = []) => {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      fileList = await findHtmlFiles(filePath, fileList);
    } else if (path.extname(file) === ".html") {
      fileList.push(filePath);
    }
  }

  return fileList;
};

module.exports = findHtmlFiles;
