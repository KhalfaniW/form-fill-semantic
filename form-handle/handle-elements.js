import { retrieveFrameSnapshot } from "puppeteer-snapshot";
import { findElements, findAllByRoleInAxTree } from "./mysearch.js";
import * as _d from "deepdash/standalone";


//gets even the iframe elements
const getClient = (page) => {
  if (typeof page._client === "function") {
    return page._client();
  }
  return page._client;
};

export async function extractByRoleAllFrames(page, role) {
  const frames = await page.frames();
  const client = getClient(page);
  console.log("frames", frames.length);
  const foundElements = (
    await Promise.all(
      frames.map(async (frame, i) => {
        console.log("frame", i);
        const tree = await client.send("Accessibility.getFullAXTree", {
          frameId: frame._id,
        });
        const foundElements = findAllByRoleInAxTree({
          AxTree: tree,
          role,
        });
  
        return foundElements.map((el) => ({ ...el, frame: frame }));
      }),
    )
  ).flat();
  console.log("foundElements", foundElements.length);
  const elementsWithHandles = await Promise.all(
    foundElements.map(async (element, i) => {
      console.log("element", "start", i, element.backendDOMNodeId);
      const newELement = {
        ...element,
        role,
        elementHandle: await selectByBackendId(
          element.frame,
          element.backendDOMNodeId,
        ),
      };
      console.log("element", "end", i);
      delete newELement.frame;
      return newELement;
    }),
  );
  console.log("elementsWithHandles", elementsWithHandles.length);

  return elementsWithHandles;
}

//NOTE this will break if you run it twice in same browser
//misses radio groups
export async function extractByRoleAllFramesUsingSnapshots(page, role) {
  const frames = await page.frames();
  console.log("frames", frames.length);
  let c;
  for (const frame of frames) {
    console.log("boop");
    c = await frame._mainWorld._contextPromise;
    console.log(await frame.executionContext());
  }
  console.log("frames2", frames.length);

  const allSnapshots = await Promise.all(
    frames.map(async (frame) => {
      const snapshot = await retrieveFrameSnapshot(frame, frame._id);
      return snapshot;
    }),
  );

  const matchedElements = allSnapshots
    .map((frameSnapshot) =>
      findElements({
        role,
        snapshot: frameSnapshot,
      }),
    )
    .flat();

  return Promise.all(
    matchedElements.map(async (element) => {
      return {
        ...element,
        elementHandle: await selectByBackendId(
          //TODO fix hack
          frames[1], //          element.frame,
          element.backendDOMNodeId,
        ),
      };
    }),
  );
}
/*
export async function selectByRoleAndNameAllFrames(page, { role, name }) {
  const frames = [...(await page.frames())].concat(page);
  console.log("abc", await page.$(`aria/${name}[role="${role}"]`));
  return null;

  const allSearches = await Promise.all(
    frames.map(async (frame) => {
      console.log(frame, `aria/${name}[role="${role}"]`);
      const contentLength = (await frame.content()).length;
      if (contentLength < 5000) {
        return [];
      }
      return await frame.$$(`aria/${name}[role="${role}"]`);
      // return await frame.$$(`::-p-aria([name="${name}"])`);
      return await frame.$$(`::-p-aria([name=${name}])`);
      // console.log((await frame.content()).slice(0, 100));
      // await frame.$("a");
      // return [];
    }),
  );

  // .map((frame) => async () => await frame.$(`aria/${name}[role="${role}"]`))
  // .reduce((currentPromise, nextPromise) => {
  //   return currentPromise.then((promiseResults) => {
  //     console.log(promiseResults);
  //     return nextPromise().then((newPromise) => [
  //       ...promiseResults,
  //       newPromise,
  //     ]);
  //   });
  // }, Promise.resolve([]));

  console.log("DONE", { allSearches });
  return allSearches.filter(Boolean);
}
*/
export async function selectByBackendId(frameOrPage, backendDOMNodeId) {
  //this is for pupppeteer v12 / puppeteer for web

  console.log("abc");
  const context = await frameOrPage.executionContext();
  console.log("abc2");
  const newElement = await context._adoptBackendNodeId(backendDOMNodeId);
  return newElement;
}

async function selectByBackendIdNodePupppeter(frameOrPage, backendDOMNodeId) {
  const randomElementForFunction = await frameOrPage.$("html");
  if (randomElementForFunction.realm?.adoptBackendNode) {
    return await randomElementForFunction.realm.adoptBackendNode(
      backendDOMNodeId,
    );
  }
}

async function extractRadioChoiceOptions(
  page,
  accessibleName,
  role = "listbox",
) {}

const collectAXNodes = (allMatches, value, key, parentValue, context) => {
  const valueIsNode =
    typeof value == "object" && Object.keys(value).includes("role");
  if (typeof value == "object" && value.role?.value === "radiogroup") {
    return allMatches.concat(value);
  }
  return allMatches;
};

function formatRadioOption() {}
async function parseRadioOptions(AxTree) {
  const fakeImport = "fs";
  const fs = await import(fakeImport);
  //radiogroup not visible in snapshot only radios and statictext
  const listOfRadioGroups = _d.reduceDeep(AxTree, collectAXNodes, []);

  return JSON.stringify(listOfRadioGroups, null, 2);
  // _d.reduceDeep(AxTree)
  // return await snapshotAxTree(AxTree);
  console.log(
    "tree",
    await parseRadioOptions(
      JSON.parse(
        fs.readFileSync(
          "/home/khalfani/Projects/MainProjects/Projects/form-fill-semantic/form-handle/commands/run/full-ax-tree-with-radio-buttons.json",
        ),
        "utf8",
      ),
    ),
  );
}

export function compareElementsBetween(oldSnapshot, newSnapshot) {
  const collectNodes = (allMatches, value, key, parentValue, context) => {
    const valueIsNode =
      typeof value == "object" && Object.keys(value).includes("role");
    if (valueIsNode) {
      return allMatches.concat(value);
    }
    return allMatches;
  };
  const listOfInitalRoleMatches = _d.reduceDeep(oldSnapshot, collectNodes, []);

  const listOfSecondRoleMatches = _d.reduceDeep(newSnapshot, collectNodes, []);

  const newNodes = _.differenceWith(
    listOfSecondRoleMatches,
    listOfInitalRoleMatches,

    (node1, node2) => {
      return node1.name == node2.name;
    },
  );

  return newNodes;
}

export async function extractListChoiceOptions(
  page,
  accessibleName,
  role = "listbox", //working
) {
  const initial = await page.accessibility.snapshot();
  await page.click(`aria/${accessibleName}[role="${role}"]`);
  await page.waitForTimeout(1000);

  const after = await page.accessibility.snapshot();
  await page.keyboard.press("Escape");

  return compareElementsBetween(initial, after);
}

function typeInputs(pageSnapshot) {}
