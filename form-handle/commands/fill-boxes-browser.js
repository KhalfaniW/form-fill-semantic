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
  /*global page*/
  const myData = myEnv.myData;
  // const start1 = Date.now();
  // console.log("start-element Date.now()", start1);

  // const textboxes2 = await extractByRoleAllFramesUsingSnapshots(
  //   page,
  //   "textbox",
  // );
  // const fjend1 = Date.now();
  // console.log("time1 ", end1 - start1);
  // console.log("result2:", textboxes2);
  const start2 = Date.now();
  //frame execcont
  const [pageFrame] = await page.frames();
  console.log("before extract ", new Date().toLocaleString());
  // return;
  const textboxes = await extractByRoleAllFrames(page, "textbox");
  const end2 = Date.now();

  /* process.exit() */
  // console.log(textboxes);
  // console.log(await textboxes[3].elementHandle.evaluate((element) => element.outerHTML));

  //

  console.log("pre simlaiities ", new Date().toLocaleString());

  console.log("log  time end", new Date().toLocaleString());
  console.log({
    textboxes,
  });

  await fillInTextBoxes(textboxes, myData);

  return;

  // process.exit();
  // browser.close();
  // elementsAndSimilarities
  //   .filter(({ similarity }) => similarity > 0.5)
  //   .map((element) => async () => {
  //     console.log(element);
  //     try {
  //       await await page.type(
  //         `aria/${element.elementName}[role="textbox"]`,
  //         myData[element.myDataKey],
  //       );
  //     } catch (err) {
  //       console.log(element.myDataKey, myData[element.myDataKey]);
  //       console.log(err);
  //     } finally {
  //     }
  //   })
  //   .reduce(
  //     (before, nextPromise) => before.then((_) => nextPromise()),
  //     Promise.resolve(),
  //   );
}
window.runEvaled = runEvaled;
