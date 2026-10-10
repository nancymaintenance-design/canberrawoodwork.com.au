# Safe SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the generated Canberra Woodwork site locally verifiable and improve its safe technical SEO signals without publishing or inventing business facts.

**Architecture:** Keep `build.mjs` as the single static-site generator. Add one deterministic test entrypoint that builds once before the suite, extend generation through small schema/document helpers, and keep deployment policy declarative in `vercel.json`. Production artefacts are verified from `dist`, then served locally only after all automated checks pass.

**Tech Stack:** Node.js 24+, ESM static-site generator, Node built-in test runner, Vercel configuration.

**Spec:** `docs/superpowers/specs/2026-10-10-safe-seo-foundation-design.md`

## Global Constraints

- Work only in `E:\EllisWebsite-GitHub\canberrawoodwork-preview` on `codex/local-seo-ui-preview`.
- Do not push GitHub, deploy Vercel, alter production APIs, or open a public tunnel.
- Do not add or modify business claims about legal entity, ABN, address, service area, licence, insurance, personnel, reviews, rating, opening hours, price, coordinates, availability, warranty, or projects.
- Preserve all visible FAQ content; remove only `FAQPage` JSON-LD.
- Do not use `immutable` caching for mutable, non-fingerprinted asset names.
- Use tests first; record a failing test before each production-code change.
- The finished build must be served locally for user approval only.

## Review Focus

- Concurrent test processes must not both delete or partially read `dist`; the suite uses one build and serial tests.
- A malformed or missing JSON-LD entity reference must fail parsing/contract assertions rather than silently ship.
- Visible FAQ `<details>` must survive even when every `FAQPage` object is removed.
- `llms.txt` must contain canonical production URLs, descriptive Markdown links, and no loopback address.
- Security/cache headers must not apply an immutable year-long policy to mutable assets or alter the contact API route.

---

### Task 1: Deterministic build and favicon compatibility

**Files:**
- Create: `scripts/test.mjs`
- Create: `test/build-workflow.test.mjs`
- Modify: `build.mjs:1,112,136-139`
- Modify: `test/deep-conversion.test.cjs:5-10`
- Modify: `test/faq-consolidation.test.mjs:1-7`
- Modify: `test/search-content.test.cjs:5-9`
- Modify: `test/site.test.cjs:4-17`
- Modify: `test/stage3-content.test.cjs:5-9`

**Interfaces:**
- Produces: `node scripts/test.mjs`, which runs `node build.mjs` exactly once and then runs every existing test serially against that generated `dist`.
- Produces: `dist/favicon.ico`, copied from the existing favicon asset without changing existing page icon markup.
- Consumes: existing `node build.mjs` command and all test files under `test/`.

- [ ] **Step 1: Write a failing build-workflow test**

Create `test/build-workflow.test.mjs` to assert after a build that `dist/favicon.ico` exists and has non-zero bytes, `dist/assets/ellis-services-logo.png` exists, and generated `dist/index.html` still links its current favicon asset.

- [ ] **Step 2: Run the new test and verify it fails**

Run: `node --test test/build-workflow.test.mjs`

Expected: FAIL because `dist/favicon.ico` does not exist.

- [ ] **Step 3: Add the minimal favicon generation/copy and deterministic suite runner**

In `build.mjs`, copy the existing suitable favicon source into `dist/favicon.ico` during the existing output generation. Add `scripts/test.mjs` to invoke one build then run `node --test --test-concurrency=1 test/*.test.cjs test/*.test.mjs`. Remove per-test `execFileSync(... build.mjs ...)` calls so test files only consume the prebuilt output.

- [ ] **Step 4: Run focused verification**

Run: `node --test test/build-workflow.test.mjs`

Expected: PASS and all three generated artefacts exist.

- [ ] **Step 5: Run full verification**

Run: `node scripts/test.mjs`

Expected: PASS with no `ENOTEMPTY`/`dist` race and no broken logo assertion.

- [ ] **Step 6: Commit**

```bash
git add build.mjs scripts/test.mjs test/
git commit -m "test: make static build verification deterministic"
```

### Task 2: Schema graph, FAQ markup and AI discovery document

**Files:**
- Create: `test/seo-foundation.test.mjs`
- Modify: `build.mjs:24-29,115-139`
- Modify: `test/site.test.cjs:65-69,136-139`

**Interfaces:**
- Produces: `BUSINESS_ID = 'https://www.canberrawoodwork.com.au/#business'` used by base business, `Service.provider`, and `Article.publisher` JSON-LD.
- Produces: generated `llms.txt` with canonical Markdown links and only current on-site facts.
- Consumes: `business`, `services`, `articles`, existing canonical origin and generated page routes.

- [ ] **Step 1: Write failing schema/discovery tests**

