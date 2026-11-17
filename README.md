# mastersal

This site shows the unpaid Vinstraff totals for the `mastersal` group.

A React and Vite app renders the page. Vercel functions in `api/` hold the server logic. Upstash Redis stores the encrypted Online tokens. Neon PostgreSQL stores the fallback snapshot and the "first" totals. Online provides OIDC authorization.

## Commands

- `pnpm dev` starts Vite. Vite sends `/api` requests to production. Set `VITE_PORT` to change the port.
- `vercel dev` runs the app and the functions together.
- `pnpm test`, `pnpm typecheck`, `pnpm build`, and `pnpm format` check and format the code.

## Configuration

Copy `.env.example` to `.env.local` in each worktree that needs it, and replace each placeholder. `pnpm dev` does not need it.
Set the same variables for Production in Vercel. The Upstash Redis integration in Vercel sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Generate `TOKEN_ENCRYPTION_KEY` as 32 random bytes in Base64 format.
Apply each file in `migrations/` to the Neon database once.

Register the Online client by hand, because Online rejects dynamic registration. Use the callback URL `https://<production-domain>/api/auth/callback`.

## Synchronization

`/api/snapshot` gets the group from Vinstraff on each request and does not use Neon. The Vercel CDN caches the response for 30 seconds, and the page requests it each 30 seconds. Thus the totals are at most 1 minute old. When the Vinstraff request fails, the endpoint returns the Neon snapshot, and the CDN caches it for 30 minutes. Thus Neon compute can suspend during an outage.

Online access tokens are valid for 10 minutes. Redis keeps the access token until 1 minute before it expires. Online rotates the refresh token at each refresh, so Redis stores each new refresh token.

The Vercel cron calls `/api/cron` each day to write the Neon snapshot.

An `invalid_grant` response deletes the refresh token and stops synchronization. To connect Online again, open `/api/connect`, enter `ADMIN_SETUP_SECRET` as the password, and complete the authorization.

## First place totals

`/first` shows the podium, the bottom three, and the graph of the monthly "first" totals.
Open `/admin` and enter `ADMIN_SETUP_SECRET` to add, change, or delete a month. The session cookie stays valid for one year.
