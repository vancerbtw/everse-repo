import express from "express";
import { getUser } from "../Helpers/Device";
import pg from "../Database/pg";
import path from "path";

export const content = express.Router();

content.get("/package/:id/", async (req, res) => {
  //here we will check all the package perms

  /*
  When cydia is requesting to download a file it will have 2 headers on the request
  (There is probably more that are unique to cydia but there are only 2 that we care about)

  x-unique-id - the udid of of the device that is requesting the package
  
  x-machine - the model of the device

  */
  if (!req.header("x-unique-id")) return res.status(400).send("Missing the 'x-unique-id' header on the request.");

  if (!req.header("x-machine")) return res.status(400).send("Missing the 'x-machine' header on the request.")

  const file = await pg("files").select().innerJoin("uploads", "files.file", "uploads.id").where({ files_id: req.params.id }).first();

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

  return res.status(200).sendFile(path.join(__dirname, '../packages', file.identifier));
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

    return res.status(200).json({ success: true, depiction: JSON.parse(item.depiction) || "", developer: item.username || "", name: item.name || "", icon: item.icon || "" });
  } else {
    return res.status(400).json({
      success: false,
      error: "Invalid request, missing 'id' or 'package' query param."
    });
  }
});