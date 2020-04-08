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
const app = express();

app.use(cors());
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload);


//setting up express router routes
app.use("/content", content);
app.use("/developer", developer);

//preparing next routes and next handler
nextApp.prepare().then(async () => {
  // const directoryMap: string[] = await walk(path.join(__dirname, "../pages/"));
  let nextRoutes = ["/", "/_next/*", "/cydia/assets/back.png", "/cydia/depiction"];
  // for (let index = 0; index < directoryMap.length; index++) {
  //   let route = directoryMap[index].split("pages")[1];
  //   nextRoutes.push(route.split(".tsx")[0]);
  // }
  
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

  app.get(nextRoutes, (req, res) => {
    return handle(req, res);
  });

  app.listen(process.env.PORT || 3001, () => {
    console.log(`Listening on localhost:${process.env.PORT || 3001}`);
  });
});
