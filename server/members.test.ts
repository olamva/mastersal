import { expect, it } from "vitest";
import { toMembers } from "./members";

it("sums unpaid punishments for active members and sorts by the unpaid value", () => {
  const members = toMembers({
    name: "Mastersal",
    name_short: "MASTERSAL",
    punishment_types: { wine: { value: 120 }, soda: { value: 35 } },
    members: [
      {
        user_id: "u1",
        first_name: "Ada",
        last_name: "Lovelace",
        active: true,
        punishments: [
          { punishment_type_id: "wine", amount: 2, paid: true },
          { punishment_type_id: "soda", amount: 1, paid: false },
        ],
      },
      {
        user_id: "u2",
        first_name: "Grace",
        last_name: "Hopper",
        active: true,
        punishments: [{ punishment_type_id: "wine", amount: 3, paid: false }],
      },
      {
        user_id: "u3",
        first_name: "Alan",
        last_name: "Turing",
        active: false,
        punishments: [{ punishment_type_id: "wine", amount: 9, paid: false }],
      },
    ],
  });
  expect(members).toEqual([
    {
      id: "u2",
      displayName: "Grace Hopper",
      unpaidValue: 360,
      punishmentCount: 1,
    },
    {
      id: "u1",
      displayName: "Ada Lovelace",
      unpaidValue: 35,
      punishmentCount: 2,
    },
  ]);
});
