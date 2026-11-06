# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation

- Correct deployment and development commands to `pnpm run release` and `pnpm run dev`, and explain the release script's version, build, and deployment steps.

### Maintenance

- Refresh shared configuration, Wrangler, tsdown, Vitest, Lodash types, and pnpm; remove pnpm release-age exemptions.
- Replace the `skills` package and prepare hook with pnpm's native dependency-skill linking, and simplify deep cleaning.
- Update GitHub release and dependency-update actions, and title automated dependency PRs `Update dependencies.`.

## [1.0.8] - 2026-10-12

### Changed

- Include up to 2,000 characters of the upstream response body in suggestion errors, retaining the HTTP status if reading the body fails.

### Removed

- **Breaking:** Remove Netlify Functions deployment support and its static placeholder site; use the Cloudflare Workers API at `https://frontiernerds.com/api/you-mean`.

### Fixed

- Fix Google suggestion requests to use `client=firefox` instead of `output=firefox`.

### Documentation

- Update API examples and hosting guidance for Cloudflare Workers, and correct the archive path to `/Archive`.

### Maintenance

- Replace live-service snapshot tests with eight mocked unit tests and retain live Google checks behind `pnpm test:integration`.
- Refresh development dependencies, pnpm, and CI actions; allow ESLint 10 in accessibility-plugin peer checks and remove pnpm release-age exemptions.
- Skip loopback URLs and accept empty link-check input; run automated dependency updates monthly.
- Make releases build the library and deploy the Cloudflare worker, and consolidate local development under `pnpm dev`.

## [1.0.7] - 2026-10-06

### Added

- Add a built ESM library entry point with TypeScript declarations, package exports, and side-effect-free package metadata.

### Changed

- **Breaking:** Move the documented source entry point from `src/main.ts` to `src/index.ts`; update direct source imports or use the built `you-mean` export.
- **Breaking:** Narrow the declared Node.js range to `^24.16.0 || >=26.3.0`, excluding Node 25 and Node 26 versions before 26.3.
- Declare CC-BY-NC-SA-4.0 licensing and add the license notice.

### Documentation

- Document built-library usage and unpublished npm status, correct the API example to the Netlify URL, and update deployment guidance.
- Explain that `Archive/` preserves the original 2010 Python/PHP implementation.

### Maintenance

- Refresh development tooling, including pnpm 12, Vitest 5, shared configuration, tsdown, Wrangler, and Netlify CLI; update live-service test snapshots.
- Add scheduled dependency-update PRs and synchronize dependency-provided agent skills during installation.
- Improve sitemap discovery, tighten release tag patterns and default-branch validation, pin CI/release actions, and add a release timeout.
- Add VS Code linting, fixing, formatting, and type-checking tasks with problem matchers.

## [1.0.6] - 2026-07-26

### Fixed

- Restore a working production API through Netlify Functions at `/api/you-mean` after Google's HTTP 403 responses to Cloudflare requests, and send a Firefox User-Agent upstream.

### Documentation

- Document both deployment targets, required credentials, local development commands, and Google's blocking of Cloudflare requests.

### Maintenance

- Fix sitemap discovery in website link checks and provide the build script required by CI.
- Add Netlify CLI and platform-specific deployment commands; make `release` bump the version without deploying.

## [1.0.5] - 2026-07-25

### Fixed

- Fix Cloudflare routing for requests with query strings by adding a trailing wildcard, and forward unmatched paths to the origin.

### Documentation

- Correct the deployment command to `pnpm run release` and document the wildcard worker route.

## [1.0.4] - 2026-07-25

### Added

- Expose `suggestify(sourceText: string): Promise<string>` from `src/main.ts` to transform text through Google autocomplete on Node.js 24.16.0 or newer.
- Handle multiline text by stripping punctuation and Latin diacritics, normalizing line endings, and preserving blank lines.
- Transform phrases of up to eight words, retrying shorter fragments when suggestions are unavailable and retaining unmatched single words.
- Cache suggestion promises in memory and deduplicate repeated requests, including concurrent calls.
- Serve `/api/you-mean?text=…` on Cloudflare Workers with wildcard CORS and HTTP 200 JSON responses containing `status`, `youSaid` and `youMeant` on success, or an error `reason` for invalid input and upstream failures.

### Documentation

- Add library and curl examples, pnpm installation and testing instructions, and Cloudflare development, routing, and deployment guidance.

### Maintenance

- Use native `fetch` and replace `memoizee` with promise caching, leaving Lodash as the sole runtime dependency.
- Set up pnpm, TypeScript, shared linting, Vitest tests, cross-platform CI, link checks, and release automation.

[Unreleased]: https://github.com/kitschpatrol/you-mean/compare/v1.0.8...HEAD
[1.0.4]: https://github.com/kitschpatrol/you-mean/releases/tag/v1.0.4
[1.0.5]: https://github.com/kitschpatrol/you-mean/compare/v1.0.4...v1.0.5
[1.0.6]: https://github.com/kitschpatrol/you-mean/compare/v1.0.5...v1.0.6
[1.0.7]: https://github.com/kitschpatrol/you-mean/compare/v1.0.6...v1.0.7
[1.0.8]: https://github.com/kitschpatrol/you-mean/compare/v1.0.7...v1.0.8
