import type { PublicSnapshot } from "@/lib/types";

export function isSnapshotStale(synchronizedAt: string, now = Date.now()) {
  return now - new Date(synchronizedAt).getTime() > 5 * 60 * 1000;
}

export async function loadSnapshotWithFallback(load: () => Promise<PublicSnapshot | null>, startSync: () => void, now = Date.now()) {
  const snapshot = await load();
  if (snapshot && isSnapshotStale(snapshot.synchronizedAt, now)) startSync();
  return snapshot;
}

export async function runExclusive<T>(acquire: () => Promise<(() => Promise<void>) | null>, work: () => Promise<T>) {
  const release = await acquire();
  if (!release) return { outcome: "locked" as const };
  try {
    return { outcome: "completed" as const, value: await work() };
  } finally {
    await release();
  }
}
