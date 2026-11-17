import { withClient } from "../server/db.js";
import { liveSnapshot } from "../server/sync.js";

export async function GET() {
  const live = await liveSnapshot().catch(() => null);
  return Response.json(
    live ??
      (await withClient(
        async (client) =>
          (
            await client.query(
              `SELECT group_name AS "groupName", members FROM public_snapshot`,
            )
          ).rows[0] ?? null,
      )),
    { headers: { "cache-control": `public, s-maxage=${live ? 30 : 1800}` } },
  );
}
