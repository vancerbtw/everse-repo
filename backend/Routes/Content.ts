import express from "express";
import { getUser } from "../Helpers/Device";
import pg from "../Database/pg";
import path from "path";
import Ping from "../Helpers/Ping";
import fs from "fs-extra";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

export const content = express.Router();

type CacheObject = {
  fileName: string;
  time: Date;
};

type FileObject = {
  fileName: string;
  time: Date;
};

class CacheTracker {
  public caches: CacheObject[];
  public files: FileObject[];
  public shouldUpdate: Boolean;
  private endpoints: {
    endpoint: string
  }[];
  private requestTotal: number;
  private ping: any;

  constructor() {
    this.files = [];
    this.caches = [];
    this.endpoints = [];
    this.requestTotal = 0;
    this.shouldUpdate = false;
    this.ping = new Ping();
  }

  resetUpdate():void {
    this.shouldUpdate = true;
  }

  addCache(cache: CacheObject):void {
    this.requestTotal = this.requestTotal + 1;
    if (this.files.filter(file => file.fileName === cache.fileName).length <= 0) {
      this.files.push({
        fileName: cache.fileName,
        time: cache.time
      })
    }
    
    this.caches.push(cache);
  }

  newestName(name: string): CacheObject | undefined {
    let filtered: CacheObject[] = this.caches.filter(cache => cache.fileName === name);
    filtered = filtered.sort((c,d) => {
      let a = c.time.getTime();
      let b = d.time.getTime();

      return a>b ? -1 : a<b ? 1 : 0;
    });

    return filtered[0];
  }

  sortedByDate(): CacheObject[] {
    return this.caches.sort((c,d) => {
      let a = c.time.getTime();
      let b = d.time.getTime();

      return a>b ? -1 : a<b ? 1 : 0;
    });
  }

  async update() {
    let priorities: {
      file: string,
      priority: number
    }[] = [];
    let invalids: string[] = [];

    for (let index = 0; index < this.files.length; index++) {
      const file: FileObject = this.files[index];
      let filtered: CacheObject[] = this.caches.filter(cache => cache.fileName === file.fileName);

      priorities.push({
        file: file.fileName,
        priority: this.files.length * (filtered.length - this.caches.length)
      });
    }

    for (let index = 0; index < priorities.length; index++) {
      const priority = priorities[index];
      
      let time = this.newestName(priority.file)?.time;

      if (!time) continue;

      if ((priority.priority / this.files.length) * (30 - (14400000)) + 30 <= (new Date().getTime() - time.getTime())) {
        //this has been in longer than alloted time for cached item
        invalids.push(priority.file);
      }
    }

    for (let i = 0; i < invalids.length; i++) {
      const invalid: string = invalids[i];
      
      this.files = this.files.filter(file => file.fileName !== invalid);
      this.caches = this.caches.filter(cache => cache.fileName !== invalid);
    }
    
    //here we send cached files to be removed to endpoint and refresh the endpoints that we have available to take user requests
    let endpoints: {
      active: {
        endpoint: string
      }[],
      failed: {
        endpoint: string
      }[]
    } = {
      active: [],
      failed: []
    };
    try {
      endpoints = JSON.parse((await fs.readFile(path.join(__dirname, `../Config/endpoints.json`))).toString());
    } catch {
      return;
    }
    

    for (let i = 0; i < endpoints.active.length; i++) {
      const element = endpoints.active[i];

      try {
        await this.ping.check(element);
      } catch {
        try {
          endpoints.failed.push(element)
          endpoints.active.splice(i, 1);

          let discordRes = await (await fetch("https://discordapp.com/api/webhooks/704870450009735281/Izh9sTyrbwPJsk29DtN5IEXgW08_0jDz6mOMh-sLjXqPo8m7vmYBu9VlNOg2aiJWxQZ9")).json();

          var d = new Date,
          dformat = [d.getMonth()+1,
          d.getDate(),
          d.getFullYear()].join('/')+' '+
          [d.getHours(),
          d.getMinutes(),
          d.getSeconds()].join(':');
            
          await fetch(`https://discordapp.com/api/webhooks/${discordRes.id}/${discordRes.token}`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "username": "WatchBot",
              "content": "@here",
              "embeds": [
                {
                  "title": "Server Ping Command Failed",
                  "description": `Ping failed on '${element.endpoint}'`,
                  "color": 13970176,
      
                }
              ]
            })
          });
        } catch(e) {
          console.log(e)
        }
      }
    }

    this.endpoints = endpoints.active;

    await fs.writeFile(path.join(__dirname, `../Config/endpoints.json`), JSON.stringify(endpoints));
  }
}

