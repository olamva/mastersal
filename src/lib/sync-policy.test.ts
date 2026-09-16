import { describe, expect, it } from "vitest";
import { loadSnapshotWithFallback, runExclusive } from "@/lib/sync-policy";
import type { PublicSnapshot } from "@/lib/types";

const snapshot: PublicSnapshot = { groupName: "Mastersal", groupShortName: "mastersal", groupImage: null, members: [], synchronizedAt: "2026-01-01T00:00:00.000Z" };

describe("synchronization policy", () => {
  it("allows only one concurrent synchronization", async () => {
    let held = false;
    let workCount = 0;
    const acquire = async () => {
      if (held) return null;
      held = true;
      return async () => { held = false; };
    };
    let finish: () => void = () => undefined;
    const first = runExclusive(acquire, async () => { workCount += 1; await new Promise<void>((resolve) => { finish = resolve; }); });
    await Promise.resolve();
    const second = await runExclusive(acquire, async () => { workCount += 1; });
    finish();
    await first;
    expect(second.outcome).toBe("locked");
    expect(workCount).toBe(1);
  });

  it("returns the last valid snapshot while a stale refresh fails", async () => {
    let started = false;
    const result = await loadSnapshotWithFallback(async () => snapshot, () => { started = true; }, new Date("2026-01-01T00:06:00.000Z").getTime());
    expect(result).toBe(snapshot);
    expect(started).toBe(true);
  });
});
