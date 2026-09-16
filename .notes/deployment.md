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

## Open decisions

<!-- questions for the user. ask these before building, not after. -->

## Dead ends

<!-- what was tried and did not work, and why. stops rediscovery. -->