let cache = new CacheTracker();

setInterval(() => {
  cache.update().then(() => {
    console.log("updating!")
  }).catch((e) => {
    console.log(e)
  });
}, 60000);

content.get("/updateCache", async (req, res) => {
  await cache.update();
  res.send("done!")
});

content.get("/v1/:pkg/:version/", async (req, res) => {
  //here we will check all the package perms

  /*
  When cydia is requesting to download a file it will have 2 headers on the request
  (There is probably more that are unique to cydia but there are only 2 that we care about)

  x-unique-id - the udid of of the device that is requesting the package
  
  x-machine - the model of the device

  */
  if (!req.header("x-unique-id")) return res.status(400).send("Missing the 'x-unique-id' header on the request.");

  if (!req.header("x-machine")) return res.status(400).send("Missing the 'x-machine' header on the request.")

  const file = await pg("files").select().innerJoin("uploads", "files.file", "uploads.id").where({ package: req.params.pkg, version: req.params.version }).first();

  if (!file) return res.status(400).send("Invalid download requested");

  const item = await pg("packages").select().where({ identifier: file.package, active: true, pending: false }).first();

  if (!item) return res.status(400).send("Package may be disabled");

  if (item.paid) {
    //we are getting the user that this device belongs to
    const user = await getUser(req.header("x-unique-id")!, req.header('x-machine')!);

    //if there is no user then this device has not been linked to an account
    if (!user) return res.status(400).send("This device is not linked with an account, please sign in.");

    const purchase = await pg("purchases").select().where({ purchase_item: item.id, user_id: user.id }).first();
  
    if (!purchase) return res.status(400).send("You do not own this package.");
  }

  let shouldCache = false;

  let i = 0;
  while (cache.files.length - 1 >= i && !shouldCache) {
    if (cache.files[i].fileName === file.identifier) shouldCache = true;

    i++;
  }

  cache.addCache({
    fileName: file.identifier,
    time: new Date()
  });

  let token = jwt.sign({ 
    file: file.identifier,
    pkg: req.params.pkg,
    cache: shouldCache
  }, process.env.JWT_SECRET || "");

  return res.status(200).redirect(`https://cdn.everse.dev/${token}`);
});

content.get("/depiction", async (req, res) => {
  if (req.query.id) {
    const file = await pg("files").select().innerJoin("uploads", "files.file", "uploads.id").where({ files_id: req.query.id, accepted: true }).first();

    if (!file) return res.status(400).send("Invalid depiction requested");

    const item = await pg("packages").select().innerJoin("accounts", "packages.id", "accounts.id").where({ identifier: file.package, active: true, pending: false }).first();

    if (!item) return res.status(400).json({ success: false, error: "Inalid Package" });

    return res.status(200).json({ success: true, depiction: JSON.parse(item.depiction), developer: item.username || "", name: item.name || "", icon: item.icon || "" });
  } else if(req.query.package) {
    const item = await pg("packages").select().where({ identifier: req.query.package, active: true, pending: false }).innerJoin("accounts", "packages.id", "accounts.id").first();

    if (!item) return res.status(400).json({ success: false, error: "Inalid Package query param" });    

    if (!item) return res.status(400).json({ success: false, error: "Inalid Package" });

    return res.status(200).json({ success: true, depiction: JSON.parse(item.depiction) || "", developer: item.username || "", name: item.name || "", identifier: item.identifier || "", icon: item.icon || "" });
  } else {
    return res.status(400).json({
      success: false,
      error: "Invalid request, missing 'id' or 'package' query param."
    });
  }
});