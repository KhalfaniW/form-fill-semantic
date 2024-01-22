import express from "express";
import { pipeline } from "@xenova/transformers";

const app = express();
app.use(express.json());

let extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

app.post("/make-vector", async (req, res) => {
  const text = req.body.text;

  let numberList = null;
  let array = null;

  try {
    //  const output = await extractor(text, { pooling: "mean", normalize: true });
    numberList = (
      await extractor(text, { pooling: "mean", normalize: true })
    ).data.toString();
    array = JSON.parse(`[${numberList}]`);
  } catch (e) {
    console.log({ text, numberList, array, m: e.message, s: e.stack });
    res.status(500).send({ error: "Error processing text" });
    return;
  }
  res.send(array);
});

const port = process.env.PORT || 8912;
app.listen(port, () => console.log(`Server is running on port ${port}`));
