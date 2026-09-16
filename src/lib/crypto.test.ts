import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { decryptValue, encryptValue } from "@/lib/crypto";

describe("refresh token encryption", () => {
  it("round-trips with AES-256-GCM and rejects a modified tag", () => {
    const key = randomBytes(32);
    const encrypted = encryptValue("refresh-secret", key);
    expect(encrypted.nonce).toHaveLength(12);
    expect(encrypted.tag).toHaveLength(16);
    expect(decryptValue(encrypted, key)).toBe("refresh-secret");
    const modified = { ...encrypted, tag: Buffer.from(encrypted.tag) };
    modified.tag[0] ^= 1;
    expect(() => decryptValue(modified, key)).toThrow();
  });
});
