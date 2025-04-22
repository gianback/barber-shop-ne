import pg from "pg";
import {
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_HOST,
} from "../utils/constants.js";

export const pool = new pg.Pool({
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: +POSTGRES_PORT,
  host: POSTGRES_HOST,
});
