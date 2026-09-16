import { type NextRequest, NextResponse } from "next/server";
import { adminRedirect, isAdminRequest, isSameOrigin } from "@/lib/admin-route";
import { synchronize } from "@/lib/sync";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return new Response("Unauthorized", { status: 401 });
  if (!isSameOrigin(request)) return new Response("Forbidden", { status: 403 });
  try {
    await synchronize();
    return NextResponse.redirect(adminRedirect(request, "?synchronized=1"), 303);
  } catch {
    return NextResponse.redirect(adminRedirect(request, "?error=sync"), 303);
  }
}
