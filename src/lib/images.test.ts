import { describe, expect, it } from "vitest";
import { findMemberImage, normalizeDisplayName } from "@/lib/images";

describe("member images", () => {
  it("prefers the stable identifier", () => expect(findMemberImage("42", "Ola Nordmann", ["ola-nordmann.png", "42.webp", "default.svg"])).toBe("42.webp"));
  it("uses the normalized display name second", () => expect(findMemberImage("42", "Åse Ødegård", ["ase-degard.jpg", "default.svg"])).toBe("ase-degard.jpg"));
  it("uses the default image when no match exists", () => expect(findMemberImage("42", "Ingen Treff", ["default.svg"])).toBe("default.svg"));
  it("normalizes Norwegian display names", () => expect(normalizeDisplayName(" Åse Ødegård ")).toBe("ase-degard"));
});
