import { init } from "./init.js";
import fs from "fs";
const { page,browser } = await init();



await page.goto(
    "https://career4.successfactors.com/career?company=Popularinc&site=&lang=en_US&requestParams=AInlFXQ0qQFJsWKVJrksMYn1KtN42m1Q3UpCQRCeNPPnSCVBd72CqFQKXVQUllAgiN10cRrXSTe2%0a3ePunDSCnqgeInqCuuwFooveodWCPNHC7rLfzsz38%2fAJGWehdIU3WI5ZqvIxuuEpRpns29Pz%2bsVL%0aGlJNKCiD%2fSYKNrYFeR5ackOj%2bpNodw%2bmqzjO%2bXPV74ChiIosH1hCpn5sYe38ZDZdoR6UO2ylHuw8%0avp69f2zcHaUAJpFvW2BYZBuTv5xkikdwD%2blvHBhyQknS3OrP47kr03O1MfUYSgItkQ09EloahTJR%0amGls1ht1hsAZIVHtR5G6TfxfonKeOfDtbRmRkjohYOlQWhLMsCyMtaSQpdFhUkywXa9Vt6qNaq1S%0a8YXStTST1ai6jux%2fZFlhriPUv0JSDIW2iWKFPiDx55H%2fMajd%2fKyVqV%2f0dqSYafLhTTNO0JEOu53J%0aF6PrikU%3d&login_ns=register&career_ns=job%5fapplication&career_job_req_id=84787&jobPipeline=Direct&clientId=jobs2web&_s.crb=E3rx%2bM%2bzbGgJ6z6CDj40nEGv7Hy2hlRDjL4Le%2bo9Yo4%3d",
    // { waitUntil: "load" },
);
await page.evaluate(()=>    document.querySelectorAll('input[type="password"]').forEach(input=>input.type = 'text')})
// console.log(JSON.stringify(await page.accessibility.snapshot()));

// console.log(await page._client().send("Accessibility.getFullAXTree"))//to file
fs.writeFileSync("data.json", JSON.stringify(await page._client().send("Accessibility.getFullAXTree"), null, 2))


// Input fake data
await (await page.$('aria/Email Address:[role="textbox"]')).type("fakeemail@example.com");
await (await page.$('aria/Retype Email Address:[role="textbox"]')).type("fakeemail@example.com");
await (await page.$('aria/Choose Password:[role="textbox"]')).type("FakePassword123");
await (await page.$('aria/Retype Password:[role="textbox"]')).type("FakePassword123");
await (await page.$('aria/First Name:[role="textbox"]')).type("John");
await (await page.$('aria/Last Name:[role="textbox"]')).type("Doe");

// Select country
await page.select('aria/Country/Region Code:[role="combobox"]', 'United States (+1)');

// Input phone number
await (await page.$('aria/Phone Number:[role="textbox"]')).type("1234567890");

// Uncheck notification and career opportunities checkboxes
(await page.$('aria/Notification: Receive new job posting notifications[role="checkbox"]')).click();
(await page.$('aria/Hear more about career opportunities[role="checkbox"]')).click();
// await page.uncheck();

// make fake data for form

