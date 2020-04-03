import libpg from "pg";
import knex from "knex";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

libpg.defaults.ssl = true;
const pg = knex({
  client: 'pg',
  connection: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
    ssl: true
  }
});

pg.schema.table("files", table => {
  table.bigIncrements("id");

  //the id of the package in the other table
  table.string("package");

  //developer name
  table.string("developer");

  //description description
  table.string("desc");

  //package name
  table.string("name");

  //package icon
  table.string("icon");

  //version that this file is
  table.string("version");

  //check sums
  table.string("md5");
  table.string("sha1");
  table.string("sha256");

  //size
  table.bigInteger("size");

  //depends
  table.string("depends");

  //wether this version is enabled
  table.boolean("enabled");

  //wether package is accepted to the repo or not
  table.boolean("accepted");

  table.boolean("paid");
});

export default pg;