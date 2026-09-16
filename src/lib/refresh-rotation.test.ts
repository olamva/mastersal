import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { decryptValue, encryptValue } from "@/lib/crypto";
import { OAuthTokenError } from "@/lib/oauth-error";
import { rotateRefreshToken, type RefreshTransaction } from "@/lib/refresh-rotation";

function store(initial: string, key: Buffer) {
  let record = { ...encryptValue(initial, key), tokenVersion: 1 };
  let authorizationRequired = false;
  const transaction: RefreshTransaction = async (work) => {
    let replacement = record;
    let nextAuthorizationRequired = authorizationRequired;
    const result = await work(record, async (value) => { replacement = { ...value, tokenVersion: record.tokenVersion + 1 }; }, async () => { nextAuthorizationRequired = true; });
    record = replacement;
    authorizationRequired = nextAuthorizationRequired;
    return result;
  };
  return { transaction, token: () => decryptValue(record, key), version: () => record.tokenVersion, authorizationRequired: () => authorizationRequired };
}

describe("refresh token rotation", () => {
  it("persists a rotated token atomically", async () => {
    const key = randomBytes(32);
    const state = store("old", key);
    const result = await rotateRefreshToken(state.transaction, async (token) => ({ accessToken: `access-for-${token}`, refreshToken: "new", expiresIn: 600 }), key);
    expect(result.accessToken).toBe("access-for-old");
    expect(state.token()).toBe("new");
    expect(state.version()).toBe(2);
  });

  it("preserves the previous token after a temporary failure", async () => {
    const key = randomBytes(32);
    const state = store("old", key);
    await expect(rotateRefreshToken(state.transaction, async () => { throw new Error("temporary"); }, key)).rejects.toThrow("temporary");
    expect(state.token()).toBe("old");
    expect(state.version()).toBe(1);
  });

  it("marks invalid grants for administrator authorization", async () => {
    const key = randomBytes(32);
    const state = store("old", key);
    await expect(rotateRefreshToken(state.transaction, async () => { throw new OAuthTokenError("invalid_grant"); }, key)).rejects.toThrow("OAuth token request failed");
    expect(state.token()).toBe("old");
    expect(state.authorizationRequired()).toBe(true);
  });
});
