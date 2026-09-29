import { safeEqual } from "../server/crypto.js";
import { env } from "../server/env.js";
import { synchronize } from "../server/sync.js";

export async function GET(request: Request) {
  if (
    !safeEqual(
      request.headers.get("authorization") ?? "",
      `Bearer ${env("CRON_SECRET")}`,
    )
  )
    return new Response("Unauthorized", { status: 401 });
  await synchronize();
  return new Response("Synchronized");
}
