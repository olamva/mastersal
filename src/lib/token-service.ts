import "server-only";
import { decodeEncryptionKey } from "@/lib/crypto";
import { withLockedRefreshToken } from "@/lib/db";
import { appEnv } from "@/lib/env";
import { refreshTokens } from "@/lib/oidc";
import { rotateRefreshToken } from "@/lib/refresh-rotation";

let accessTokenCache: { value: string; expiresAt: number } | undefined;

export async function getAccessToken(now = Date.now()) {
  if (accessTokenCache && accessTokenCache.expiresAt - now > 60_000) return accessTokenCache.value;
  const tokens = await rotateRefreshToken(withLockedRefreshToken, refreshTokens, decodeEncryptionKey(appEnv().encryptionKey));
  accessTokenCache = { value: tokens.accessToken, expiresAt: now + tokens.expiresIn * 1000 };
  return tokens.accessToken;
}

export function clearAccessTokenCache() {
  accessTokenCache = undefined;
}
