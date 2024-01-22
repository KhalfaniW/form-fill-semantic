import makeVector from "./makeVector.js";
import deepdash from "deepdash";
import lodash from "lodash";
const _ = deepdash(lodash);

export async function semanticSelect({
  page,
  searchName,
  role, // string or array
  minSimilarity = 0.5,
}) {
  const { node: closestNode, similarity } = await findClosestSemanticNode({
    snapshot: await page.accessibility.snapshot(),
    searchName,
    role,
  });

  if (similarity < minSimilarity) {
    console.error("logging info: ", "good match not found", {
      role,
      searchName,
      maxSimilarity: similarity,
      closestNode: closestNode?.name,
    });
    return null;
  }
  return await page.$(`aria/${closestNode.name}[role="${closestNode.role}"]`);
}

export async function findClosestSemanticNode({
  snapshot,
  searchName,
  role, // string or array
}) {
  let nodeInfo = null;
  if (typeof role == "string") {
    nodeInfo = await findClosestMatchNode({
      snapshot,
      role,
      searchName,
    });
  } else if (Array.isArray(role)) {
    let potentialNodes = await Promise.all(
      role.map(
        async (roleName) =>
          await findClosestMatchNode({
            snapshot,
            role: roleName,
            searchName,
          }),
      ),
    );

    const nodeWithHighestSimilarty = potentialNodes.reduce(
      (highestNode, currentNode) => {
        if (highestNode.similarity > currentNode.similarity) {
          return highestNode;
        }
        return currentNode;
      },
      potentialNodes[0],
    );

    nodeInfo = nodeWithHighestSimilarty;
  }

  const { node, similarity } = nodeInfo;

  return { node, similarity };
}

export function findElements({ snapshot, role }) {
  const listOfMatches = _.reduceDeep(
    snapshot,
    (accumulator, value, key, parentValue, context) => {
      if (key == "role" && value == role) {
        return accumulator.concat([parentValue]);
      }
      return accumulator;
    },
    [],
  );
  return listOfMatches;
}

export function findAllByRoleInAxTree({ AxTree, role }) {
  const listOfMatches = _.reduceDeep(
    AxTree,
    (matchList, maybeNode, key, parentValue, context) => {
      if (maybeNode.role?.value == role) {
        return matchList.concat({
          name: maybeNode.name.value,
          backendDOMNodeId: maybeNode.backendDOMNodeId,
        });
      }
      return matchList;
    },
    [],
  );
  return listOfMatches;
}

export async function findClosestMatchNode({ snapshot, role, searchName }) {
  const listOfMatches = findElements({
    snapshot,
    role,
  });

  const searchVector = await makeVector(searchName);
  const matchElementVectors = await Promise.all(
    listOfMatches.map(async (element) => await makeVector(element.name)),
  );

  const closestVector = await getClosestVectorInfo(
    matchElementVectors,
    searchVector,
  );
  //NOTE LOGGING
  // console.log({closestVector,listOfMatches})

  return {
    node: listOfMatches[closestVector.index],
    similarity: closestVector.similarity,
  };
}
//make vectors once for performaance
export async function makePhraseVectors(phrases) {
    return  await Promise.all(
        phrases.map(async (phrase) => {
            return {
                phrase: phrase,
                vector: await makeVector(phrase)
            };
        }),
    )
}


//phraseVectors:{phrase,vector}

export async function sortBySimilarity({ phrases, phraseVectors, goalPhrase }) {
    const currentPhrasesVector = phraseVectors || (await makePhraseVectors(phrases));
    
    const goalVector = await makeVector(goalPhrase);

    return currentPhrasesVector.map((phraseVector) => ({
        phrase: phraseVector.phrase,
        goalSimilarity: cosineSimilarty(phraseVector.vector, goalVector),
    })).toSorted((phraseInfo1, phraseInfo2) => {
        return phraseInfo2.goalSimilarity - phraseInfo1.goalSimilarity;
    });
}


/*export async function findClosestSemanticMatches({
  listOfMatches,
  snapshot,
  role,
  myData = {
    firstName: "Farhaj",
    lastName: "McCloud",
    password: "Fjsdaf32j9@3",
    username: "swift-broud",
    email: "t.khalfani.wad@outlook.com",
    phone: "4233949992",
    phoneNumber: "fads",
    country: "United States",
    zipNumber: "60641",
  },
}) {
  const myDataVectors = await Promise.all(
    Object.keys(myData).map(async (myDataKey) => await makeVector(myDataKey)),
  );

  return Promise.all(
    listOfMatches.map(async ({ name: elementName }) => {
      const {
        index: closestResponseIndex,
        similarity: closestResponseSImilarity,
      } = getClosestVectorInfo(myDataVectors, await makeVector(elementName));

      return {
        elementName,
        similarity: closestResponseSImilarity,
        myDataKey: Object.keys(myData)[closestResponseIndex],
      };
    }),
  );
}
*/
function getClosestVectorInfo(vectorList, elementVector) {
  return vectorList.reduce(
    (closestIndex, currentVector, currentIndex) => {
      const similarity = cosineSimilarty(elementVector, currentVector);
      if (similarity > closestIndex.similarity) {
        return {
          index: currentIndex,
          similarity: similarity,
        };
      }
      return closestIndex;
    },
    {
      index: -1,
      similarity: -1,
    },
  );
}

function cosineSimilarty(vectorA, vectorB) {
  var dotproduct = 0;
  var mA = 0;
  var mB = 0;

  for (var i = 0; i < vectorA.length; i++) {
    dotproduct += vectorA[i] * vectorB[i];
    mA += vectorA[i] * vectorA[i];
    mB += vectorB[i] * vectorB[i];
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  var similarity = dotproduct / (mA * mB);

  return similarity;
}