Create `test/seo-foundation.test.mjs`. It must build only through the Task 1 runner contract, parse every JSON-LD script on `/`, one service page, one article, `/faq/`, `/about/` and `/contact/`, and assert: the canonical `ProfessionalService` has `@id`; each Service provider and Article publisher use that `@id`; `FAQPage` is absent; visible FAQ details remain; `llms.txt` has no `127.0.0.1`, contains a `Last updated:` date and Markdown links to home, services, About and Contact.

- [ ] **Step 2: Run the new test and verify it fails**

Run: `node --test test/seo-foundation.test.mjs`

Expected: FAIL because current schema has no business `@id`, emits `FAQPage`, and `llms.txt` contains loopback URLs/plain links.

- [ ] **Step 3: Implement the smallest schema/document changes**

In `build.mjs`, introduce a business-ID constant and use it in the existing `ProfessionalService` graph; add unambiguous `WebSite`/page-type schemas without new factual properties; replace partial service provider/publisher objects with ID references; remove `FAQPage` schema generation only; and render `llms.txt` with static canonical URLs, neutral descriptions, and the build date. Preserve existing page copy, visible FAQ markup, `Service`, `Article` and breadcrumbs.

- [ ] **Step 4: Run focused verification**

Run: `node --test test/seo-foundation.test.mjs`

Expected: PASS; JSON-LD parses and all stated graph/document contracts hold.

- [ ] **Step 5: Run full verification**

Run: `node scripts/test.mjs`

Expected: PASS with the updated site test expecting no `FAQPage` schema.

- [ ] **Step 6: Commit**

```bash
git add build.mjs test/seo-foundation.test.mjs test/site.test.cjs
git commit -m "feat: strengthen safe SEO schema and discovery"
```

### Task 3: Vercel security and cache policy

**Files:**
- Create: `test/vercel-headers.test.mjs`
- Modify: `vercel.json:1-17`

**Interfaces:**
- Produces: declarative Vercel header rules for static routes/assets.
- Preserves: existing canonical-host redirect and `api/contact.js` function configuration.

- [ ] **Step 1: Write a failing Vercel-policy test**

Create `test/vercel-headers.test.mjs` to parse `vercel.json` and assert existing redirect/function objects remain, static rules provide `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`, and clickjacking protection, while the `/assets/:path*` cache header does not include `immutable`.

- [ ] **Step 2: Run the new test and verify it fails**

Run: `node --test test/vercel-headers.test.mjs`

Expected: FAIL because the configuration currently has no `headers` policy.

- [ ] **Step 3: Add minimal Vercel header rules**

Extend `vercel.json` with headers for static HTML and assets. Preserve redirects/functions byte-for-byte where practical. Use safe revalidation caching for mutable `/assets/:path*`; do not add an enforced CSP in this phase.

- [ ] **Step 4: Run focused verification**

Run: `node --test test/vercel-headers.test.mjs`

Expected: PASS with all existing redirect/function assertions intact.

- [ ] **Step 5: Run full verification**

Run: `node scripts/test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add vercel.json test/vercel-headers.test.mjs
git commit -m "feat: add safe static security headers"
```

### Task 4: Final local build and preview hand-off

**Files:**
- Modify: none unless verification exposes a real defect; route any fix through a new failing test and the appropriate preceding task's review loop.

**Interfaces:**
- Consumes: `node scripts/test.mjs`, `node build.mjs`, `serve-preview.mjs`, generated `dist/`.
- Produces: a local-only `http://127.0.0.1:<port>` preview and a final verification record.

- [ ] **Step 1: Run the complete verification suite**

Run: `node scripts/test.mjs`

Expected: PASS, zero failures.

- [ ] **Step 2: Validate generated SEO artefacts**

Run: `node build.mjs` and inspect generated `dist/favicon.ico`, `dist/robots.txt`, `dist/sitemap.xml`, `dist/llms.txt`, homepage schema, FAQ markup/schema, a service schema and an article schema.

Expected: all acceptance criteria in the spec are met and no unverified factual claims were added.

- [ ] **Step 3: Start local-only preview**

Run: `node serve-preview.mjs` using an unused local port, keeping it running for user review.

Expected: the generated site is reachable only at `127.0.0.1`; no GitHub/Vercel action occurs.

- [ ] **Step 4: Record hand-off state**

Record the port, committed revisions, test result, known baseline resolution and the explicit statement that deployment remains pending user approval.

## Self-review

- Spec coverage: Tasks 1–4 implement every stated goal; non-goals are global constraints.
- Task boundaries: Task 1 owns reliable generated artefacts; Task 2 owns generator SEO output; Task 3 owns declarative hosting policy; Task 4 owns no-code final validation and local hand-off.
- Interface consistency: Tasks 2–4 consume the single-build test runner produced by Task 1.
- Review Focus coverage: Task 1 covers race output; Task 2 covers graph/FAQ/llms conditions; Task 3 covers cache/header/API preservation.
- Proportion: code signatures and assertions are specified without reproducing implementation bodies.
