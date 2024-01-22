import deepdash from "deepdash";
import lodash from "lodash";
import * as myEnv from "./.env.js";
import {
  extractByRoleAllFrames,
  extractByRoleAllFramesUsingSnapshots,
} from "../handle-elements.js";
import {
  findElements,
  sortBySimilarity,
  makePhraseVectors,
} from "../mysearch.js";

import { fillInTextBoxes } from "../analyze-and-run.js";

const _ = deepdash(lodash);
async function runEvaled() {

  const myData = myEnv.myData;
 
  const start2 = Date.now();

  const [pageFrame] = await page.frames();
  console.log("before extract ", new Date().toLocaleString());

  const textboxes = await extractByRoleAllFrames(page, "textbox");
  const end2 = Date.now();

  console.log("pre simlaiities ", new Date().toLocaleString());

  console.log("log  time end", new Date().toLocaleString());
  console.log({
    textboxes,
  });

  await fillInTextBoxes(textboxes, myData);

  return;

window.runEvaled = runEvaled;
