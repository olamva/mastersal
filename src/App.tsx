import { useEffect, useState } from "react";
import type { Snapshot } from "../server/members";

export default function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>();

  useEffect(() => {
    fetch("/api/snapshot")
      .then((response) => response.json())
      .then(setSnapshot, () => setSnapshot(null));
  }, []);

  return (
    <main className="relative mx-auto max-w-4xl overflow-hidden px-4 pt-10 pb-6 text-navy">
      <p className="wordart absolute top-4 right-2 rotate-6 font-meny text-3xl font-bold sm:text-4xl">
        GRATIS LEVERING
      </p>
      <div className="flex items-center justify-center gap-4">
        <span className="-rotate-12 text-7xl sm:text-9xl">🍕</span>
        <h1 className="text-center font-wide text-4xl leading-none tracking-[0.15em] sm:text-6xl">
          HUS
          <br />
          DE
          <br />
          <span className="-ml-6 inline-block -rotate-1">
            {(snapshot?.groupName ?? "A4-131").toUpperCase()} &amp; KEBAP
          </span>
        </h1>
        <span className="rotate-20 text-6xl sm:text-8xl">🥙</span>
      </div>
      <p className="mt-2 text-center font-hand text-5xl leading-none">
        ~~~o~o~~~
      </p>
      <p className="mt-2 text-center font-wide text-sm tracking-[0.2em] sm:text-lg">
        GANKE * STRAFF * KEBAB * SKAM * FALAFEL
      </p>
      <div className="mt-8 grid gap-10 sm:grid-cols-[19rem_1fr]">
        <div className="space-y-8 font-meny">
          <div>
            <p className="text-xl font-bold">KEBABVEGEN 1, MASTERSAL</p>
            <p className="wordart text-4xl font-bold">Tel. 384 562 6969</p>
          </div>
          <div className="w-56 -rotate-2 border-4 border-dashed border-navy bg-white px-3 py-2">
            <p className="text-2xl font-bold">SPESIALTILBUD</p>
            <p className="flex items-center gap-2">
              <span className="font-hand text-6xl">20%</span>
              <span className="text-lg font-bold leading-tight whitespace-nowrap">
                KJØP 3<br />
                OG FÅ RABATT
              </span>
            </p>
            <p className="text-[10px]">*gjelder ikke straffer</p>
          </div>
        </div>
        <section>
          <h2 className="flex items-end gap-2">
            <span className="bg-navy px-5 py-0.5 font-meny text-2xl font-bold text-white">
              § SKYLDIG
            </span>
            <span className="-rotate-3 font-hand text-3xl">&amp; DRIKKE</span>
          </h2>
          {snapshot?.members.length ? (
            <ul className="mt-4 space-y-3 font-meny">
              {snapshot.members.map((member) => (
                <li key={member.id}>
                  <details className="group">
                    <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <div className="flex items-end gap-1">
                        <span className="font-bold uppercase">
                          {member.displayName}
                        </span>
                        <span className="mb-1 flex-1 border-b-2 border-dotted border-navy" />
                        {String(member.unpaidValue)
                          .split("")
                          .map((digit, index) => (
                            <span
                              key={index}
                              className="inline-block w-5 bg-white text-center font-bold text-saus"
                            >
                              {digit}
                            </span>
                          ))}
                        <span className="font-bold">,-</span>
                      </div>
                      <p className="text-xs">
                        <span className="inline-block group-open:rotate-90">
                          ▸
                        </span>{" "}
                        {member.punishmentCount} straffer, løk, saus
                      </p>
                    </summary>
                    <ul className="mt-1 ml-4 space-y-1 text-sm">
                      {member.punishments?.map((punishment) => (
                        <li
                          key={punishment.id}
                          className={`flex gap-2 ${punishment.paid ? "line-through opacity-50" : ""}`}
                        >
                          <span className="whitespace-nowrap">
                            {new Date(punishment.createdAt).toLocaleDateString(
                              "nb-NO",
                            )}
                          </span>
                          <span className="flex-1">
                            {punishment.emoji.repeat(punishment.amount)}{" "}
                            {punishment.name}
                            {punishment.reason && (
                              <span className="italic">
                                {" "}
                                – {punishment.reason}
                              </span>
                            )}
                          </span>
                          <span className="font-bold whitespace-nowrap">
                            {punishment.value},-
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            snapshot !== undefined && (
              <p className="mt-4 font-meny">
                Ingen publiserte data ennå. Kokken er på røykepause.
              </p>
            )
          )}
        </section>
      </div>
    </main>
  );
}
