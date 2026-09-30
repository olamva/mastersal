import { isAdmin, sessionCookie } from "../server/admin.js";
import { safeEqual } from "../server/crypto.js";
import { env } from "../server/env.js";

export const GET = (request: Request) =>
  new Response(null, { status: isAdmin(request) ? 204 : 401 });

export async function POST(request: Request) {
  const { secret } = await request.json();
  return safeEqual(String(secret), env("ADMIN_SETUP_SECRET"))
    ? new Response(null, {
        status: 204,
        headers: { "set-cookie": sessionCookie() },
      })
    : new Response("Unauthorized", { status: 401 });
}
