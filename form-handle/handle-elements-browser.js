import { retrieveFrameSnapshot } from "puppeteer-snapshot";
import { findElements, findAllByRoleInAxTree } from "./mysearch.js";
import * as _d from "deepdash/standalone";

//uses puppeter v12
//TODO copy from
//    /home/khalfani/Projects/MainProjects/Projects/form-fill-semantic/form-handle/commands/run/log-finding-elements.js

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

  const foundElements = (
    await Promise.all(
      frames.map(async (frame) => {
        const tree = await client.send("Accessibility.getFullAXTree", {
          frameId: frame._id,
        });
        const foundElements = findAllByRoleInAxTree({
          AxTree: tree,
          role,
        });
        // console.log(
        //   frame._id,
        //   frame.target,+
        //   frame._client ? frame._client() : "no client",
        //   JSON.stringify(tree, null, 2).length,
        // );

        // fs.writeFileSync(
        //   "./view/" + frame._id + ".json",
        //   JSON.stringify(tree, null, 2),
        // );
        // fs.writeFileSync(
        //   "./view/_snapshot_" + frame._id + ".json",
        //   JSON.stringify(
        //     await retrieveFrameSnapshot(frame, frame._id),
        //     null,
        //     2,
        //   ),
        // );
        return foundElements.map((el) => ({ ...el, frame: frame }));
      }),
    )
  ).flat();

  const elementsWithHandles = await Promise.all(
    foundElements.map(async (element) => {
      const newELement = {
        ...element,
        role,
        elementHandle: await selectByBackendId(
          element.frame,
          element.backendDOMNodeId,
        ),
      };
      delete newELement.frame;
      return newELement;
    }),
  );

  return elementsWithHandles;
}

export async function extractByRoleAllFramesUsingSnapshots(page, role) {
  const frames = await page.frames();
  const allSnapshots = await Promise.all(
    frames.map(async (frame) => await retrieveFrameSnapshot(frame, frame._id)),
  );

  const matchedElements = allSnapshots
    .map((frameSnapshot) =>
      findElements({
        role,
        snapshot: frameSnapshot,
      }),
    )
    .flat();

  return matchedElements;
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
  const randomElementForFunction = await frameOrPage.$("html");

  const context = await frameOrPage.executionContext();
  const element = await context._adoptBackendNodeId(backendDOMNodeId);
  return element;
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
