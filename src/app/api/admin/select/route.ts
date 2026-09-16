import { type NextRequest, NextResponse } from "next/server";
import { adminRedirect, isAdminRequest, isSameOrigin } from "@/lib/admin-route";
import { selectConfiguredGroup } from "@/lib/sync";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return new Response("Unauthorized", { status: 401 });
  if (!isSameOrigin(request)) return new Response("Forbidden", { status: 403 });
  try {
    await selectConfiguredGroup();
    return NextResponse.redirect(adminRedirect(request, "?selected=1"), 303);
  } catch {
    return NextResponse.redirect(adminRedirect(request, "?error=group"), 303);
  }
}
