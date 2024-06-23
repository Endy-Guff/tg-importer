const fs = require("fs-extra");

const readHtmlFile = async (filePath) => {
  try {
    const htmlContent = await fs.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    throw err;
  }
};

module.exports = readHtmlFile;