//write script to fill out form
// await browser.close()
`
I have json data like this
const data = {
firstName,
lastname,
password,
username,
email,

}
//country - United states
//phone - 314324422

make puppeteer script to input data from above using json

if compbox or select box then use puppeteer not json
example
use format $(aria/{name}[role="{role}"]) to select and element
  (await page.$('aria/Username[role="textbox"]')).type("xyz");
  (await page.$('aria/Apply Now[role="button"]')).click()
use page.$

___
webpage 
{"role":"RootWebArea","name":"Career Opportunities: Create an Account","children":[{"role":"StaticText","name":"We use cookies to offer you the best possible website experience. Your cookie preferences will be stored in your browser’s local storage. This includes cookies necessary for the website's operation. Additionally, you can freely decide and change any time whether you accept cookies or choose to opt out of cookies to improve website's performance, as well as cookies used to display content tailored to your interests. Your experience of the site and the services we are able to offer may be impacted if you do not accept all cookies."},{"role":"button","name":"Modify Cookie Preferences"},{"role":"button","name":"Accept All Cookies"},{"role":"generic","name":"","children":[{"role":"StaticText","name":"Press Tab to Move to Skip to Content Link"}]},{"role":"link","name":"Skip to main content"},{"role":"link","name":"Banco Popular","description":"Banco Popular"},{"role":"link","name":"Home","description":"Home"},{"role":"button","name":"Jobs By Category ","description":"Jobs By Category","haspopup":"menu"},{"role":"button","name":"Jobs By Location ","description":"Jobs By Location","haspopup":"menu"},{"role":"link","name":"Students","description":"Students"},{"role":"main","name":"","children":[{"role":"generic","name":""},{"role":"generic","name":""},{"role":"heading","name":"Career Opportunities: Create an Account","level":1},{"role":"StaticText","name":"Already a registered user?"},{"role":"StaticText","name":" "},{"role":"link","name":"Please sign in"},{"role":"StaticText","name":" "},{"role":"StaticText","name":"Login credentials are case sensitive"},{"role":"StaticText","name":"Email Address: "},{"role":"textbox","name":"Email Address: ","required":true},{"role":"StaticText","name":"Retype Email Address: "},{"role":"textbox","name":"Retype Email Address: ","required":true},{"role":"StaticText","name":"Choose Password: "},{"role":"textbox","name":"Choose Password: ","description":"Password must be at least 8 characters long. Password must not be longer than 20 characters. Password must contain at least one upper case and one lower case letter. Password must contain at least one number or punctuation character. Password must not contain space or unicode characters.","required":true},{"role":"button","name":"Show","description":"Show Password","pressed":false},{"role":"StaticText","name":"Password must be at least 8 characters long."},{"role":"StaticText","name":"Password must not be longer than 20 characters."},{"role":"StaticText","name":"Password must contain at least one upper case and one lower case letter."},{"role":"StaticText","name":"Password must contain at least one number or punctuation character."},{"role":"StaticText","name":"Password must not contain space or unicode characters."},{"role":"StaticText","name":"Retype Password: "},{"role":"textbox","name":"Retype Password: ","required":true},{"role":"button","name":"Show","description":"Show Password","pressed":false},{"role":"StaticText","name":"First Name: "},{"role":"textbox","name":"First Name: ","required":true},{"role":"StaticText","name":"Last Name: "},{"role":"textbox","name":"Last Name: ","required":true},{"role":"StaticText","name":"Country/Region Code:"},{"role":"combobox","name":"Country/Region Code:","value":"- Select -","haspopup":"menu","children":[{"role":"menuitem","name":"- Select -"},{"role":"menuitem","name":"Puerto Rico (+1)"},{"role":"menuitem","name":"United States (+1)"},{"role":"menuitem","name":"Virgin Islands, British (+1)"},{"role":"menuitem","name":"Virgin Islands, U.S. (+1)"}]},{"role":"StaticText","name":"Phone Number:"},{"role":"textbox","name":"Phone Number:","required":true},{"role":"checkbox","name":"Notification: Receive new job posting notifications","checked":true},{"role":"checkbox","name":"Hear more about career opportunities","checked":true},{"role":"button","name":"Create Account"},{"role":"LineBreak","name":"\n"}]},{"role":"link","name":"Home","description":"Home"},{"role":"link","name":"Popular.com","description":"Opens in a new tab."},{"role":"link","name":"View All Jobs","description":"Opens in a new tab."},{"role":"link","name":"PR/VI Privacy Policy","description":"Opens in a new tab."},{"role":"link","name":"US Privacy Policy","description":"Opens in a new tab."},{"role":"link","name":"If you are a California resident, please click here to learn more about your privacy rights.","description":"Opens in a new tab."},{"role":"button","name":".","description":"."},{"role":"StaticText","name":"© 2023 Popular, Inc."}]}

__ 
code`
