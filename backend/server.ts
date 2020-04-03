//general imports
import express from "express";
import next from "next";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import fs from "await-fs";

//route imports

//db imports

//helpers imports
import walk from "./Helpers/Walk";

//global vars
const dev = process.env.NODE_ENV === "development";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();

app.use(cors());
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setting up express router routes

//preparing next routes and next handler
nextApp.prepare().then(async () => {
  const directoryMap: string[] = await walk(path.join(__dirname, "../pages/"));
  let nextRoutes = ["/", "/_next/*"];
  for (let index = 0; index < directoryMap.length; index++) {
    let route = directoryMap[index].split("pages")[1];
    nextRoutes.push(route.split(".tsx")[0]);
  }
  
  app.get('/packages', async (req, res) => {
    let packages = undefined;
    try {
      packages = await fs.readFile(path.join(__dirname, "/RepoFiles/packages"), 'utf8');
    } catch(e) {
      return res.status(400).send("Internal Server Error");
    }

    packages.replace("{udid}", req.header('x-unique-id'));

    return res.send("googd!");
  });

  app.get(nextRoutes, (req, res) => {
    return handle(req, res);
  });

  app.listen(process.env.PORT || 3001, () => {
    console.log(`Listening on localhost:${process.env.PORT || 3001}`);
  });
});
