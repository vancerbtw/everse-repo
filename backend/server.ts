//general imports
import express from "express";
import next from "next";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import jwt from "jsonwebtoken";

//route imports
import { content } from "./Routes/Content";
import { developer } from "./Routes/Developer";

//db imports

//helpers imports
import walk from "./Helpers/Walk";
import { upload } from "./Helpers/Upload";

//global vars
const dev = process.env.NODE_ENV === "development";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();


//setting up express router routes

//preparing next routes and next handler
nextApp.prepare().then(async () => {
  const app = express();

  app.use(cors());
  app.set('trust proxy', true);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(upload);
  app.use("/_next/static/", express.static('../.next/static/'));

  app.use("/content", content);
  app.use("/developer", developer);

  app.get('/packages', async (req, res) => {
    let packages = undefined;
    try {
      packages = await fs.readFile(path.join(__dirname, "/RepoFiles/packages"), 'utf8');
    } catch(e) {
      return res.status(400).send("Internal Server Error");
    }

    const token = jwt.sign({ 
      udid: req.header('x-unique-id'),
      model: req.header('x-machine')
    }, process.env.JWT_SECRET || "");

    res.set("Content-Disposition", "attachment;filename=Packages");
    res.set("Content-Type", "application/octet-stream");
    
    return res.send(packages.replace("{udid}", token));
  });

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on localhost:${process.env.PORT || 3000}`);
  });
});
