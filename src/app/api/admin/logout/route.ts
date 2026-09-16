import { type NextRequest, NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/admin-route";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return new Response("Forbidden", { status: 403 });
  const response = NextResponse.redirect(new URL("/admin", request.nextUrl.origin), 303);
  response.cookies.set("mastersal_admin", "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
