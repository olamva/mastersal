import { type NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-route";
import { decodeEncryptionKey, encryptValue, hashValue } from "@/lib/crypto";
import { saveOAuthFlow } from "@/lib/db";
import { appEnv } from "@/lib/env";
import { createOAuthFlow, createPkceChallenge } from "@/lib/oauth-flow";
import { createAuthorizationUrl } from "@/lib/oidc";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return new Response("Unauthorized", { status: 401 });
  const flow = createOAuthFlow();
  const key = decodeEncryptionKey(appEnv().encryptionKey);
  await saveOAuthFlow(hashValue(flow.state), encryptValue(flow.nonce, key), encryptValue(flow.verifier, key));
  const callbackUrl = `${request.nextUrl.origin}/api/auth/callback`;
  return NextResponse.redirect(await createAuthorizationUrl(callbackUrl, flow.state, flow.nonce, createPkceChallenge(flow.verifier)));
}
