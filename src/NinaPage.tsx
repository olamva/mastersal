import type { CSSProperties } from "react";
import type { Snapshot } from "../server/members";
import { Sparkles } from "./Effects";

interface NinaPageProps {
  snapshot?: Snapshot | null;
  rotting: boolean;
}

const Bibble = () => (
  <span className="relative shrink-0">
    <svg
      viewBox="0 0 100 100"
      className="bibble w-20 sm:w-28"
      role="img"
      aria-label="Bibble"
    >
      <defs>
        <filter id="bibble-fluff" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves="2"
          />
          <feDisplacementMap in="SourceGraphic" scale="8" />
        </filter>
        <radialGradient id="bibble-fur" cx="40%" cy="35%">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.65" stopColor="#fdf0ff" />
          <stop offset="1" stopColor="#e6c3f4" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="88" rx="7" ry="4" fill="#f7a8d0" />
      <ellipse cx="60" cy="88" rx="7" ry="4" fill="#f7a8d0" />
      <g filter="url(#bibble-fluff)" fill="url(#bibble-fur)">
        <circle cx="50" cy="52" r="36" />
        <path d="M42 22q-2-12 7-7 3-9 8-1 9-3 3 8z" />
      </g>
      {[37, 63].map((cx) => (
        <g key={cx}>
          <ellipse
            cx={cx}
            cy="47"
            rx="10"
            ry="13"
            fill="#fff"
            stroke="#d6b4e6"
          />
          <circle cx={cx + 1} cy="50" r="7.5" fill="#5ab4f5" />
          <circle cx={cx + 1} cy="51" r="4" fill="#1d2340" />
          <circle cx={cx + 3.5} cy="46.5" r="2.2" fill="#fff" />
        </g>
      ))}
      <ellipse cx="25" cy="63" rx="6" ry="3.5" fill="#ff9fcf" opacity="0.7" />
      <ellipse cx="75" cy="63" rx="6" ry="3.5" fill="#ff9fcf" opacity="0.7" />
      <path
        d="M45 67q5 5 10 0"
        fill="none"
        stroke="#a3406f"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <span className="absolute -top-4 -right-2 rotate-12 rounded-full bg-white px-2 font-script text-sm text-barbie shadow">
      bibble!
    </span>
  </span>
);

export const NinaPage = ({ snapshot, rotting }: NinaPageProps) => {
  const group = snapshot?.groupName ?? "A4-131";

  return (
    <>
      <Sparkles />
      <main
        className={`relative mx-auto max-w-5xl px-4 pt-10 pb-16 text-plum ${rotting ? "rotting" : ""}`}
      >
        <header className="enter text-center">
          <p className="font-wide text-xs tracking-[0.4em] sm:text-sm">
            MASTERSAL {group.toUpperCase()} PRESENTERER
          </p>
          <h1 className="barbie-logo -rotate-3 text-[clamp(3.5rem,13vw,8rem)] leading-tight">
            Drømmehuset
          </h1>
          <p className="font-meny text-xl italic">der alle skylder vin</p>
          <div className="mt-6 flex items-center justify-center gap-3 sm:gap-6">
            <span className="-rotate-12 text-5xl -hue-rotate-30 sm:text-7xl">
              👠
            </span>
            <p className="rounded-full bg-white/80 px-6 py-2 shadow-[0_8px_24px_-8px_var(--color-barbie)]">
              <span className="block font-wide text-[10px] tracking-[0.3em]">
                TOTALT SKYLDIG
              </span>
              <span className="font-script text-4xl text-barbie">
                {snapshot?.members.reduce(
                  (sum, member) => sum + member.unpaidValue,
                  0,
                ) ?? 0}
                ,-
              </span>
            </p>
            <Bibble />
          </div>
        </header>
        {snapshot?.members.length ? (
          <ul className="mt-14 grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {snapshot.members.map((member, index) => (
              <li
                key={member.id}
                className="enter"
                style={{ "--i": index + 1 } as CSSProperties}
              >
                <details className="group rounded-t-[3rem] rounded-b-3xl bg-linear-to-b from-[#ff6fb8] to-barbie p-3 shadow-[0_16px_32px_-12px_var(--color-plum)] transition hover:-translate-y-1 hover:rotate-1">
                  <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <p className="text-center font-script text-4xl leading-snug text-white drop-shadow-[0_3px_0_var(--color-plum)]">
                      {member.displayName.split(" ")[0]}
                    </p>
                    <div className="mt-1 rounded-t-full border-4 border-white bg-[radial-gradient(circle_at_50%_35%,#fff,var(--color-blush)_75%)] px-4 pt-12 pb-6 text-center">
                      <p className="font-wide text-[10px] tracking-[0.3em]">
                        DENNE BARBIEN SKYLDER
                      </p>
                      <p className="glitter font-wide text-6xl">
                        {member.unpaidValue},-
                      </p>
                      <p className="font-meny italic">
                        {member.punishmentCount}{" "}
                        {member.punishmentCount === 1 ? "straff" : "straffer"}
                      </p>
                    </div>
                    <p className="mt-2 flex items-center justify-between gap-2 px-2 font-wide text-[10px] tracking-widest text-white">
                      <span className="truncate">
                        {member.displayName.toUpperCase()}
                      </span>
                      <span className="whitespace-nowrap">
                        TILBEHØR{" "}
                        <span className="inline-block transition group-open:rotate-90">
                          ▸
                        </span>
                      </span>
                    </p>
                  </summary>
                  <ul className="mt-3 space-y-2 rounded-2xl bg-white/90 p-3 font-meny text-sm">
                    {member.punishments?.map((punishment) => (
                      <li
                        key={punishment.id}
                        className={`flex gap-2 ${punishment.paid ? "line-through opacity-50" : ""}`}
                      >
                        <span>
                          {punishment.emoji.repeat(punishment.amount)}
                        </span>
                        <span className="flex-1">
                          <span className="font-bold">{punishment.name}</span>
                          {punishment.reason && (
                            <span className="italic">
                              {" "}
                              – {punishment.reason}
                            </span>
                          )}
                          <span className="block text-xs opacity-70">
                            {new Date(punishment.createdAt).toLocaleDateString(
                              "nb-NO",
                            )}
                          </span>
                        </span>
                        <span className="font-bold whitespace-nowrap text-barbie">
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
            <p className="mt-14 text-center font-meny text-xl italic">
              Ingen publiserte data ennå. Barbie er på stranden.
            </p>
          )
        )}
        <p className="mt-16 text-center font-script text-2xl">
          Hi Barbie! Hi Ken! Hi {group}!
        </p>
      </main>
    </>
  );
};
