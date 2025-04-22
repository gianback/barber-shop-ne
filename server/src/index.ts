import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { pool } from "./db/db.config.js";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const ga = await pool.query("SELECT * FROM users");

    return c.json({
      message: "Hello Hono! desde docker composexd",
      data: ga,
    });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Error", data: error });
  }
});

app.get("/hello", (c) => {
  return c.json({ message: "Hello Hono! desde docker composexd" });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
