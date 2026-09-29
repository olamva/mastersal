# mastersal deployment

## Goal

Create and publish the public mastersal Vinstraff website with secure Online OAuth, Neon storage, and Vercel deployment.

## Established facts

<!-- append-only. each line cost time to learn. -->

- The generated current stable stack uses Next.js 16.3.5, React 19.2.8, Tailwind CSS 4.3.3, and pnpm 11.12.0.
- Online publishes OIDC discovery at `https://auth.online.ntnu.no/.well-known/openid-configuration`.
- Online supports authorization code, refresh tokens, PKCE S256, and the requested scopes.
- The Vinstraff API exposes authenticated group records through `/groups/{group_id}`.
- The Vinstraff API exposes group discovery through `/groups/search` and `/groups/me`.
- Vercel Hobby permits only one cron invocation each day as of 2026-01-28.
- Five-minute freshness therefore needs request-triggered synchronization on the free plan.
- The production package manager uses pnpm 11.27.0 because Vercel rejects pnpm 11.12.0.
- The public GitHub repository is `https://github.com/olamva/mastersal`.
- The stable production URL is `https://mastersal.vercel.app`.
- Vercel connected the free Neon resource `neon-crimson-cable` to the project.
- The initial production deployment succeeded on 2026-09-17.
- Online rejects confidential dynamic client registration with HTTP 400.
- Online manages production OAuth clients through Terraform in `dotkom/monoweb`.
- The OAuth provisioning request is `https://github.com/dotkom/monoweb/issues/3719`.
- The Doppler project has the configs `dev`, `dev_personal`, `stg`, and `prd`.
- Doppler config `stg` contains only the `DOPPLER_*` default names on 2026-09-29.
- Doppler config `dev` holds `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_ISSUER`, `AUTH0_AUDIENCES`, and `AUTH0_MGMT_TENANT`.
- The `dev` client uses the development tenant `https://auth.dev.online.ntnu.no/`, not the production issuer.
- The `dev` client secret authenticates, but the client does not allow `client_credentials`.
- The `dev` client allows only `http://localhost:3000/api/auth/callback` among the tested callbacks.
- The `dev` client rejects `https://mastersal.vercel.app/api/auth/callback` with HTTP 403.
- Production Vinstraff at `vinstraff.no` uses the production issuer `https://auth.online.ntnu.no`.
- Vinstraff has no reachable development API host.
- Doppler config `prd` holds the same `AUTH0_*` names with issuer `https://auth.online.ntnu.no`.
- The `prd` client accepts `https://mastersal.vercel.app/api/auth/callback` and `http://localhost:3000/api/auth/callback`.
- Vercel Production received `ONLINE_CLIENT_ID` and `ONLINE_CLIENT_SECRET` from Doppler `prd` on 2026-09-29.
- `ADMIN_SETUP_SECRET` was rotated on 2026-09-29; Doppler `prd` holds the current value.
- The production deployment of 2026-09-29 reports database `ok` and OAuth `authorization_required`.
- Vinstraff accepts access tokens from the `prd` client; the first successful synchronization ran on 2026-09-29.
- The Vinstraff group with short name `MASTERSAL` has ID `487db212-6c4f-4f7b-a616-563d5ee419cb`.
- `/groups/me` returns groups with empty `members`; only `/groups/{id}` includes members and punishments.
- A visit starts a background synchronization only after five minutes; that visit still gets the old snapshot.
- Doppler names the client values `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET`; the app reads `ONLINE_*`.
- Since 2026-09-29, each visit synchronizes before the response; a failed synchronization returns the stored snapshot.
- `mastersal-scaffold` is the unchanged `create-next-app` output from 2026-09-16.

## Open decisions

<!-- questions for the user. ask these before building, not after. -->

## Dead ends

<!-- what was tried and did not work, and why. stops rediscovery. -->

- Vercel CLI Git connection fails for `olamva/mastersal` despite local GitHub access.
- Online client creation now waits for the Online maintainers.
