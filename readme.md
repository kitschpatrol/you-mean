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

```sh
pnpm run deploy
```

The service deploys as a single Cloudflare Worker, bundled directly from `src/worker.ts` — there's no build step or output directory.

Rather than hosting anything on a `workers.dev` subdomain, the worker is attached to the `frontiernerds.com` zone via a route defined in `wrangler.jsonc`:

```jsonc
{
  "routes": ["frontiernerds.com/api/you-mean"],
}
```

The pattern has no wildcard, so it matches the `/api/you-mean` path exactly (query strings are ignored during route matching). Requests to any other path — including `/api/you-mean/anything` — pass through Cloudflare to the origin server that hosts the rest of the site. This makes the worker a small API "sidecar" on the main domain: same-origin with the site's pages, with no separate hostname to manage.

Deploying requires Cloudflare credentials for the account that owns the `frontiernerds.com` zone, and the zone's DNS record must be proxied (orange cloud) for the route to take effect. Wrangler resolves the zone from the route's hostname at deploy time.
