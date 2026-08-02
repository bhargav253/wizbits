import "dotenv/config";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool } from "../src/db.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(scriptDir, "../db/schema.sql");

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required. Copy .env.example to .env first.");
  }
  await pool.query(await readFile(schemaPath, "utf8"));
  console.log("WizBits database schema is ready.");
} finally {
  await pool.end();
}
