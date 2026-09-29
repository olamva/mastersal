import { expect, it } from "vitest";
import { toMembers } from "./members";

const punishment = {
  reason: "",
  reason_hidden: false,
  created_at: "2026-09-01T12:00:00Z",
};

it("sums unpaid punishments for active members and sorts by the unpaid value", () => {
  const members = toMembers({
    name: "Mastersal",
    name_short: "MASTERSAL",
    punishment_types: {
      wine: { name: "Vin", emoji: "🍷", value: 120 },
      soda: { name: "Brus", emoji: "🥤", value: 35 },
    },
    members: [
      {
        user_id: "u1",
        first_name: "Ada",
        last_name: "Lovelace",
        active: true,
        punishments: [
          {
            ...punishment,
            punishment_id: "p1",
            punishment_type_id: "wine",
            amount: 2,
            paid: true,
            reason: "Secret",
            reason_hidden: true,
          },
          {
            ...punishment,
            punishment_id: "p2",
            punishment_type_id: "soda",
            amount: 1,
            paid: false,
            reason: "Late",
            created_at: "2026-09-02T12:00:00Z",
          },
        ],
      },
      {
        user_id: "u2",
        first_name: "Grace",
        last_name: "Hopper",
        active: true,
        punishments: [
          {
            ...punishment,
            punishment_id: "p3",
            punishment_type_id: "wine",
            amount: 3,
            paid: false,
          },
        ],
      },
      {
        user_id: "u3",
        first_name: "Alan",
        last_name: "Turing",
        active: false,
        punishments: [
          {
            ...punishment,
            punishment_id: "p4",
            punishment_type_id: "wine",
            amount: 9,
            paid: false,
          },
        ],
      },
    ],
  });
  expect(members).toEqual([
    {
      id: "u2",
      displayName: "Grace Hopper",
      unpaidValue: 360,
      punishmentCount: 1,
      punishments: [
        {
          id: "p3",
          name: "Vin",
          emoji: "🍷",
          amount: 3,
          value: 360,
          reason: "",
          createdAt: "2026-09-01T12:00:00Z",
          paid: false,
        },
      ],
    },
    {
      id: "u1",
      displayName: "Ada Lovelace",
      unpaidValue: 35,
      punishmentCount: 2,
      punishments: [
        {
          id: "p2",
          name: "Brus",
          emoji: "🥤",
          amount: 1,
          value: 35,
          reason: "Late",
          createdAt: "2026-09-02T12:00:00Z",
          paid: false,
        },
        {
          id: "p1",
          name: "Vin",
          emoji: "🍷",
          amount: 2,
          value: 240,
          reason: null,
          createdAt: "2026-09-01T12:00:00Z",
          paid: true,
        },
      ],
    },
  ]);
});
