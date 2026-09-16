import { randomBytes } from "node:crypto";
import { decryptValue, encryptValue, hashValue } from "@/lib/crypto";

export type OAuthFlow = { state: string; nonce: string; verifier: string; issuedAt: number };

export function createOAuthFlow(now = Date.now()): OAuthFlow {
  return {
    state: randomBytes(32).toString("base64url"),
    nonce: randomBytes(32).toString("base64url"),
    verifier: randomBytes(64).toString("base64url"),
    issuedAt: now,
  };
}

export function encodeOAuthFlow(flow: OAuthFlow, key: Buffer) {
  const encrypted = encryptValue(JSON.stringify(flow), key);
  return [encrypted.nonce, encrypted.tag, encrypted.ciphertext].map((part) => part.toString("base64url")).join(".");
}

export function decodeOAuthFlow(value: string, key: Buffer): OAuthFlow {
  const [nonce, tag, ciphertext, extra] = value.split(".");
  if (!nonce || !tag || !ciphertext || extra) throw new Error("Invalid OAuth flow cookie");
  return JSON.parse(decryptValue({ nonce: Buffer.from(nonce, "base64url"), tag: Buffer.from(tag, "base64url"), ciphertext: Buffer.from(ciphertext, "base64url") }, key)) as OAuthFlow;
}

export function validateOAuthState(flow: OAuthFlow, state: string, now = Date.now()) {
  return now - flow.issuedAt < 10 * 60 * 1000 && hashValue(flow.state) === hashValue(state);
}

export function createPkceChallenge(verifier: string) {
  return hashValue(verifier);
}
