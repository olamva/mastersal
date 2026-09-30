import { createHmac } from "node:crypto";
import { safeEqual } from "./crypto.js";
import { env } from "./env.js";

const session = () =>
  createHmac("sha256", env("ADMIN_SETUP_SECRET"))
    .update("admin")
    .digest("base64url");

export const sessionCookie = () =>
  `admin=${session()}; Path=/api; Max-Age=31536000; HttpOnly; Secure; SameSite=Strict`;

export const isAdmin = (request: Request) =>
  safeEqual(
    /(?:^|; )admin=([^;]+)/.exec(request.headers.get("cookie") ?? "")?.[1] ??
      "",
    session(),
  );
