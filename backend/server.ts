//general imports
import express from "express";
import next from "next";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import jwt from "jsonwebtoken";
import { gzip } from "./Helpers/Compress";

//route imports
import { content } from "./Routes/Content";
import { developer } from "./Routes/Developer";
import { sessions } from "./Routes/Sesions";
 
//db imports

//helpers imports
import walk from "./Helpers/Walk";
import { upload } from "./Helpers/Upload";

//global vars
const dev = process.env.NODE_ENV === "development";
const nextApp = next({ customServer: true,  dev });
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
  app.use("/sessions", sessions);

  app.get('/./Packages', async (req, res) => {
    let packages = undefined;
    try {
      packages = await fs.readFile(path.join(__dirname, "/RepoFiles/packages"), 'utf8');
    } catch(e) {
      console.log("nice")
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

  app.get('/./Packages.gz', async (req, res) => {
    let packages = undefined;
    try {
      packages = await fs.readFile(path.join(__dirname, "/RepoFiles/packages"), 'utf8');
    } catch(e) {
      console.log("nice")
      return res.status(400).send("Internal Server Error");
    }

    const token = jwt.sign({ 
      udid: req.header('x-unique-id'),
      model: req.header('x-machine')
    }, process.env.JWT_SECRET || "");

    let compressedPackages;
    try {
      compressedPackages = await gzip(packages.replace("{udid}", token));
    } catch {
      return res.status(400).send("Internal Server Error");
    }

    res.set("Content-Disposition", "attachment;filename=Packages.gz");
    res.set("Content-Type", "application/octet-stream");
    
    return res.send(compressedPackages);
  });

  app.get("/./Release", async (req, res) => {
    console.log("release")
    let release;
    try {
      release = await fs.readFile(path.join(__dirname, "/RepoFiles/Release"), 'utf8');
    } catch(e) {
      console.log(e)
      return res.status(400).send("Internal Server Error");
    }

    res.set("Content-Disposition", "attachment;filename=Release");
    res.set("Content-Type", "application/octet-stream");

    return res.send(release);
  });

  app.get("*", (req, res) => {
    console.log(req.url)
    if (!req.url.includes("/./")) {
      return handle(req, res);
    }
    return res.status(404).send("404 not found.");
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on localhost:${process.env.PORT || 3000}`);
  });
});
