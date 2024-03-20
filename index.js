const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const fs = require("fs-extra");
const path = require("path");
const data = require("./data.json");
const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);

  const html = await fs.readFile(filePath, "utf8");
  return hbs.compile(html)(data);
};
(async function () {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await compile("index", data);
    await page.setContent(content);

    await page.pdf({
      path: "output.pdf",
      format: "A4",
      printBackground: true,
    });

    console.log("Done Pdf");
    await browser.close();
    process.exit();
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
})();
