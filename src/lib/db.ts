import "server-only";
import { Client, type NeonDbError } from "@neondatabase/serverless";
import { appEnv } from "@/lib/env";
import type { EncryptedValue } from "@/lib/crypto";
import type { LockedRefreshRecord } from "@/lib/refresh-rotation";
import type { PublicSnapshot, SafeSyncState } from "@/lib/types";
import { runExclusive } from "@/lib/sync-policy";

async function connect() {
  const client = new Client(appEnv().databaseUrl);
  await client.connect();
  return client;
}

export async function query<T extends Record<string, unknown>>(text: string, values: unknown[] = []) {
  const client = await connect();
  try {
    return (await client.query<T>(text, values)).rows;
  } finally {
    await client.end();
  }
}

export async function databaseIsReady() {
  try {
    await query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function saveInitialRefreshToken(value: EncryptedValue) {
  await query(
    `INSERT INTO oauth_connection (singleton, refresh_token_ciphertext, refresh_token_nonce, refresh_token_tag, authorization_required, authorized_at, updated_at)
     VALUES (true, $1, $2, $3, false, now(), now())
     ON CONFLICT (singleton) DO UPDATE SET refresh_token_ciphertext = excluded.refresh_token_ciphertext, refresh_token_nonce = excluded.refresh_token_nonce, refresh_token_tag = excluded.refresh_token_tag, token_version = oauth_connection.token_version + 1, authorization_required = false, authorized_at = now(), updated_at = now()`,
    [value.ciphertext, value.nonce, value.tag],
  );
  await query("UPDATE sync_state SET status = 'idle', last_error_code = NULL, updated_at = now() WHERE singleton = true");
}

export async function saveOAuthFlow(stateHash: string, nonce: EncryptedValue, verifier: EncryptedValue) {
  await query("DELETE FROM oauth_flow WHERE expires_at < now()");
  await query(
    "INSERT INTO oauth_flow (state_hash, nonce_ciphertext, nonce_nonce, nonce_tag, verifier_ciphertext, verifier_nonce, verifier_tag, expires_at) VALUES ($1, $2, $3, $4, $5, $6, $7, now() + interval '10 minutes')",
    [stateHash, nonce.ciphertext, nonce.nonce, nonce.tag, verifier.ciphertext, verifier.nonce, verifier.tag],
  );
}

export async function consumeOAuthFlow(stateHash: string) {
  const rows = await query<{ nonce_ciphertext: Buffer; nonce_nonce: Buffer; nonce_tag: Buffer; verifier_ciphertext: Buffer; verifier_nonce: Buffer; verifier_tag: Buffer }>(
    "DELETE FROM oauth_flow WHERE state_hash = $1 AND expires_at >= now() RETURNING nonce_ciphertext, nonce_nonce, nonce_tag, verifier_ciphertext, verifier_nonce, verifier_tag",
    [stateHash],
  );
  const row = rows[0];
  return row ? {
    nonce: { ciphertext: row.nonce_ciphertext, nonce: row.nonce_nonce, tag: row.nonce_tag },
    verifier: { ciphertext: row.verifier_ciphertext, nonce: row.verifier_nonce, tag: row.verifier_tag },
  } : null;
}

export async function hasOAuthConnection() {
  const rows = await query<{ connected: boolean }>("SELECT EXISTS (SELECT 1 FROM oauth_connection WHERE singleton = true AND authorization_required = false) AS connected");
  return rows[0]?.connected ?? false;
}

export async function withLockedRefreshToken<T>(work: (record: LockedRefreshRecord, replace: (value: EncryptedValue) => Promise<void>, requireAuthorization: () => Promise<void>) => Promise<T>) {
  const client = await connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(78234102)");
    const result = await client.query<{ refresh_token_ciphertext: Buffer; refresh_token_nonce: Buffer; refresh_token_tag: Buffer; token_version: number }>(
      "SELECT refresh_token_ciphertext, refresh_token_nonce, refresh_token_tag, token_version FROM oauth_connection WHERE singleton = true AND authorization_required = false FOR UPDATE",
    );
    const row = result.rows[0];
    if (!row) throw new Error("OAuth authorization is required");
    const output = await work(
      { ciphertext: row.refresh_token_ciphertext, nonce: row.refresh_token_nonce, tag: row.refresh_token_tag, tokenVersion: row.token_version },
      async (value) => {
        await client.query(
          "UPDATE oauth_connection SET refresh_token_ciphertext = $1, refresh_token_nonce = $2, refresh_token_tag = $3, token_version = token_version + 1, updated_at = now() WHERE singleton = true",
          [value.ciphertext, value.nonce, value.tag],
        );
      },
      async () => {
        await client.query("UPDATE oauth_connection SET authorization_required = true, updated_at = now() WHERE singleton = true");
        await client.query("UPDATE sync_state SET status = 'authorization_required', last_error_code = 'invalid_grant', last_error_at = now(), updated_at = now() WHERE singleton = true");
      },
    );
    await client.query("COMMIT");
    return output;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

export async function getSnapshot(): Promise<PublicSnapshot | null> {
  const rows = await query<{ group_name: string; group_short_name: string; group_image: string | null; members: PublicSnapshot["members"]; synchronized_at: Date }>(
    "SELECT group_name, group_short_name, group_image, members, synchronized_at FROM public_snapshot WHERE singleton = true",
  );
  const row = rows[0];
  return row ? { groupName: row.group_name, groupShortName: row.group_short_name, groupImage: row.group_image, members: row.members, synchronizedAt: row.synchronized_at.toISOString() } : null;
}

export async function getSyncState(): Promise<SafeSyncState> {
  const rows = await query<{ status: SafeSyncState["status"]; selected_group_id: string | null; selected_group_name: string | null; selected_group_short_name: string | null; last_started_at: Date | null; last_success_at: Date | null; last_error_at: Date | null; last_error_code: string | null }>(
    "SELECT status, selected_group_id, selected_group_name, selected_group_short_name, last_started_at, last_success_at, last_error_at, last_error_code FROM sync_state WHERE singleton = true",
  );
  const row = rows[0];
  return {
    status: row?.status ?? "not_configured",
    selectedGroupId: row?.selected_group_id ?? null,
    selectedGroupName: row?.selected_group_name ?? null,
    selectedGroupShortName: row?.selected_group_short_name ?? null,
    lastStartedAt: row?.last_started_at?.toISOString() ?? null,
    lastSuccessAt: row?.last_success_at?.toISOString() ?? null,
    lastErrorAt: row?.last_error_at?.toISOString() ?? null,
    lastErrorCode: row?.last_error_code ?? null,
  };
}

export async function runWithSyncLock(work: () => Promise<{ groupName: string; groupShortName: string; groupImage: string | null; members: PublicSnapshot["members"] }>) {
  const client = await connect();
  try {
    const result = await runExclusive(
      async () => {
        const lockResult = await client.query<{ locked: boolean }>("SELECT pg_try_advisory_lock(78234101) AS locked");
        return lockResult.rows[0]?.locked ? async () => { await client.query("SELECT pg_advisory_unlock(78234101)"); } : null;
      },
      async () => {
        await client.query("UPDATE sync_state SET status = 'syncing', last_started_at = now(), updated_at = now() WHERE singleton = true");
        const snapshot = await work();
        await client.query("BEGIN");
        await client.query(
          `INSERT INTO public_snapshot (singleton, group_name, group_short_name, group_image, members, synchronized_at, updated_at)
           VALUES (true, $1, $2, $3, $4::jsonb, now(), now())
           ON CONFLICT (singleton) DO UPDATE SET group_name = excluded.group_name, group_short_name = excluded.group_short_name, group_image = excluded.group_image, members = excluded.members, synchronized_at = excluded.synchronized_at, updated_at = now()`,
          [snapshot.groupName, snapshot.groupShortName, snapshot.groupImage, JSON.stringify(snapshot.members)],
        );
        await client.query(
          "UPDATE sync_state SET status = 'idle', selected_group_name = $1, selected_group_short_name = $2, last_success_at = now(), last_error_at = NULL, last_error_code = NULL, updated_at = now() WHERE singleton = true",
          [snapshot.groupName, snapshot.groupShortName],
        );
        await client.query("COMMIT");
        return snapshot.members.length;
      },
    );
    return result.outcome === "locked" ? result : { outcome: "synchronized" as const, memberCount: result.value };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    const code = error instanceof Error && error.message === "OAuth authorization is required" ? "authorization_required" : "sync_failed";
    await client.query("UPDATE sync_state SET status = $1, last_error_at = now(), last_error_code = $2, updated_at = now() WHERE singleton = true", [code === "authorization_required" ? "authorization_required" : "error", code]).catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

export async function saveSelectedGroup(groupId: string, groupName: string, groupShortName: string) {
  await query("UPDATE sync_state SET selected_group_id = $1, selected_group_name = $2, selected_group_short_name = $3, status = 'idle', updated_at = now() WHERE singleton = true", [groupId, groupName, groupShortName]);
}

export function isMissingDatabaseTable(error: unknown) {
  return (error as NeonDbError | undefined)?.code === "42P01";
}
