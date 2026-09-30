import { useEffect, useState, type FormEvent } from "react";
import { monthName, type FirstMonth } from "../server/first";
import type { Snapshot } from "../server/members";

const now = new Date();
const previousMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1))
  .toISOString()
  .slice(0, 7);

const field = "border-2 border-navy bg-white px-2 py-1";
const button = "cursor-pointer bg-navy px-4 py-1 font-bold text-white";

export const AdminPage = () => {
  const [admin, setAdmin] = useState<boolean>();
  const [failed, setFailed] = useState(false);
  const [months, setMonths] = useState<FirstMonth[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [month, setMonth] = useState(previousMonth);
  const existing = months.find((entry) => entry.month === month);
  const names = [
    ...new Set([
      ...members,
      ...months.flatMap(({ counts }) => Object.keys(counts)),
    ]),
  ].sort((left, right) => left.localeCompare(right, "nb"));

  const load = () =>
    fetch("/api/first")
      .then((response) => (response.ok ? response.json() : []))
      .then(setMonths);

  const send = async (path: string, init: RequestInit) => {
    const { status } = await fetch(path, init);
    if (status === 401) setAdmin(false);
    await load();
  };

  useEffect(() => {
    fetch("/api/admin").then(({ ok }) => setAdmin(ok));
    fetch("/api/snapshot")
      .then((response) => response.json())
      .then((snapshot: Snapshot | null) =>
        setMembers(snapshot?.members.map((member) => member.displayName) ?? []),
      );
    load();
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { ok } = await fetch("/api/admin", {
      method: "POST",
      body: JSON.stringify({
        secret: new FormData(event.currentTarget).get("secret"),
      }),
    });
    setAdmin(ok);
    setFailed(!ok);
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    send("/api/first", {
      method: "PUT",
      body: JSON.stringify({
        month,
        counts: Object.fromEntries(
          names.map((name) => [name, Number(form.get(name))]),
        ),
      }),
    });
  };

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-kebab" />
      <main className="mx-auto max-w-xl px-4 pt-6 pb-6 font-meny text-navy">
        <a href="/first" className="font-bold underline">
          ← FØRST PÅ SALEN
        </a>
        <h1 className="mt-4 font-wide text-4xl tracking-[0.15em]">ADMIN</h1>
        {admin === false && (
          <form onSubmit={login} className="mt-6 flex flex-col gap-2">
            <label htmlFor="secret" className="font-bold">
              Administrasjonsnøkkel
            </label>
            <input
              id="secret"
              name="secret"
              type="password"
              required
              autoComplete="current-password"
              className={field}
            />
            <button className={`${button} self-start`}>Logg inn</button>
            {failed && <p role="alert">Feil administrasjonsnøkkel.</p>}
          </form>
        )}
        {admin && (
          <>
            <form onSubmit={save} className="mt-6 flex flex-col gap-2">
              <label className="flex items-center justify-between gap-2 font-bold">
                Måned
                <input
                  type="month"
                  required
                  pattern="\d{4}-(0[1-9]|1[0-2])"
                  placeholder="ÅÅÅÅ-MM"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  className={field}
                />
              </label>
              <div
                key={`${month}${Boolean(existing)}`}
                className="flex flex-col gap-2"
              >
                {names.map((name) => (
                  <label
                    key={name}
                    className="flex items-center justify-between gap-2"
                  >
                    {name}
                    <input
                      name={name}
                      type="number"
                      min={0}
                      max={31}
                      inputMode="numeric"
                      placeholder="0"
                      defaultValue={existing?.counts[name]}
                      className={`${field} w-20 text-right`}
                    />
                  </label>
                ))}
              </div>
              <button className={`${button} self-end`}>
                {existing ? "Oppdater" : "Lagre"}
              </button>
            </form>
            <ul className="mt-10 space-y-3">
              {[...months].reverse().map((entry) => (
                <li key={entry.month} className="flex items-end gap-2">
                  <span className="font-bold uppercase">
                    {monthName(entry.month)}
                  </span>
                  <span className="mb-1 flex-1 border-b-2 border-dotted border-navy" />
                  <button
                    className="cursor-pointer underline"
                    onClick={() => setMonth(entry.month)}
                  >
                    Rediger
                  </button>
                  <button
                    className="cursor-pointer text-saus underline"
                    onClick={() =>
                      confirm(`Slette ${monthName(entry.month)}?`) &&
                      send(`/api/first?month=${entry.month}`, {
                        method: "DELETE",
                      })
                    }
                  >
                    Slett
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
};
