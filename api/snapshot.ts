import { withClient } from "../server/db.js";
import { synchronize } from "../server/sync.js";

export async function GET() {
  await synchronize().catch(() => undefined);
  return Response.json(
    await withClient(
      async (client) =>
        (
          await client.query(
            `SELECT group_name AS "groupName", members FROM public_snapshot`,
          )
        ).rows[0] ?? null,
    ),
  );
}
