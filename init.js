import puppeteer from "puppeteer-extra";
import puppeteerExtra from "puppeteer-extra-plugin-repl";
import fs from "fs";

puppeteer.use(puppeteerExtra());

let browser, page, snapshot;
export async function init(params) {
  puppeteer.use(puppeteerExtra());
  browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    ignoreDefaultArgs: ["--enable-automation"],
    userDataDir: "~/.config/google-chrome2",
      headless: false,
      ...params
    // headless: "new",
  });

    page = await browser.newPage();
  
  // await page.goto(
  //   //  "https://youtube.com",
  //   "file:///home/khalfani/Projects/MainProjects/Projects/form-fill/test/fake-job.html",
  //   //    "https://boards.greenhouse.io/embed/job_app?for=optiverus&t=9fb491cd2&token=6393172002&b=https%3A%2F%2Foptiver.com%2Fworking-at-optiver%2Fcareer-opportunities%2F6393172002%2F",
  //   //it just shows iframe
  //   //   "https://optiver.com/working-at-optiver/career-opportunities/6393172002/?gh_src=9fb491cd2&gh_src=9fb491cd2",
  //   { waitUntil: "load" },
  // );

  // await page.waitForTimeout(30000000);
  // process.exit();
  //   snapshot = await page.accessibility.snapshot();
  //   console.log(snapshot);
  // fs.writeFileSync(
  //   "./test/fake-accessibility-tree-part-filled2.json",
  //     JSON.stringify(snapshot),
  //);
  return { page, browser, snapshot };
}
