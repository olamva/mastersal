import { env } from "./env.js";

async function discovery() {
  const response = await fetch("https://auth.online.ntnu.no/.well-known/openid-configuration");
  if (!response.ok) throw new Error("OIDC discovery failed");
  return response.json() as Promise<{ authorization_endpoint: string; token_endpoint: string }>;
}

export async function authorizationUrl(redirectUri: string, state: string, challenge: string) {
  const url = new URL((await discovery()).authorization_endpoint);
  url.search = new URLSearchParams({ client_id: env("ONLINE_CLIENT_ID"), redirect_uri: redirectUri, response_type: "code", scope: "openid profile email offline_access", state, code_challenge: challenge, code_challenge_method: "S256", prompt: "consent" }).toString();
  return url;
}

export async function requestTokens(parameters: Record<string, string>) {
  const credentials = Buffer.from(`${env("ONLINE_CLIENT_ID")}:${env("ONLINE_CLIENT_SECRET")}`).toString("base64");
  const response = await fetch((await discovery()).token_endpoint, { method: "POST", headers: { authorization: `Basic ${credentials}` }, body: new URLSearchParams({ ...parameters, client_id: env("ONLINE_CLIENT_ID") }) });
  const payload = await response.json() as { error?: string; access_token?: string; refresh_token?: string };
  if (!response.ok || !payload.access_token) throw new Error(payload.error ?? "token_request_failed");
  return payload as { access_token: string; refresh_token?: string };
}
