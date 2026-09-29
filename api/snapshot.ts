import { waitUntil } from "@vercel/functions";
import { withClient } from "../server/db.js";
import { synchronize } from "../server/sync.js";

export async function GET() {
  const { snapshot, stale } = await withClient(async (client) => ({
    snapshot: (await client.query(`SELECT group_name AS "groupName", members FROM public_snapshot`)).rows[0] ?? null,
    stale: Boolean((await client.query("UPDATE public_snapshot SET updated_at = now() WHERE updated_at < now() - interval '5 minutes'")).rowCount),
  }));
  if (stale) waitUntil(synchronize().catch(() => undefined));
  return Response.json(snapshot);
}
