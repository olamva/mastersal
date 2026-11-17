import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { env } from "./env.js";

const key = () => Buffer.from(env("TOKEN_ENCRYPTION_KEY"), "base64");

export function encrypt(value: string) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), nonce);
  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([nonce, cipher.getAuthTag(), ciphertext]).toString(
    "base64",
  );
}

export function decrypt(value: string) {
  const sealed = Buffer.from(value, "base64");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key(),
    sealed.subarray(0, 12),
  );
  decipher.setAuthTag(sealed.subarray(12, 28));
  return Buffer.concat([
    decipher.update(sealed.subarray(28)),
    decipher.final(),
  ]).toString("utf8");
}

export function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}
