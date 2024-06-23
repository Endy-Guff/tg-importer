const cheerio = require("cheerio");

const extractTextFromHtml = (htmlContent, selector) => {
  const $ = cheerio.load(htmlContent);
  const text = $(selector).text().trim();
  return text;
};

module.exports = extractTextFromHtml;
