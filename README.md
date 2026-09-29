# mastersal

This site shows the unpaid Vinstraff totals for the `mastersal` group.

## Architecture

- A React, Vite, TypeScript, and Tailwind CSS app renders the page.
- Vercel functions in `api/` hold the server logic.
- Neon PostgreSQL stores the encrypted refresh token and the public snapshot.
- Online provides OIDC authorization.
- The Vinstraff API provides the group data.

## Commands

- Run `pnpm dev` to start development. Vite sends `/api` requests to production.
- Set `VITE_PORT` to use a port other than `5173`. Set `DEV_WATCH=0` to use file polling.
- Run `pnpm build` to check the types and build the app.
- Run `pnpm typecheck` to check the types.
- Run `pnpm format` to format the files.
- Run `pnpm test` to check the formatting and run the tests.
- Run `vercel dev` to run the app and the functions together.

## Configuration

Copy `.env.example` to `.env.local` and replace each placeholder.
`pnpm dev` does not need `.env.local`.

Git does not copy `.env.local` to a new worktree. Create the file in each worktree that needs it:

```sh
cp .env.example .env.local
```

Then replace each placeholder in the new file.

Set the same variables for Production in Vercel. Generate `TOKEN_ENCRYPTION_KEY` as 32 random bytes in Base64 format.

Apply `migrations/001_initial.sql` to the Neon database once.

Register this callback URL for the Online client:

```text
https://<production-domain>/api/auth/callback
```

## Synchronization

`/api/snapshot` starts a background synchronization when the snapshot is older than five minutes. It returns the previous snapshot during that work.

The Vercel cron calls `/api/cron` each day with `CRON_SECRET`.

An `invalid_grant` response stops synchronization until you connect Online again.

## Connect Online

1. Open `/api/connect`.
2. Enter `ADMIN_SETUP_SECRET` as the password. Use any user name.
3. Complete the Online authorization.

The callback stores the refresh token, synchronizes, and opens the public page.
