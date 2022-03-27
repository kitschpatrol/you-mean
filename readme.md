# You Mean

Netlify Status TK

## Overview

This is a service which processes text through Google Search's auto-complete algorithm.

It's implemented in TypeScript + Node.js, and is exposed through a simple API service intended for deployment on Netlify. It could probably be deployed to Cloudflare Workers as well since it does not leverage node-specific APIs. The service was ported from its original Python implementation (saved in `/Archive`) in March 2022.

It's referenced on Frontier Nerds at the following URLs:

- https://frontiernerds.com/you-mean
- https://frontiernerds.com/projects/you-mean

## Usage

### As a Node library

```ts
import { suggestify } from "../../src/main";

const transformedText = await suggestify("what do i really mean?");

console.log(transformedText);
```

### Via web API

Request

```
/api/suggestify?txt=blablabla
```

Response:

```json
TK

```

## Development

### Setup

```
npm i
```

### Iteration

```
npm run test:watch
```

### Local Netlify Function testing

```
npm run build:watch-netlify
```
