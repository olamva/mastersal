import { type NextRequest, NextResponse } from "next/server";
import { appEnv } from "@/lib/env";
import { createAdminSession, validateAdminSecret } from "@/lib/session";
import { isSameOrigin } from "@/lib/admin-route";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return new Response("Forbidden", { status: 403 });
  const form = await request.formData();
  const submitted = form.get("secret");
  if (typeof submitted !== "string" || !validateAdminSecret(submitted, appEnv().adminSecret)) return NextResponse.redirect(new URL("/admin?error=unauthorized", request.nextUrl.origin), 303);
  const response = NextResponse.redirect(new URL("/admin", request.nextUrl.origin), 303);
  response.cookies.set("mastersal_admin", createAdminSession(appEnv().adminSecret), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 8 * 60 * 60 });
  return response;
}
