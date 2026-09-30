import type { CSSProperties } from "react";
import { days, standings, type FirstMonth } from "../server/first";
import { Sparkles } from "./Effects";
import { FirstChart } from "./FirstChart";

const crowns = ["👑", "💎", "🎀"];
const orders = ["order-2", "order-1", "order-3"];
const heights = ["pb-24", "pb-14", "pb-6"];

interface NinaFirstPageProps {
  months?: FirstMonth[];
  rotting: boolean;
}

export const NinaFirstPage = ({ months, rotting }: NinaFirstPageProps) => {
  const rows = standings(months ?? []);

  return (
    <>
      <Sparkles />
      <main
        className={`relative mx-auto max-w-5xl px-4 pt-6 pb-10 text-plum ${rotting ? "rotting" : ""}`}
      >
        <a href="/" className="font-script text-xl underline">
          ← Drømmesalen
        </a>
        <header className="enter text-center">
          <p className="font-wide text-xs tracking-[0.4em] sm:text-sm">
            MASTERSAL A4-131 PRESENTERER
          </p>
          <h1 className="barbie-logo -rotate-3 text-[clamp(3rem,11vw,7rem)] leading-tight">
            Først på salen
          </h1>
          <p className="mt-8 font-meny text-xl italic">
            der den tidligste får kronen
          </p>
        </header>
        {months?.length ? (
          <>
            <ol className="mt-12 flex items-end justify-center gap-3">
              {rows.slice(0, 3).map(({ name, total, rank }, index) => (
                <li
                  key={name}
                  className={`enter w-1/3 max-w-60 rounded-t-[3rem] rounded-b-3xl bg-linear-to-b from-[#ff6fb8] to-barbie p-2 shadow-[0_16px_32px_-12px_var(--color-plum)] sm:p-3 ${orders[index]}`}
                  style={{ "--i": index + 1 } as CSSProperties}
                >
                  <p className="text-center font-script text-2xl leading-snug text-white drop-shadow-[0_3px_0_var(--color-plum)] sm:text-4xl">
                    {name.split(" ")[0]}
                  </p>
                  <div
                    className={`mt-1 rounded-t-full border-4 border-white bg-[radial-gradient(circle_at_50%_35%,#fff,var(--color-blush)_75%)] px-2 pt-8 text-center ${heights[rank - 1]}`}
                  >
                    <p className="text-4xl sm:text-5xl">{crowns[rank - 1]}</p>
                    <p className="font-wide text-[10px] tracking-[0.3em]">
                      {rank}. PLASS
                    </p>
                    <p className="glitter font-wide text-4xl sm:text-6xl">
                      {total}
                    </p>
                    <p className="font-meny italic">
                      {days(total).split(" ")[1]} først
                    </p>
                  </div>
                  <p className="mt-2 truncate px-2 text-center font-wide text-[10px] tracking-widest text-white">
                    {name.toUpperCase()}
                  </p>
                </li>
              ))}
            </ol>
            {rows.length > 3 && (
              <ol className="mx-auto mt-10 max-w-2xl space-y-3">
                {rows
                  .slice(3)
                  .slice(-3)
                  .map(({ name, total, rank }, index) => (
                    <li
                      key={name}
                      className="enter flex items-center gap-3 rounded-full bg-white/80 px-6 py-2 shadow-[0_8px_24px_-8px_var(--color-barbie)]"
                      style={{ "--i": index + 4 } as CSSProperties}
                    >
                      <span className="font-wide text-sm">{rank}.</span>
                      <span className="flex-1 truncate font-meny text-lg">
                        {name}
                      </span>
                      <span className="font-script text-2xl text-barbie">
                        {days(total)}
                      </span>
                    </li>
                  ))}
              </ol>
            )}
            <div className="enter mt-10" style={{ "--i": 7 } as CSSProperties}>
              <FirstChart
                months={months}
                className="rounded-3xl shadow-[0_16px_32px_-12px_var(--color-plum)] sm:p-5"
              />
            </div>
          </>
        ) : (
          months && (
            <p className="mt-14 text-center font-meny text-xl italic">
              Ingen resultater ennå. Barbie sover.
            </p>
          )
        )}
        <p className="mt-10 text-right font-meny text-xs">
          <a href="/admin" className="underline">
            admin
          </a>
        </p>
      </main>
    </>
  );
};
