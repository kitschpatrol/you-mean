<!-- title -->

# you-mean

<!-- /title -->

<!-- badges ({
  custom: {
    "Netlify Status": {
      image: "https://api.netlify.com/api/v1/badges/6aabc091-087c-4398-8183-f82ccf2f5425/deploy-status",
      link: "https://app.netlify.com/sites/you-mean/deploys",
    },
  }
}) -->

[![CI](https://github.com/kitschpatrol/you-mean/actions/workflows/ci.yml/badge.svg)](https://github.com/kitschpatrol/you-mean/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/6aabc091-087c-4398-8183-f82ccf2f5425/deploy-status)](https://app.netlify.com/sites/you-mean/deploys)

<!-- /badges -->

<!-- description -->

**Imagine text through Google search suggestions.**

<!-- /description -->

## Overview

This is a service which generates text through Google Search's auto-complete algorithm. It was created in 2010.

It's implemented in TypeScript + Node.js, and is exposed through a simple API service intended for deployment on Netlify. It could probably be deployed to Cloudflare Workers as well since it does not leverage node-specific APIs. The service was ported from its original Python implementation (saved in `/archive`) in March 2022.

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
curl -s "https://you-mean.netlify.app/api/suggestify?text=what%20hath%20god%20wrought" | jq
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
pnpm run watch
```
