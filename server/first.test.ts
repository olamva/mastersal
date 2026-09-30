import { expect, it } from "vitest";
import { isFirstMonth, series, standings, type FirstMonth } from "./first";

const months: FirstMonth[] = [
  { month: "2026-08", counts: { Grace: 4, Ada: 9 } },
  { month: "2026-09", counts: { Alan: 7, Grace: 5, Ada: 0 } },
];

it("accumulates the totals for each person in the order of first appearance", () => {
  expect(series(months)).toEqual([
    { name: "Ada", totals: [9, 9] },
    { name: "Grace", totals: [4, 9] },
    { name: "Alan", totals: [0, 7] },
  ]);
});

it("sorts the standings by total and gives tied people the same rank", () => {
  expect(standings(months)).toEqual([
    { name: "Ada", total: 9, rank: 1 },
    { name: "Grace", total: 9, rank: 1 },
    { name: "Alan", total: 7, rank: 3 },
  ]);
});

it.each([
  [{ month: "2026-09", counts: { Ada: 3, Grace: 0 } }, true],
  [{ month: "2026-13", counts: {} }, false],
  [{ month: "2026-9", counts: {} }, false],
  [{ month: "2026-09" }, false],
  [{ month: "2026-09", counts: { Ada: -1 } }, false],
  [{ month: "2026-09", counts: { Ada: 1.5 } }, false],
  [{ month: "2026-09", counts: { Ada: null } }, false],
  [null, false],
])("validates the month entry %j as %s", (value, valid) => {
  expect(isFirstMonth(value)).toBe(valid);
});
