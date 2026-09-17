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

## Open decisions

<!-- questions for the user. ask these before building, not after. -->

## Dead ends

<!-- what was tried and did not work, and why. stops rediscovery. -->

- Vercel CLI Git connection fails for `olamva/mastersal` despite local GitHub access.
