import { Client } from "@neondatabase/serverless";
import { env } from "./env.js";

export async function withClient<T>(work: (client: Client) => Promise<T>) {
  const client = new Client(env("DATABASE_URL"));
  await client.connect();
  try {
    return await work(client);
  } finally {
    await client.end();
  }
}
