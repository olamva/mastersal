import { isAdmin } from "../server/admin.js";
import { withClient } from "../server/db.js";
import { isFirstMonth } from "../server/first.js";

export async function GET() {
  return Response.json(
    await withClient(
      async (client) =>
        (
          await client.query(
            "SELECT month, counts FROM first_month ORDER BY month",
          )
        ).rows,
    ),
  );
}

export async function PUT(request: Request) {
  if (!isAdmin(request)) return new Response("Unauthorized", { status: 401 });
  const entry: unknown = await request.json();
  if (!isFirstMonth(entry)) return new Response("Bad Request", { status: 400 });
  await withClient((client) =>
    client.query(
      "INSERT INTO first_month (month, counts) VALUES ($1, $2) ON CONFLICT (month) DO UPDATE SET counts = $2",
      [entry.month, JSON.stringify(entry.counts)],
    ),
  );
  return new Response(null, { status: 204 });
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return new Response("Unauthorized", { status: 401 });
  await withClient((client) =>
    client.query("DELETE FROM first_month WHERE month = $1", [
      new URL(request.url).searchParams.get("month"),
    ]),
  );
  return new Response(null, { status: 204 });
}
