import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Client } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  const client = new Client(databaseUrl);
  await client.connect();
  try {
    await client.query(await readFile(join(process.cwd(), "migrations", "001_initial.sql"), "utf8"));
  } finally {
    await client.end();
  }
}

void main();
