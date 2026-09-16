import { safeEqual, signValue } from "@/lib/crypto";

const sessionDurationMs = 8 * 60 * 60 * 1000;

export function createAdminSession(secret: string, now = Date.now()) {
  const payload = now.toString(36);
  return `${payload}.${signValue(payload, secret)}`;
}

export function validateAdminSession(value: string | undefined, secret: string, now = Date.now()) {
  if (!value) return false;
  const [payload, signature, extra] = value.split(".");
  if (!payload || !signature || extra || !safeEqual(signature, signValue(payload, secret))) return false;
  const issuedAt = Number.parseInt(payload, 36);
  return Number.isFinite(issuedAt) && issuedAt <= now && now - issuedAt < sessionDurationMs;
}

export function validateAdminSecret(value: string, secret: string) {
  return safeEqual(value, secret);
}
