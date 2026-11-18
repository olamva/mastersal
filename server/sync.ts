import { decrypt, encrypt } from "./crypto.js";
import { withClient } from "./db.js";
import { env } from "./env.js";
import { toMembers, type Group, type Snapshot } from "./members.js";
import { requestTokens } from "./online.js";

const groupId = "487db212-6c4f-4f7b-a616-563d5ee419cb";

async function redis(...command: (string | number)[]) {
  const response = await fetch(env("KV_REST_API_URL"), {
    method: "POST",
    headers: { authorization: `Bearer ${env("KV_REST_API_TOKEN")}` },
    body: JSON.stringify(command),
  });
  const { result, error } = (await response.json()) as {
    result?: string | null;
    error?: string;
  };
  if (error) throw new Error(error);
  return result ?? null;
}

export async function saveRefreshToken(token: string) {
  await redis("SET", "online:refresh", encrypt(token));
}

async function accessToken() {
  const cached = await redis("GET", "online:access");
  if (cached) return decrypt(cached);
  const stored = await redis("GET", "online:refresh");
  if (!stored) throw new Error("Online authorization is required");
  const tokens = await requestTokens({
    grant_type: "refresh_token",
    refresh_token: decrypt(stored),
  }).catch(async (error) => {
    if (error instanceof Error && error.message === "invalid_grant")
      await redis("DEL", "online:refresh");
    throw error;
  });
  if (tokens.refresh_token) await saveRefreshToken(tokens.refresh_token);
  await redis(
    "SET",
    "online:access",
    encrypt(tokens.access_token),
    "EX",
    tokens.expires_in - 60,
  );
  return tokens.access_token;
}

async function fetchGroup() {
  const response = await fetch(`https://api.vinstraff.no/groups/${groupId}`, {
    headers: { authorization: `Bearer ${await accessToken()}` },
  });
  if (!response.ok)
    throw new Error(`Vinstraff request failed with HTTP ${response.status}`);
  return (await response.json()) as Group;
}

export async function liveSnapshot(): Promise<Snapshot> {
  const group = await fetchGroup();
  return { groupName: group.name, members: toMembers(group) };
}

export async function synchronize() {
  const group = await fetchGroup();
  await withClient((client) =>
    client.query(
      `INSERT INTO public_snapshot (singleton, group_name, group_short_name, members, synchronized_at) VALUES (true, $1, $2, $3, now())
     ON CONFLICT (singleton) DO UPDATE SET group_name = $1, group_short_name = $2, members = $3, synchronized_at = now(), updated_at = now()`,
      [group.name, group.name_short, JSON.stringify(toMembers(group))],
    ),
  );
}
