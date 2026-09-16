import "server-only";
import type { NextRequest } from "next/server";
import { appEnv } from "@/lib/env";
import { validateAdminSession } from "@/lib/session";

export function isAdminRequest(request: NextRequest) {
  return validateAdminSession(request.cookies.get("mastersal_admin")?.value, appEnv().adminSecret);
}

export function isSameOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}

export function adminRedirect(request: NextRequest, suffix = "") {
  return new URL(`/admin${suffix}`, request.nextUrl.origin);
}
