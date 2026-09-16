import { safeEqual } from "@/lib/crypto";

export function isCronAuthorized(header: string | null, secret: string) {
  const expected = `Bearer ${secret}`;
  return typeof header === "string" && safeEqual(header, expected);
}
