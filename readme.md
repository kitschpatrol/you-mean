<!-- title -->

# you-mean

<!-- /title -->

<!-- badges -->

[![CI](https://github.com/kitschpatrol/you-mean/actions/workflows/ci.yml/badge.svg)](https://github.com/kitschpatrol/you-mean/actions/workflows/ci.yml)

<!-- /badges -->

<!-- description -->

**Imagine text through Google search suggestions.**

<!-- /description -->

## Overview

This is a service which generates text through Google Search's auto-complete algorithm. It was created in 2010.

It's implemented in TypeScript, and is exposed through a simple API service deployed on Cloudflare Workers. The service was ported from its original Python implementation (saved in `/archive`) in March 2022, and migrated from Netlify Functions to Cloudflare Workers in July 2026.

It's referenced on Frontier Nerds at the following URLs:

- <https://frontiernerds.com/you-mean>
- <https://frontiernerds.com/projects/you-mean>

## Usage

### As a Node library

```ts
import { suggestify } from './src/main'

const transformedText = await suggestify('what do i really mean?')

console.log(transformedText)
```

### Via web API

Request

```sh
curl -s "https://frontiernerds.com/api/you-mean?text=what%20hath%20god%20wrought" | jq
```

Response:

```json
{
  "status": "success",
  "youSaid": "what hath god wrought",
  "youMeant": "what hath god wrought meaning"
}
```

## Development

### Setup

```sh
pnpm i
```

### Testing

```sh
pnpm test
```

### Local development

```sh
pnpm dev
```

### Deployment

The service can deploy to either Cloudflare Workers or Netlify Functions. Both serve the same API at the `/api/you-mean` path, backed by the shared logic in `src/main.ts`.

Note that Google blocks requests from Cloudflare's egress IPs to the suggestion endpoint (intermittent `403 Forbidden` responses from `suggestqueries.google.com`), so Netlify is the target that actually works in production. The Cloudflare deployment is retained in case the situation changes.

#### Netlify

```sh
pnpm run deploy-netlify
```

The function in `netlify/functions/you-mean.ts` uses the modern Netlify Functions API (web-standard `Request`/`Response`), with its route declared via `export const config = { path: '/api/you-mean' }` — no redirects needed in `netlify.toml`. The `_site` directory is published as a static placeholder site.

Deploying requires Netlify credentials (`netlify login`) and a linked site (`netlify link` on first run). Local development: `pnpm run dev-netlify`.

#### Cloudflare

```sh
pnpm run deploy-cloudflare
```

The service deploys as a single Cloudflare Worker, bundled directly from `src/worker.ts` — there's no build step or output directory.

Rather than hosting anything on a `workers.dev` subdomain, the worker is attached to the `frontiernerds.com/api/you-mean*` route in `wrangler.jsonc`.

Deploying requires Cloudflare credentials for the account that owns the `frontiernerds.com` zone, and the zone's DNS record must be proxied (orange cloud) for the route to take effect. Wrangler resolves the zone from the route's hostname at deploy time. Local development: `pnpm run dev`.
