import { useEffect, useState } from "react";
import type { Snapshot } from "../server/members";

const kroner = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 });

export default function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>();

  useEffect(() => {
    fetch("/api/snapshot").then((response) => response.json()).then(setSnapshot, () => setSnapshot(null));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-stone-900 dark:text-stone-100">
      <h1 className="text-5xl font-bold tracking-tight">{snapshot?.groupName ?? "mastersal"}</h1>
      {snapshot?.members.length ? (
        <table className="mt-8 w-full tabular-nums">
          <thead className="text-sm text-stone-500">
            <tr><th className="p-2 text-left font-medium">Navn</th><th className="p-2 text-right font-medium">Skyldig</th><th className="p-2 text-right font-medium">Straffer</th></tr>
          </thead>
          <tbody>
            {snapshot.members.map((member) => (
              <tr key={member.id} className="border-t border-stone-200 dark:border-stone-800">
                <td className="p-2">{member.displayName}</td>
                <td className="p-2 text-right font-semibold text-rose-700 dark:text-rose-400">{kroner.format(member.unpaidValue)}</td>
                <td className="p-2 text-right">{member.punishmentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : snapshot !== undefined && <p className="mt-8 text-stone-500">Ingen publiserte data ennå.</p>}
    </main>
  );
}
