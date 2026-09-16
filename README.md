# mastersal

This site publishes a safe Vinstraff summary for the `mastersal` group.

## Architecture

- Next.js uses the App Router and TypeScript.
- Tailwind CSS provides the base styling system.
- Neon PostgreSQL stores OAuth state, encrypted refresh tokens, synchronization state, and the public snapshot.
- Vercel runs the application and its protected cron route.
- Online provides OIDC authorization.
- The Vinstraff API provides group data.

The browser receives public snapshot fields only. The server never sends OAuth tokens to the browser.

## Local setup

1. Install Node.js 22 or newer.
2. Install pnpm.
3. Run `pnpm install`.
4. Copy `.env.example` to `.env.local`.
5. Replace each placeholder through your local secret manager.
6. Run `pnpm db:migrate`.
7. Run `pnpm dev`.

Use HTTPS for local administrator and OAuth tests. Secure cookies do not work through plain HTTP.

## Commands

- Run `pnpm dev` to start development.
- Run `pnpm build` to create a production build.
- Run `pnpm test` to run the tests.
- Run `pnpm lint` to run ESLint.
- Run `pnpm typecheck` to check TypeScript.
- Run `pnpm db:migrate` to apply the database schema.
- Run `pnpm sync` to call the protected synchronization route.

Set `SYNC_URL` for `pnpm sync` outside Vercel. Use the public site origin as its value.

## Online OAuth registration

Create one dedicated confidential Online OIDC client. Use the authorization-code flow and PKCE S256.

Set the callback to this exact URL:

```text
https://<production-domain>/api/auth/callback
```

Enable these scopes:

```text
openid profile email offline_access
```

Store the client identifier and secret in Vercel. Do not store them in Git.

## Vercel configuration

Connect the public GitHub repository to Vercel. Enable automatic production deployments from `main`.

Set these server-only variables for Production:

```text
ONLINE_OIDC_ISSUER
ONLINE_CLIENT_ID
ONLINE_CLIENT_SECRET
TOKEN_ENCRYPTION_KEY
ADMIN_SETUP_SECRET
CRON_SECRET
DATABASE_URL
VINSTRAFF_API_URL
VINSTRAFF_GROUP_NAME
```

Set `ONLINE_OIDC_ISSUER` to `https://auth.online.ntnu.no/`.
Set `VINSTRAFF_API_URL` to `https://api.vinstraff.no`.
Set `VINSTRAFF_GROUP_NAME` to `mastersal`.

Generate `TOKEN_ENCRYPTION_KEY` as 32 random bytes in Base64 format. Generate long random values for both administrator and cron secrets.

Vercel Hobby supports one scheduled cron run each day. The configured schedule uses that free limit.

## Neon configuration

Create a free Neon PostgreSQL project. Connect it to the Vercel project through the Neon integration.

Confirm that the integration sets `DATABASE_URL` for Production. Run `pnpm db:migrate` with that connection before authorization.

## Pictures

Store member pictures in `public/people`.

Use the stable member identifier as the preferred filename. For example, use `member-id.webp`.

Use a normalized display name as the second choice. Convert the name to lowercase ASCII. Replace separator characters with one hyphen.

Supported member picture extensions are `.webp`, `.png`, `.jpg`, `.jpeg`, and `.avif`.

The build generates `src/generated/image-manifest.ts`. Missing pictures use `public/people/default.svg`.

## Synchronization

The Vercel cron route requires `CRON_SECRET`. The administrator route uses a secure administrator session.

The public page starts a background synchronization when the stored snapshot exceeds five minutes. It serves the previous snapshot during that work.

PostgreSQL advisory locks prevent concurrent refresh and synchronization work. Temporary API failures keep the last valid snapshot.

The server keeps access tokens in memory only. It refreshes them before expiry. It encrypts each refresh token with AES-256-GCM.

Refresh-token rotation updates the encrypted token inside one database transaction. An `invalid_grant` response requires administrator authorization again.

## Recovery

Open `/admin` after an authorization failure. Enter the administrator secret. Select **Koble til på nytt**.

Complete Online authorization. Select the configured group. Start a manual synchronization.

Check `/api/health` for safe application, database, OAuth, and snapshot status.

## Secret rotation

Rotate `ADMIN_SETUP_SECRET` and `CRON_SECRET` directly in Vercel. Redeploy the application after each change.

Rotate `ONLINE_CLIENT_SECRET` in Online and Vercel together. Redeploy before the old secret expires.

Rotate `TOKEN_ENCRYPTION_KEY` only with a controlled refresh-token migration. Otherwise, reconnect Online after replacement.

## Privacy

The public snapshot stores only the stable member identifier, display name, totals, count, image filename, and active status.

The snapshot excludes email addresses, permissions, invite codes, private reasons, OAuth profiles, and private API responses.

The database stores no access token. The administrator area never displays tokens.

## Deployment

1. Run all local validation commands.
2. Push `main` to the public GitHub repository.
3. Import the repository into Vercel.
4. Connect the free Neon database.
5. Deploy the initial production version.
6. Register the stable callback URL in Online.
7. Set the OAuth values in Vercel.
8. Redeploy.
9. Open `/admin` and complete authorization.
10. Select `mastersal` and start synchronization.
11. Verify the public page and `/api/health`.
