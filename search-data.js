import { LocalIndex } from "vectra";
import path from "path";
import fs from "fs";
const config = {
  run: false,
  vectorFolder: "./data_vectors/Aug 23-React_postings_Remote",
  vectorSource: path.join(import.meta.dirname, ".", "remote-descriptions"),
  vectorFile: path.join(import.meta.dirname, ".", "vectors.json"),
};

const allJSONDBFiles = fs
  .readdirSync(config.vectorFolder)
  .map((fileName) => path.join(config.vectorFolder, fileName));

for (const jsonDBFile of allJSONDBFiles) {
  console.log("\n\n\n\n\n", "searching ", jsonDBFile);
  await search(jsonDBFile, "years experince");
}

async function search(dbFilePath, text) {
  const dbFolder = path.dirname(dbFilePath);
  const dbFileName = path.basename(dbFilePath);
  //    console.log({dbFilePath,dbFolder, dbFileName})
  const index = new LocalIndex(dbFolder, dbFileName);

  async function query(text, count = 7) {
    const vector = await fetchEmbeddings(text);

    const results = await index.queryItems(vector, count);
    if (results.length > 0) {
      results.forEach((result, i) => {
        // console.log(i, result.item.vector.length, result.score);
        console.log(i, `[${result.score}] ${result.item.metadata.text}`);
      });
      return results;
    } else {
      console.log(`No results found.`);
    }
  }

  return await query(text);
}

async function fetchEmbeddings(textList) {
  const url = "http://0.0.0.0:4080/embed";
  // console.log(text)
  const requestBody = {
    inputs: textList,
    normalize: true,
    truncate: false,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const embeddingVector = (await response.json())[0];
    console.log("embeddingVector.length", embeddingVector.length);
    return embeddingVector;
  } catch (error) {
    console.error("Error:", error.message);
  }
}
