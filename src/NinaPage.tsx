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
            baseFrequency="0.8"
            numOctaves="2"
          />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
        <radialGradient id="bibble-fur" cx="45%" cy="30%">
          <stop offset="0" stopColor="#c4e6f7" />
          <stop offset="0.6" stopColor="#8cc6ec" />
          <stop offset="1" stopColor="#5a8fd6" />
        </radialGradient>
        <radialGradient id="bibble-hair" cx="40%" cy="30%">
          <stop offset="0" stopColor="#ff8fd0" />
          <stop offset="1" stopColor="#e0269a" />
        </radialGradient>
      </defs>
      <g fill="#f47cc0">
        <ellipse cx="41" cy="95" rx="6" ry="3" />
        <ellipse cx="59" cy="95" rx="6" ry="3" />
      </g>
      <g filter="url(#bibble-fluff)">
        <g fill="url(#bibble-fur)">
          <path d="M27 42l-7-2 6-4zM73 42l7-2-6-4z" />
          <path d="M30 55q-6 18 0 32 8 8 20 8t20-8q6-14 0-32z" />
          <path d="M29 74q-8 2-9 8 5 1 10-3M71 74q8 2 9 8-5 1-10-3" />
          <ellipse cx="50" cy="44" rx="25" ry="21" />
        </g>
        <g fill="#f47cc0" opacity="0.85">
          <circle cx="43" cy="72" r="4" />
          <circle cx="57" cy="78" r="3.5" />
          <circle cx="46" cy="86" r="3" />
          <circle cx="61" cy="68" r="2.5" />
        </g>
        <path
          d="M30 30q-6-10 0-18 2 6 6 7-2-10 6-16 0 8 4 10 2-10 12-11-4 6-2 11 6-6 16-4-6 4-6 9 8-2 12 4-7 0-9 5 5 3 4 9-6-6-14-7-10 0-15 3-8 2-14 5z"
          fill="url(#bibble-hair)"
        />
      </g>
      {[40, 60].map((cx) => (
        <g key={cx} stroke="#1d2340" strokeWidth="1">
          <ellipse cx={cx} cy="44" rx="7.5" ry="8.5" fill="#fff" />
          <circle
            cx={cx + (50 - cx) / 7}
            cy="46"
            r="5"
            fill="#4b5fd1"
            stroke="none"
          />
          <circle
            cx={cx + (50 - cx) / 7}
            cy="46.5"
            r="2.6"
            fill="#141633"
            stroke="none"
          />
          <circle
            cx={cx + (50 - cx) / 7 + 1.5}
            cy="44.5"
            r="1.2"
            fill="#fff"
            stroke="none"
          />
          <path d={`M${cx - 8} 44q0-9 8-9t8 9q-8-4-16 0z`} fill="#8cc6ec" />
        </g>
      ))}
      <path
        d="M33 40l-3-2M34 38l-2-3M66 40l3-2M65 38l2-3"
        stroke="#1d2340"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <ellipse cx="50" cy="53" rx="2.6" ry="2" fill="#ff6fb3" />
      <path
        d="M43 58q7 5 14 0"
        fill="#fff"
        stroke="#1d2340"
        strokeWidth="1.1"
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
