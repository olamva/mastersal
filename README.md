# mastersal

This site shows the unpaid Vinstraff totals for the `mastersal` group.

A React and Vite app renders the page. Vercel functions in `api/` hold the server logic. Neon PostgreSQL stores the encrypted refresh token and the snapshot. Online provides OIDC authorization.

## Commands

- `pnpm dev` starts Vite. Vite sends `/api` requests to production. Set `VITE_PORT` to change the port.
- `vercel dev` runs the app and the functions together.
- `pnpm test`, `pnpm typecheck`, `pnpm build`, and `pnpm format` check and format the code.

## Configuration

Copy `.env.example` to `.env.local` in each worktree that needs it, and replace each placeholder. `pnpm dev` does not need it.
Set the same variables for Production in Vercel. Generate `TOKEN_ENCRYPTION_KEY` as 32 random bytes in Base64 format.
Apply each file in `migrations/` to the Neon database once.

Register the Online client by hand, because Online rejects dynamic registration. Use the callback URL `https://<production-domain>/api/auth/callback`.

## Synchronization

`/api/snapshot` synchronizes on each visit. It returns the stored snapshot when the synchronization fails. The Vercel cron calls `/api/cron` each day.

An `invalid_grant` response stops synchronization. To connect Online again, open `/api/connect`, enter `ADMIN_SETUP_SECRET` as the password, and complete the authorization.

## First place totals

`/first` shows the podium, the bottom three, and the graph of the monthly "first" totals.
Open `/admin` and enter `ADMIN_SETUP_SECRET` to add, change, or delete a month. The session cookie stays valid for one year.
