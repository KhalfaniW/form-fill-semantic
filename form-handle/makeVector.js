var i = 0;
export default async function makeVector(text) {
  //log time it takes
  console.log("start makeVector ", new Date().toLocaleString());
  let numberList = null;
  let array = [];
  if (!text) {
    return array;
  }
  try {
    const response = await fetch("http://localhost:8912/make-vector", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const output = await response.json();

    array = output; //JSON.parse(`[${numberList}]`);
    // fs.appendFileSync("./vector-output/outut-string.txt", numberList);
    // fs.appendFileSync(
    //   "./vector-output/outut-vector.txt",
    //   JSON.stringify(output.tolist()),
    // );
  } catch (e) {
    console.log({ text, numberList, array, m: e.message, s: e.stack });
  }
  return array;
}
