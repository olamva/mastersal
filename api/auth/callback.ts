import { safeEqual } from "../../server/crypto.js";
import { requestTokens } from "../../server/online.js";
import { saveRefreshToken, synchronize } from "../../server/sync.js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const [state, verifier] =
    request.headers
      .get("cookie")
      ?.match(/(?:^|; )oauth=([^.;]+)\.([^;]+)/)
      ?.slice(1) ?? [];
  const code = url.searchParams.get("code");
  if (
    !state ||
    !verifier ||
    !code ||
    !safeEqual(url.searchParams.get("state") ?? "", state)
  )
    return new Response("Invalid OAuth state", { status: 400 });
  const tokens = await requestTokens({
    grant_type: "authorization_code",
    code,
    code_verifier: verifier,
    redirect_uri: `${url.origin}${url.pathname}`,
  });
  if (!tokens.refresh_token)
    return new Response("Online returned no refresh token", { status: 502 });
  await saveRefreshToken(tokens.refresh_token);
  await synchronize();
  return new Response(null, {
    status: 302,
    headers: {
      location: "/",
      "set-cookie":
        "oauth=; Path=/api/auth; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
    },
  });
}
