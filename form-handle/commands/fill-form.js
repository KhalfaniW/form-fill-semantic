import { findClosestSemanticMatches, findElements } from "../mysearch.js";
import { init } from "../../init.js";
import deepdash from "deepdash";
import lodash from "lodash";
const _ = deepdash(lodash);

const { page, browser } = await init();
const myData = {
  firstName: "Farhaj",
  lastName: "McCloud",
  password: "Fjsdaf32j9@3",
  username: "swift-broud",
    email: "t.khalfani.wad@outlook.com",
  phoneNumber: "4233949992",
  country: "United States",
  zipNumber: "60641",
};

await page.goto(
    "https://career4.successfactors.com/portalcareer?_s.crb=21nN6l%252fYCbuNlWRGC%252f4g1YmDSzSRkUSbQfalA2I%252bK1U%253d",
  // { waitUntil: "load" },
);

const matchedElements = findElements({
  role: "textbox",
    snapshot: await page.accessibility.snapshot(),
}).filter((el) => el.required);

console.log(matchedElements)
console.log(await page.accessibility.snapshot())
