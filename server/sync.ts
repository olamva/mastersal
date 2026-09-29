import { decrypt, encrypt, type EncryptedValue } from "./crypto.js";
import { withClient } from "./db.js";
import { toMembers, type Group } from "./members.js";
import { requestTokens } from "./online.js";

const groupId = "487db212-6c4f-4f7b-a616-563d5ee419cb";

export async function saveRefreshToken(token: string) {
  const { ciphertext, nonce, tag } = encrypt(token);
  await withClient((client) => client.query(
    `INSERT INTO oauth_connection (singleton, refresh_token_ciphertext, refresh_token_nonce, refresh_token_tag) VALUES (true, $1, $2, $3)
     ON CONFLICT (singleton) DO UPDATE SET refresh_token_ciphertext = $1, refresh_token_nonce = $2, refresh_token_tag = $3, authorization_required = false, authorized_at = now(), updated_at = now()`,
    [ciphertext, nonce, tag],
  ));
}

async function accessToken() {
  return withClient(async (client) => {
    await client.query("BEGIN");
    const { rows: [stored] } = await client.query<EncryptedValue>("SELECT refresh_token_ciphertext AS ciphertext, refresh_token_nonce AS nonce, refresh_token_tag AS tag FROM oauth_connection WHERE authorization_required = false FOR UPDATE");
    if (!stored) throw new Error("Online authorization is required");
    try {
      const tokens = await requestTokens({ grant_type: "refresh_token", refresh_token: decrypt(stored) });
      if (tokens.refresh_token) {
        const { ciphertext, nonce, tag } = encrypt(tokens.refresh_token);
        await client.query("UPDATE oauth_connection SET refresh_token_ciphertext = $1, refresh_token_nonce = $2, refresh_token_tag = $3, updated_at = now()", [ciphertext, nonce, tag]);
      }
      return tokens.access_token;
    } catch (error) {
      if (error instanceof Error && error.message === "invalid_grant") await client.query("UPDATE oauth_connection SET authorization_required = true, updated_at = now()");
      throw error;
    } finally {
      await client.query("COMMIT");
    }
  });
}

export async function synchronize() {
  const response = await fetch(`https://api.vinstraff.no/groups/${groupId}`, { headers: { authorization: `Bearer ${await accessToken()}` } });
  if (!response.ok) throw new Error(`Vinstraff request failed with HTTP ${response.status}`);
  const group = await response.json() as Group;
  await withClient((client) => client.query(
    `INSERT INTO public_snapshot (singleton, group_name, group_short_name, members, synchronized_at) VALUES (true, $1, $2, $3, now())
     ON CONFLICT (singleton) DO UPDATE SET group_name = $1, group_short_name = $2, members = $3, synchronized_at = now(), updated_at = now()`,
    [group.name, group.name_short, JSON.stringify(toMembers(group))],
  ));
}
