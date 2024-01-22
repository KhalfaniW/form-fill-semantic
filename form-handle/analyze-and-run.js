import {
  findElements,
  sortBySimilarity,
  makePhraseVectors,
} from "./mysearch.js";

/**
 * @typedef {Object} ElementWithComparison
 * @property {Object} element
 * @property {string} element.name
 * @property {Array} comparisons
 * @property {string} comparisons[].phrase
 * @property {number} comparisons[].goalSimilarity
 */
/**
 * @typedef {Object} NamedElement
 * @property {Object} element
 * @property {string} element.name
 * @property {Object} element.elementHandle

 */

/**
 * @async
 * @function fillInTextBoxes
 * @param {Array<Element>} elementsWithComparisons
 * @property {Array<Object>} namedElements
 * @property {string} namedElements.name
 * @property {Object} namedElements.element.elementHandle - puppeteer element handle
 * @param {Object} myData - object with keys that to be compared to element names and values for what to put in element
 * @returns {Promise}
 */
export async function fillInTextBoxes(namedElements, myData) {
  const elementsWithComparisons = await getElementSimilarities(
    namedElements,
    Object.keys(myData),
  );

  for (const elementWithComparison of elementsWithComparisons) {
    if (!isSufficientlySimilar(elementWithComparison)) {
      console.log("element not clearly similar enough", elementWithComparison);
      continue;
    }
    const pupeteerEleemnt = elementWithComparison.element.elementHandle;
    await pupeteerEleemnt.type(
      myData[elementWithComparison.comparisons[0].phrase],
      { delay: 10 },
    );
  }
}

/**
 * @async
 * @function getElementSimilarities
 * @property {Object} element
 * @property {string} element.name
 * @property {Array<string>} comparisonStrings
 * @returns {Array<ElementWithComparison>}
 */
export async function getElementSimilarities(element, comparisonStrings) {
  const myDataPhraseVectors = await makePhraseVectors(comparisonStrings);
  return element
    .map((element) => {
      const lazyPromise = async () => ({
        name: element.name,
        comparisons: await sortBySimilarity({
          phraseVectors: myDataPhraseVectors,
          goalPhrase: element.name,
        }),
        element,
      });
      return lazyPromise;
    })
    .reduce((currentPromise, nextPromise) => {
      return currentPromise.then((promiseResults) =>
        nextPromise().then((newPromise) => [...promiseResults, newPromise]),
      );
    }, Promise.resolve([]));
}

/**
 * This function checks if an element is sufficiently similar to a given comparison.
 * It takes an object that contains the element details and its comparison results as an argument.
 *
 * @function isSufficientlySimilar
 * @param {ElementWithComparison} elementWithComparison
 * @param {Object} options
 * @param {number} options.minSimilarity
 * @returns {boolean}
 */
function isSufficientlySimilar(elementWithComparison, options = {}) {
  const { minSimilarity = 0.6, nonMatchingSimilarity = 0.5 } = options;
  const sortedComparisons = elementWithComparison.comparisons.toSorted(
    (a, b) => b.goalSimilarity - a.goalSimilarity,
  );

  const [highest, secondHighest, thirdHighest] = sortedComparisons;
  const highestSimilarityComparison = sortedComparisons[0].goalSimilarity;
  const secondHighestSimilarity = sortedComparisons[1].goalSimilarity;
  // const isUniqleySimilar =
  // highest.goalSimilarity - secondHighest.goalSimilarity >
  // secondHighest.goalSimilarity - sortedComparisons.at(-2).goalSimilarity;
  return (
    highest.goalSimilarity > minSimilarity
    //    sortedComparisons.at(-1).goalSimilarity < nonMatchingSimilarity
    //  isUniqleySimilar
  );
}
