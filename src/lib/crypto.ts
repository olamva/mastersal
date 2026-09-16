import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type EncryptedValue = { ciphertext: Buffer; nonce: Buffer; tag: Buffer };

export function decodeEncryptionKey(value: string) {
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("TOKEN_ENCRYPTION_KEY must decode to 32 bytes");
  return key;
}

export function encryptValue(value: string, key: Buffer): EncryptedValue {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, nonce);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return { ciphertext, nonce, tag: cipher.getAuthTag() };
}

export function decryptValue(value: EncryptedValue, key: Buffer) {
  const decipher = createDecipheriv("aes-256-gcm", key, value.nonce);
  decipher.setAuthTag(value.tag);
  return Buffer.concat([decipher.update(value.ciphertext), decipher.final()]).toString("utf8");
}

export function hashValue(value: string) {
  return createHash("sha256").update(value).digest("base64url");
}

export function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
