import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import ar from "ar";
import tar from "tar";

export async function debScan(fileName: string) {
  await fs.mkdirp(path.join(__dirname, "../temp"));
  const p = path.join(__dirname, "../packages/", fileName);

  const md5 = crypto.createHash("md5");
  const sha1 = crypto.createHash("sha1");
  const sha256 = crypto.createHash("sha256");

  const stats = await fs.stat(p);
  const size = stats.size;
  const file = await fs.readFile(p);

  md5.update(file);
  sha1.update(file);
  sha256.update(file);

  const archive = new ar.Archive(file);
  const controlTar = archive.getFiles().find(file => file.name() === "control.tar.gz")!;
  const tempDir = path.join(__dirname, "../temp");
  const tarPath = path.join(tempDir, controlTar.name());
  await fs.writeFile(tarPath, controlTar.fileData(), "utf8");
  await tar.x({
    file: tarPath,
    C: tempDir,
  });

  const controlFileArr = (await fs.readFile(path.join(tempDir, "control"), "utf8")).split("\n").filter(line => !line.startsWith("Installed-Size"));
  let controlObj: { package?: string, name?: string, depends?: string, architecture?: string, description?: string, maintainer?: string, author?: string, section?: string, version?: string } = {};

  for (let index = 0; index < controlFileArr.length; index++) {
    const info = controlFileArr[index].split(": ");
    if (!info[1]) continue;

    Object.defineProperty(controlObj, info[0].toLowerCase(), {
      value : info[1],
      writable : true,
      enumerable : true,
      configurable : true
    });
  }

  await fs.remove(path.join(__dirname, "../temp"));

  return {
    control: controlObj,
    size,
    md5: md5.digest("hex"),
    sha1: sha1.digest("hex"),
    sha256: sha256.digest("hex")
  };
}