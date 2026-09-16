import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { appEnv } from "@/lib/env";
import { OAuthTokenError } from "@/lib/oauth-error";
import type { TokenResponse } from "@/lib/oidc-types";
import { hashValue } from "@/lib/crypto";

type Discovery = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
};

let discoveryCache: Discovery | undefined;

export async function getDiscovery() {
  if (discoveryCache) return discoveryCache;
  const response = await fetch(new URL(".well-known/openid-configuration", appEnv().issuer), { cache: "force-cache" });
  if (!response.ok) throw new Error("OIDC discovery failed");
  discoveryCache = await response.json() as Discovery;
  return discoveryCache;
}

export async function createAuthorizationUrl(callbackUrl: string, state: string, nonce: string, challenge: string) {
  const discovery = await getDiscovery();
  const url = new URL(discovery.authorization_endpoint);
  url.searchParams.set("client_id", appEnv().clientId);
  url.searchParams.set("redirect_uri", callbackUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid profile email offline_access");
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "consent");
  return url;
}

async function requestToken(parameters: URLSearchParams): Promise<TokenResponse> {
  const discovery = await getDiscovery();
  const credentials = Buffer.from(`${appEnv().clientId}:${appEnv().clientSecret}`).toString("base64");
  const response = await fetch(discovery.token_endpoint, {
    method: "POST",
    headers: { authorization: `Basic ${credentials}`, "content-type": "application/x-www-form-urlencoded" },
    body: parameters,
  });
  const payload = await response.json() as { error?: string; access_token?: string; refresh_token?: string; expires_in?: number; id_token?: string };
  if (!response.ok || !payload.access_token) throw new OAuthTokenError(payload.error ?? "token_request_failed");
  return { accessToken: payload.access_token, refreshToken: payload.refresh_token, expiresIn: payload.expires_in ?? 600, idToken: payload.id_token };
}

export async function exchangeAuthorizationCode(code: string, verifier: string, callbackUrl: string, nonce: string) {
  const tokens = await requestToken(new URLSearchParams({ grant_type: "authorization_code", code, code_verifier: verifier, redirect_uri: callbackUrl, client_id: appEnv().clientId }));
  if (!tokens.refreshToken || !tokens.idToken) throw new Error("OAuth response omitted required tokens");
  const discovery = await getDiscovery();
  const verified = await jwtVerify(tokens.idToken, createRemoteJWKSet(new URL(discovery.jwks_uri)), { issuer: discovery.issuer, audience: appEnv().clientId, requiredClaims: ["nonce"] });
  if (typeof verified.payload.nonce !== "string" || hashValue(verified.payload.nonce) !== hashValue(nonce)) throw new Error("OIDC nonce validation failed");
  return tokens;
}

export async function refreshTokens(refreshToken: string) {
  return requestToken(new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken, client_id: appEnv().clientId }));
}
