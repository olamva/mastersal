import { after, connection } from "next/server";
import { getSnapshot, getSyncState } from "@/lib/db";
import { synchronize } from "@/lib/sync";
import { loadSnapshotWithFallback } from "@/lib/sync-policy";
import type { PublicSnapshot, SafeSyncState } from "@/lib/types";

const kroner = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("nb-NO", { dateStyle: "medium", timeStyle: "short" });

function MemberCard({ member, rank }: { member: NonNullable<Awaited<ReturnType<typeof getSnapshot>>>["members"][number]; rank: number }) {
  return (
    <article className="member-card">
      <div className="member-heading">
        <span className="rank" aria-label={`Plass ${rank}`}>{rank}</span>
        <img className="avatar" src={`/people/${member.imageFilename}`} alt={`Profilbilde av ${member.displayName}`} width="80" height="80" />
        <div>
          <p className="eyebrow">Totalt</p>
          <h2>{member.displayName}</h2>
          <p className="total">{kroner.format(member.totalValue)}</p>
        </div>
      </div>
      <dl className="member-stats">
        <div><dt>Betalt</dt><dd>{kroner.format(member.paidValue)}</dd></div>
        <div><dt>Ubetalt</dt><dd>{kroner.format(member.unpaidValue)}</dd></div>
        <div><dt>Straffer</dt><dd>{member.punishmentCount}</dd></div>
      </dl>
    </article>
  );
}

export default async function Home() {
  await connection();
  let snapshot: PublicSnapshot | null = null;
  let state: SafeSyncState | null = null;
  try {
    [snapshot, state] = await Promise.all([getSnapshot(), getSyncState()]);
    if (state.status !== "authorization_required") snapshot = await loadSnapshotWithFallback(async () => snapshot, () => after(() => synchronize().catch(() => undefined)));
  } catch {
    state = null;
  }
  const status = state?.status === "syncing" ? "Oppdaterer nå" : state?.status === "error" ? "Viser sist lagrede data" : state?.status === "authorization_required" ? "Krever ny tilkobling" : "Oppdatert";
  return (
    <main>
      <header className="site-header">
        <div className="title-lockup">
          {snapshot?.groupImage ? <img className="group-image" src={snapshot.groupImage} alt={`Gruppemerke for ${snapshot.groupName}`} width="72" height="72" /> : <div className="group-mark" aria-hidden="true">M</div>}
          <div><p className="eyebrow">Vinstraff</p><h1>{snapshot?.groupName ?? "mastersal"}</h1></div>
        </div>
        <div className="update-status" role="status"><span className="status-dot" />{status}</div>
      </header>
      <section className="summary" aria-labelledby="summary-title">
        <div><p className="eyebrow">Aktive medlemmer</p><p className="summary-number">{snapshot?.members.length ?? 0}</p></div>
        <div><p className="eyebrow" id="summary-title">Sist oppdatert</p><p className="summary-time">{snapshot ? dateTime.format(new Date(snapshot.synchronizedAt)) : "Venter på første synkronisering"}</p></div>
      </section>
      {snapshot?.members.length ? (
        <section className="member-grid" aria-label="Aktive medlemmer">
          {snapshot.members.map((member, index) => <MemberCard key={member.id} member={member} rank={index + 1} />)}
        </section>
      ) : (
        <section className="empty-state"><p className="eyebrow">Ingen publiserte data</p><h2>Oversikten er snart klar.</h2><p>En administrator må fullføre første synkronisering.</p></section>
      )}
      <footer>Data oppdateres automatisk når oversikten brukes.</footer>
    </main>
  );
}
