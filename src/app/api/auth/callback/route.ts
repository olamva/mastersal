import { type NextRequest, NextResponse } from "next/server";
import { decodeEncryptionKey, decryptValue, encryptValue, hashValue } from "@/lib/crypto";
import { consumeOAuthFlow, saveInitialRefreshToken } from "@/lib/db";
import { appEnv } from "@/lib/env";
import { exchangeAuthorizationCode } from "@/lib/oidc";
import { clearAccessTokenCache } from "@/lib/token-service";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  if (!state || !code || request.nextUrl.searchParams.has("error")) return NextResponse.redirect(new URL("/admin?error=oauth", request.nextUrl.origin));
  const stored = await consumeOAuthFlow(hashValue(state));
  if (!stored) return NextResponse.redirect(new URL("/admin?error=state", request.nextUrl.origin));
  try {
    const key = decodeEncryptionKey(appEnv().encryptionKey);
    const verifier = decryptValue(stored.verifier, key);
    const nonce = decryptValue(stored.nonce, key);
    const callbackUrl = `${request.nextUrl.origin}/api/auth/callback`;
    const tokens = await exchangeAuthorizationCode(code, verifier, callbackUrl, nonce);
    await saveInitialRefreshToken(encryptValue(tokens.refreshToken!, key));
    clearAccessTokenCache();
    return NextResponse.redirect(new URL("/admin?connected=1", request.nextUrl.origin));
  } catch {
    return NextResponse.redirect(new URL("/admin?error=oauth", request.nextUrl.origin));
  }
}
