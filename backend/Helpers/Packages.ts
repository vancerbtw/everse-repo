import fs from "await-fs";
import path from "path";
import pg from "../Database/pg";

async function generatePackages() {
  const files = await pg("files").select().where({ enabled: true, accepted: true });

  let packagesBody = "";

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    
    packagesBody.concat(`  
    Name: ${file.name}\n
    Package: ${file.package}\n
    Description: ${file.desc}\n
    Architecture: iphoneos-arm\n
    Section: ${file.section}\n
    Depiction: https://repo.everse.dev/cydia?depiction?package=${file.package}?udid={udid}\n
    Icon: ${file.icon}\n
    SileoDepiction: https://repo.everse.dev/sileo/depiction?package=${file.package}\n
    Version: ${file.version}\n
    ${file.paid ? "Tag: cydia::commercial\n" : ""} 
    Filename: /content/${file.id}\n
    Size: ${file.size}\n
    MD5sum: ${file.md5}\n
    SHA1: ${file.sha1}\n
    SHA256: ${file.sha256}\n
    Author: ${file.developer}\n
    Maintainer: VancerBTW \n
    Depends: ${file.depends}\n\n
    `)
  }

  fs.writeFile(path.join(__dirname, "/RepoFiles/packages"), packagesBody);

  return true;
}