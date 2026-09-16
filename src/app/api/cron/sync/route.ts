import type { NextRequest } from "next/server";
import { isCronAuthorized } from "@/lib/cron";
import { appEnv } from "@/lib/env";
import { synchronize } from "@/lib/sync";

export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request.headers.get("authorization"), appEnv().cronSecret)) return Response.json({ status: "unauthorized" }, { status: 401 });
  try {
    const result = await synchronize();
    return Response.json({ status: result.outcome });
  } catch {
    return Response.json({ status: "failed" }, { status: 503 });
  }
}
