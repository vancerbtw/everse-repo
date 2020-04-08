const fs = require("fs-extra");
const {join} = require("path");

const typingsLinesArr = fs.readFileSync(join(__dirname, "node_modules", "ar", "lib", "ar.d.ts"), "utf8").split("\n");
let typingsString = typingsLinesArr.slice(1).join("\n").replace(/NodeBuffer/g, "Buffer");
fs.writeFileSync(join(__dirname, "node_modules", "ar", "lib", "ar.d.ts"), typingsString, "utf8");
