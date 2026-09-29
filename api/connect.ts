import { createHash, randomBytes } from "node:crypto";
import { safeEqual } from "../server/crypto.js";
import { env } from "../server/env.js";
import { authorizationUrl } from "../server/online.js";

export async function GET(request: Request) {
  const password = Buffer.from(
    request.headers.get("authorization")?.replace(/^Basic /, "") ?? "",
    "base64",
  )
    .toString()
    .split(":")
    .slice(1)
    .join(":");
  if (!safeEqual(password, env("ADMIN_SETUP_SECRET")))
    return new Response("Unauthorized", {
      status: 401,
      headers: { "www-authenticate": 'Basic realm="mastersal"' },
    });
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(64).toString("base64url");
  const url = await authorizationUrl(
    new URL("/api/auth/callback", request.url).href,
    state,
    createHash("sha256").update(verifier).digest("base64url"),
  );
  return new Response(null, {
    status: 302,
    headers: {
      location: url.href,
      "set-cookie": `oauth=${state}.${verifier}; Path=/api/auth; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
