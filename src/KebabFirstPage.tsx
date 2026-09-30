import { days, standings, type FirstMonth } from "../server/first";
import { FirstChart } from "./FirstChart";

const medals = ["🥇", "🥈", "🥉"];
const orders = ["order-2", "order-1", "order-3"];
const heights = ["h-40", "h-28", "h-20"];

interface HeadingProps {
  title: string;
  note: string;
}

const Heading = ({ title, note }: HeadingProps) => (
  <h2 className="mt-12 flex items-end gap-2">
    <span className="bg-navy px-5 py-0.5 font-meny text-2xl font-bold text-white">
      § {title}
    </span>
    <span className="-rotate-3 font-hand text-3xl">{note}</span>
  </h2>
);

interface KebabFirstPageProps {
  months?: FirstMonth[];
}

export const KebabFirstPage = ({ months }: KebabFirstPageProps) => {
  const rows = standings(months ?? []);

  return (
    <main className="mx-auto max-w-4xl px-4 pt-6 pb-6 text-navy">
      <a href="/" className="font-meny font-bold underline">
        ← MENY
      </a>
      <div className="mt-4 flex items-center justify-center gap-4">
        <span className="-rotate-12 text-6xl sm:text-8xl">🏆</span>
        <h1 className="text-center font-wide text-4xl leading-none tracking-[0.15em] sm:text-6xl">
          FØRST
          <br />
          PÅ SALEN
        </h1>
        <span className="rotate-12 text-6xl sm:text-8xl">⏰</span>
      </div>
      <p className="mt-2 text-center font-wide text-sm tracking-[0.2em] sm:text-lg">
        FERSKEST * TIDLIGST * TRØTTEST
      </p>
      {months?.length ? (
        <>
          <Heading title="PALLEN" note="& heder" />
          <ol className="mt-6 flex items-end justify-center gap-2 font-meny">
            {rows.slice(0, 3).map(({ name, total, rank }, index) => (
              <li
                key={name}
                className={`flex w-1/3 max-w-48 flex-col items-center ${orders[index]}`}
              >
                <span className="text-5xl">{medals[rank - 1]}</span>
                <span className="text-center leading-tight font-bold uppercase">
                  {name}
                </span>
                <div
                  className={`mt-2 flex w-full flex-col items-center gap-1 bg-navy pt-2 text-white ${heights[rank - 1]}`}
                >
                  <span className="font-wide text-4xl">{rank}</span>
                  <span className="bg-white px-2 font-bold whitespace-nowrap text-saus">
                    {days(total)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
          {rows.length > 3 && (
            <>
              <Heading title="BUNNSKRAPET" note="& skam" />
              <ol className="mt-4 space-y-3 font-meny">
                {rows
                  .slice(3)
                  .slice(-3)
                  .map(({ name, total, rank }) => (
                    <li key={name} className="flex items-end gap-1">
                      <span className="font-bold uppercase">
                        {rank}. {name}
                      </span>
                      <span className="mb-1 flex-1 border-b-2 border-dotted border-navy" />
                      <span className="bg-white px-2 font-bold text-saus">
                        {days(total)}
                      </span>
                    </li>
                  ))}
              </ol>
            </>
          )}
          <Heading title="UTVIKLING" note="& statistikk" />
          <div className="mt-4">
            <FirstChart
              months={months}
              className="border-4 border-dashed border-navy"
            />
          </div>
        </>
      ) : (
        months && (
          <p className="mt-10 text-center font-meny">
            Ingen resultater ennå. Alle sover.
          </p>
        )
      )}
      <p className="mt-10 text-right font-meny text-xs">
        <a href="/admin" className="underline">
          admin
        </a>
      </p>
    </main>
  );
};
