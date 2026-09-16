import { describe, expect, it } from "vitest";
import { calculateMember, sanitizeGroup } from "@/lib/sanitize";
import type { VinstraffGroup } from "@/lib/types";

const group: VinstraffGroup = {
  group_id: "g1",
  name: "Mastersal",
  name_short: "mastersal",
  image: "",
  punishment_types: { wine: { value: 120 }, soda: { value: 35 } },
  members: [
    { user_id: "u1", first_name: "Ada", last_name: "Lovelace", active: true, punishments: [{ punishment_type_id: "wine", amount: 2, paid: true }, { punishment_type_id: "soda", amount: 1, paid: false }] },
    { user_id: "u2", first_name: "Grace", last_name: "Hopper", active: true, punishments: [{ punishment_type_id: "wine", amount: 3, paid: false }] },
    { user_id: "u3", first_name: "Alan", last_name: "Turing", active: false, punishments: [{ punishment_type_id: "wine", amount: 9, paid: false }] },
  ],
};

describe("punishment calculations", () => {
  it("calculates total, paid, unpaid, and count values", () => {
    const member = calculateMember(group.members[0], group.punishment_types);
    expect(member).toMatchObject({ totalValue: 275, paidValue: 240, unpaidValue: 35, punishmentCount: 2 });
  });

  it("keeps active members and sorts by descending total value", () => {
    const members = sanitizeGroup(group);
    expect(members.map((member) => member.id)).toEqual(["u2", "u1"]);
  });

  it("returns only the public member fields", () => {
    const raw = { ...group.members[0], email: "private@example.com", permissions: ["owner"] };
    const member = calculateMember(raw, group.punishment_types);
    expect(Object.keys(member).sort()).toEqual(["active", "displayName", "id", "imageFilename", "paidValue", "punishmentCount", "totalValue", "unpaidValue"].sort());
    expect(JSON.stringify(member)).not.toContain("private@example.com");
  });
});
