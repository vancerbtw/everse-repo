import fs from "fs-extra";
import path from "path";
import { host } from "../Helpers/Host";
import pg from "../Database/pg";

export async function generatePackages() {
  const files = await pg("files").select().where({ enabled: true, accepted: true });

  let packagesBody = "";

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    
    packagesBody += `Name: ${file.name}\nPackage: ${file.package}\nDescription: ${file.desc}\nArchitecture: ${file.architecture}\nSection: ${file.section}\nDepiction: http://${host.self}/cydia/depiction?package=${file.package}&token={udid}\nIcon: ${file.icon}\nSileoDepiction: https://repo.everse.dev/sileo/depiction?package=${file.package}\nVersion: ${file.version}\n${file.paid ? "Tag: cydia::commercial\n" : ""}Filename: /content/package/${file.files_id}\nSize: ${file.size}\nMD5sum: ${file.md5}\nSHA1: ${file.sha1}\nSHA256: ${file.sha256}\nAuthor: ${file.developer}\nMaintainer: VancerBTW \nDepends: ${file.depends}\n\n`;
  }

  fs.writeFile(path.join(__dirname, "../RepoFiles/packages"), packagesBody);

  return true;
}