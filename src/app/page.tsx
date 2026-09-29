import { after, connection } from "next/server";
import { getSnapshot, getSyncState } from "@/lib/db";
import { synchronize } from "@/lib/sync";
import { loadSnapshotWithFallback } from "@/lib/sync-policy";
import type { PublicSnapshot } from "@/lib/types";

const kroner = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 });

export default async function Home() {
  await connection();
  let snapshot: PublicSnapshot | null = null;
  try {
    const [stored, state] = await Promise.all([getSnapshot(), getSyncState()]);
    snapshot = stored;
    if (state.status !== "authorization_required") snapshot = await loadSnapshotWithFallback(async () => stored, () => after(() => synchronize().catch(() => undefined)));
  } catch {
    snapshot = null;
  }
  const members = [...(snapshot?.members ?? [])].sort((left, right) => right.unpaidValue - left.unpaidValue || left.displayName.localeCompare(right.displayName, "nb"));
  return (
    <main>
      <h1>{snapshot?.groupName ?? "mastersal"}</h1>
      {members.length ? (
        <table className="member-table">
          <thead><tr><th scope="col">Navn</th><th scope="col">Skyldig</th><th scope="col">Straffer</th></tr></thead>
          <tbody>
            {members.map((member) => <tr key={member.id}><th scope="row">{member.displayName}</th><td>{kroner.format(member.unpaidValue)}</td><td>{member.punishmentCount}</td></tr>)}
          </tbody>
        </table>
      ) : (
        <p className="empty-state">Ingen publiserte data ennå.</p>
      )}
    </main>
  );
}
