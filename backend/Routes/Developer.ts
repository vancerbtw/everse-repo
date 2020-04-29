import express from "express";
import pg from "../Database/pg";
import auth from "../Helpers/Authentication";
import path from "path";
import fs from "fs-extra";
import { join } from "path";
import { debScan } from "../Helpers/DebScan";
import { generatePackages } from "../Helpers/Packages";
import { space } from "../Helpers/Spaces";
import randomstring from "randomstring";
import fetch from "node-fetch";
import { removeUserDevices, removeDevice, addDevice, getDevices, getUser } from "../Helpers/Device";

export const developer = express.Router();

developer.post("/upload", auth, async (req, res) => {
  try {
    if (req.body.update && !req.body.identifier) {
      return res.status(400).json({
        success: false,
        error: "Uploading an update for a pre-existing product requires that the 'Identifier' is specified on the request body."
      });
    }

    if (req.body.update && !req.user?.developer) {
      return res.status(200).json({
        success: false,
        error: "User must be a developer to upload an update to a package"
      });
    }

    let item;
    if (req.body.update) {
      item = await pg("packages").select().where({identifier: req.body.identifier}).first();

      if (!item) {
        return res.status(400).json({
          success: false,
          error: "Invalid Package to update."
        });
      }
    }

    const packageName = `${Date.now()}${randomstring.generate(15)}.deb`;
    await fs.writeFile(join(__dirname, `../packages/${packageName}`), req.file.buffer);

    const fileID = await pg("uploads").insert({
      identifier: packageName
    }).returning("id");

    const debData = await debScan(packageName);
    if (!debData.control.package || !debData.control.architecture || !debData.control.author || !debData.control.depends || !debData.control.description || !debData.control.maintainer || !debData.control.name || !debData.control.package)  {
      return res.status(400).json({
        success: false,
        error: "Invalid formatted debian file"
      });
    }

    if (req.body.update) {
      //call checksum calculations here and process information to upload a new version to the system
    } else {
      //setup for new package
      await pg("packages").insert({
        developer: req.user?.id,
        identifier: debData.control.package,
        description: debData.control.description,
        name: debData.control.name
      });

      await pg("files").insert({
        file: parseInt(fileID[0]),
        package: debData.control.package,
        developer: req.user?.email,
        desc: debData.control.description,
        name: debData.control.name,
        version: debData.control.version,
        size: debData.size,
        depends: debData.control.depends,
        section: debData.control.section?.toLowerCase() === "themes" ? "Themes": "Tweaks",
        architecture: debData.control.architecture,
        enabled: false,
        accepted: false,
        paid: false,
        md5: debData.md5,
        sha1: debData.sha1,
        sha256: debData.sha256,
        change: "Initial commit"
      });

      
      var params = {
        Bucket: "content-cdn-everse-0",
        Key: packageName,
        Body: req.file.stream,
        ACL: 'private'
      };
      try {
        await space.putObject(params).promise();
      } catch {
        return res.status(400).json({
          success: false,
          error: "Internal upload error"
        });
      }

      return res.status(200).json({
        success: true
      });
    }
  } catch(e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

developer.post("/packages", async (req, res) => {
  if (await generatePackages()) {
    return res.status(200).json({
      success: true
    });
  } else {
    return res.status(400).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

developer.post("/addDevice/:user", async (req, res) => {
  if (await addDevice({ udid: req.header("x-unique-id") || "", model: req.header('x-machine') || "" }, parseInt(req.params.user))) {
    return res.status(200).json({
      success: true
    });
  }

  return res.status(400).json({
    success: false,
    error: "Internal Server Error"
  });
});

developer.post("/get/device", async (req, res) => {
  const user = await getUser(req.header("x-unique-id") || "", req.header('x-machine') || "");

  return res.status(200).json(user)
});

developer.post("/set/depiction", auth, async (req, res) => {
  if (!req.user?.developer) return res.status(400).json({ success: false, error: "User is not a developer" });
  if (!req.body.id) return res.status(400).json({ success: false, error: "Missing 'id' on request body." });
  // if (!req.body.depiction) return res.status(400).json({ success: false, error: "Missing 'depiction' on request body." });
  
  //here we are checking for if the package exists and the user is the developer
  const item = await pg("packages").select().where({ id: req.body.id, developer: req.user.id }).first();
  if (!item) return res.status(400).json({ success: false, error: "Invalid Package requested to update depiction." });

  let depiction;

  try {
    depiction = await (await fetch("https://pinpal.github.io/package/JoolPatch/SileoDepiction.json")).json();
  } catch(e) {
    console.log(e)
    return res.status(400).json({ success: false, error: "Invalid depiction." });
  }

  try {
    await pg("packages").where({ id: item.id }).update({
      depiction: JSON.stringify(depiction)
    });
  } catch {
    return res.status(400).json({ success: false, error: "Invalid depiction." });
  }

  return res.status(200).json({ success: true });
});

developer.post("/update/depiction", auth, async (req, res) => {
  if (!req.user?.developer) return res.status(400).json({ success: false, error: "User is not a developer" });
  if (!req.body.id) return res.status(400).json({ success: false, error: "Missing 'id' on request body." });
  // if (!req.body.depiction) return res.status(400).json({ success: false, error: "Missing 'depiction' on request body." });
  
  //here we are checking for if the package exists and the user is the developer
  const item = await pg("packages").select().where({ id: req.body.id, developer: req.user.id }).first();
  if (!item) return res.status(400).json({ success: false, error: "Invalid Package requested to update depiction." });

  let depiction;

  try {
    depiction = JSON.parse(req.body.depiction);
  } catch {
    return res.status(400).json({ success: false, error: "Invalid depiction." });
  }

  try {
    await pg("packages").where({ id: item.id }).update({
      depiction: JSON.stringify(depiction)
    });
  } catch {
    return res.status(400).json({ success: false, error: "Invalid depiction." });
  }

  return res.status(200).json({ success: true });
});