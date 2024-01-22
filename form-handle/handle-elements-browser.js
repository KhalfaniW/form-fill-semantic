import { retrieveFrameSnapshot } from "puppeteer-snapshot";
import { findElements, findAllByRoleInAxTree } from "./mysearch.js";
import * as _d from "deepdash/standalone";

//uses puppeter v12


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
