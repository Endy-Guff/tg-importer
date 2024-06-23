const unzipper = require("unzipper");
const fs = require("fs-extra");

async function unzipArchive(archivePath, extractPath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(archivePath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("finish", () => resolve())
      .on("error", (err) => reject(err));
  });
}

module.exports = unzipArchive;
