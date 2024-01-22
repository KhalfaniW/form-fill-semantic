import express from "express";
import bodyParser from "body-parser";
import { init } from "./init.js";
//import {semanticSelect} from "./form-handle/mysearch.js";
import fs from 'fs';
const app = express();
const { page, browser } = await init();
var code = async () => {

//     await page.goto('https://career4.successfactors.com/portalcareer?company=Popularinc&rmk_user_preference=%7B%22functionalCookies%22%3A%5B%7B%22company%22%3A%22YouTube%22%2C%22checked%22%3A1%7D%5D%2C%22performanceCookies%22%3A%5B%5D%2C%22advertisingCookies%22%3A%5B%7B%22company%22%3A%22LinkedIn%22%2C%22checked%22%3A1%7D%5D%2C%22countrytype%22%3A%22optin%22%2C%22dateexpires%22%3A1720462615891%7D&correlation_Id=67307333400&lang=en_US&clientId=jobs2web&socialApply=false&career_ns=job_application&site=&career_job_req_id=84647&jobPipeline=Direct&isInternalUser=false&alertCreated=true&_s.crb=WIwbmafgdMGBBqa5tvvNJ%252fCTBs%252bM%252fllPvwAd5GgKVcw%253d')
// return
  const fs = await import("fs");
  /*global page*/

  const { semanticSelect } = await import(
   "/home/khalfani/Projects/MainProjects/Projects/form-fill-semantic/form-handle/mysearch.js"
  );
    await page.goto('https://jobs.popular.com/job/Aventura-Sales-and-Service-Banker-FL-33180/1097984000/')
  const ApplynowBox = await semanticSelect({
    page,
    searchName: "apply now",
    role: ["button", "link"],
  });


    await ApplynowBox?.click();

  await page.waitForNavigation();
    // await page.waitForTimeout(2000);
  const EmailBox = await semanticSelect({
    page,
    searchName: "email",
    role: "textbox",
  });
    if(!EmailBox) return
  await EmailBox.type("t.khalfani.wad@outlook.com");

  const PasswordBox = await semanticSelect({
    page,
    searchName: "password",
    role: "textbox",
  });
  await PasswordBox.type("Fjsdaf32j9@3");

  const signInBox = await semanticSelect({
    page,
    searchName: "sign in",
    role: "button",
  });

  await signInBox.click();
};
await code();
app.use(bodyParser.json());

app.post("/eval", async (req, res) => {
  const code = req.body.code;
  let result;

  try {
    result = await eval(code);
  } catch (error) {
      result = error.toString();
      console.error("caught error",error)
  }

  res.send('completed');
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
