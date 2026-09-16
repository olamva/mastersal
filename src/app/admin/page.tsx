import { cookies } from "next/headers";
import { appEnv } from "@/lib/env";
import { getSyncState, hasOAuthConnection } from "@/lib/db";
import { validateAdminSession } from "@/lib/session";
import Link from "next/link";

const dateTime = new Intl.DateTimeFormat("nb-NO", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminPage() {
  const cookieStore = await cookies();
  const configured = Boolean(process.env.ADMIN_SETUP_SECRET && process.env.DATABASE_URL);
  const authenticated = configured && validateAdminSession(cookieStore.get("mastersal_admin")?.value, appEnv().adminSecret);
  if (!authenticated) return (
    <main className="admin-shell">
      <div className="admin-panel">
        <div><p className="eyebrow">Administrasjon</p><h1>mastersal</h1></div>
        <form method="post" action="/api/admin/login"><label htmlFor="secret">Administrasjonsnøkkel</label><input id="secret" name="secret" type="password" required autoComplete="current-password" /><button type="submit">Åpne administrasjon</button></form>
      </div>
    </main>
  );
  const [connected, state] = await Promise.all([hasOAuthConnection(), getSyncState()]);
  return (
    <main className="admin-shell">
      <header className="site-header"><div><p className="eyebrow">Administrasjon</p><h1>mastersal</h1></div><Link className="button secondary" href="/">Se offentlig side</Link></header>
      <section className="admin-panel">
        <dl className="safe-status">
          <div><dt className="eyebrow">Online</dt><dd>{connected ? "Tilkoblet" : "Ikke tilkoblet"}</dd></div>
          <div><dt className="eyebrow">Status</dt><dd>{state.status}</dd></div>
          <div><dt className="eyebrow">Valgt gruppe</dt><dd>{state.selectedGroupName ?? appEnv().groupName}</dd></div>
          <div><dt className="eyebrow">Sist oppdatert</dt><dd>{state.lastSuccessAt ? dateTime.format(new Date(state.lastSuccessAt)) : "Aldri"}</dd></div>
        </dl>
        <div className="actions">
          <a className="button" href="/api/admin/connect">{connected ? "Koble til på nytt" : "Koble til Online"}</a>
          {connected && <form method="post" action="/api/admin/select"><button className="secondary" type="submit">Velg konfigurert gruppe</button></form>}
          {connected && <form method="post" action="/api/admin/sync"><button type="submit">Start synkronisering</button></form>}
          <form method="post" action="/api/admin/logout"><button className="secondary" type="submit">Logg ut</button></form>
        </div>
        {state.lastErrorCode && <p role="status">Siste feil: {state.lastErrorCode}</p>}
      </section>
    </main>
  );
}
