import express from "express";
import esbuild from "esbuild";
import bodyParser from "body-parser";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import path from "path";
import cors from "cors";
import { init } from "./init.js";

import fs from "fs";
const app = express();
const port = process.env.PORT || 8900;

app.use(cors());

app.use(bodyParser.json());

app.post("/eval", async (req, res) => {
  const code = req.body.code;
  let result;

  try {
    result = await eval(code);
  } catch (error) {
    result = error.toString();
    console.error("caught error", error);
  }

  res.send("completed");
});

app.get("/test", async (req, res) => {
  // console.log(builtCodeString);

  res.send("working");
});

app.get("/code", async (req, res) => {
  const projectDir =
    "/home/khalfani/Projects/MainProjects/Projects/job/form-fill-semantic/form-handle/";
  const outFile = `/tmp/builds/code-${projectDir.replace(/\//g, "_")}.js`;
  //Should watch for changes and rebuild instead of building here
  await esbuild.build({
    entryPoints: [path.join(projectDir, "commands/fill-boxes-browser.js")],
    bundle: true,
    minify: false, //true,
    format: "iife",
    target: "esnext",
    //platform: "node",
    platform: "browser",
    // platform: "neutral",
    external: ["*.node"],
    outfile: outFile,
    // plugins: [nodeExternalsPlugin()],
    loader: {
      ".js": "jsx",
    },
  });
  const builtCodeString = fs.readFileSync(outFile, "utf8");


  res.send(builtCodeString);
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
