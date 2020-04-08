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

export default pg;