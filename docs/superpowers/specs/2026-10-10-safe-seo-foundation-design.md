# Safe SEO Foundation Design

## Purpose

Improve the technical SEO foundation of `canberrawoodwork.com.au` from the current GitHub-synchronised source without publishing, pushing, or changing unverified business claims. The deliverable is a locally runnable build and preview that the user can approve before any Vercel deployment.

## Source and scope

- **Source worktree:** `E:\EllisWebsite-GitHub\canberrawoodwork-preview`
- **Starting revision:** `d2fea7248be43cf5f6860e56e3c15e1b6c9d6b68` (`origin/main` at local sync time)
- **Deployment:** deliberately out of scope. No GitHub push, Vercel deploy, or production API change is authorised.
- **Business facts:** ABN, address, service-area status, licences, insurance, review counts, staff credentials, opening hours, prices, coordinates, ratings and case-study claims remain unchanged unless supplied and verified by the business.

## Goals

1. Make the static build/test workflow reliable when tests run together.
2. Retain the existing crawl/index foundation and eliminate the root favicon compatibility gap.
3. Strengthen structured-data entity relationships without inventing factual business data.
4. Remove `FAQPage` JSON-LD where it does not provide a Google rich-result benefit to this commercial site; visible FAQs remain.
5. Improve `llms.txt` into a concise, descriptive discovery document using only current public site facts.
6. Add secure, deployment-safe Vercel header policy and explicit caching for versioned static assets, without breaking forms, maps, analytics, images, or local preview.
7. Add regression coverage for every changed SEO contract and demonstrate the generated local site on a local port.

## Non-goals

- No new location landing pages, keyword expansion, backlink work, GBP changes, directory submissions or review solicitation.
- No changes to conversion copy beyond the factual short descriptions required by `llms.txt`.
- No speculative schema fields (`geo`, `openingHoursSpecification`, `priceRange`, `aggregateRating`, `sameAs`, licence or insurance claims).
- No performance claims based on unverified field Core Web Vitals.

## Design

### Build/test isolation

The generator writes to `dist`, while several existing tests invoke it independently. Node's default parallel test execution can therefore collide during `rmSync(dist)`. Tests must use an explicit single-build setup or serial execution so that each suite reads a stable generated output. The solution must preserve the existing build command and avoid deleting user files outside `dist`.

### Canonical business graph

The generator will declare one reusable Schema.org entity ID:

`https://www.canberrawoodwork.com.au/#business`

Existing `ProfessionalService` output will keep only existing factual data and gain that `@id` plus stable references. Service pages will reference that entity using `provider: { "@id": ... }`, rather than duplicate a partial provider object. Homepage/standard pages may emit `WebSite`, `WebPage`, `AboutPage`, or `ContactPage` only where the generated page type is unambiguous. Article output will link its publisher to the same ID and include an image only when that image is already represented by an existing factual local asset.

Commercial-page FAQ content remains in HTML. `FAQPage` JSON-LD will not be emitted. Breadcrumbs and applicable `Service`/`Article` schemas remain.

### Machine-readable discovery

`llms.txt` will be generated or maintained as a small Markdown document: business name, verified contact facts already published on the site, a last-updated date, core service links, and an evidence/contact link. It will describe each linked page in neutral terms. It will not assert qualifications, guarantees, reviews, legal status, or availability that the existing source does not prove.

### Headers, cache and favicon

`vercel.json` will define a conservative security-header set: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and clickjacking protection compatible with the site's iframe/map needs. Content Security Policy will not be enforced in this phase because it requires a production report-only validation cycle and the site contains external map/form dependencies.

Fingerprinting is not introduced in this phase. Static asset cache policy will therefore avoid an unsafe one-year immutable setting for mutable file names. Where assets are already immutable/fingerprinted, their policy may be long-lived; otherwise use an explicit safe revalidation policy. Root `/favicon.ico` will resolve to a current favicon asset or generated compatibility file.

### Verification and local approval

Node tests will prove build isolation, favicon availability, schema entity links, absence of `FAQPage`, `llms.txt` content, and configured security/cache headers. The full test suite and a clean build must pass. The final generated site will run only on a local port, and the user will receive the local URL and must approve it before any production action is considered.

## Acceptance criteria

- Full test suite passes without `dist` race failures.
- Build completes from the worktree and all generated routes retain canonical host, one H1 and valid local asset references.
- `/favicon.ico` returns a real icon in the local output.
- The business `@id` appears once as the canonical entity and is referenced by Service/Article schema where relevant.
- No generated document includes `FAQPage` JSON-LD; visible `<details>` FAQs remain.
- `llms.txt` contains only current verified site facts, descriptive Markdown links and an update date.
- `vercel.json` preserves `/api/contact`, the Google map/embed and current local preview behaviour while adding the agreed headers/cache policy.
- No remote or production side effect occurs. A local preview is available for review.

## Risks and mitigation

| Risk | Mitigation |
|---|---|
| Schema edit creates invalid or conflicting JSON-LD | Parse generated JSON-LD in tests and assert the exact entity references. |
| Headers block Google Maps or contact flow | Keep CSP out of enforcement; test configured route matching and manually inspect local flow. |
| Cache policy serves stale changed assets | Do not use `immutable` for non-fingerprinted asset names. |
| Facts are accidentally embellished | Tests and review reject all newly invented business-property values. |
| Preview differs from generated deployment output | Preview the same `dist` directory produced by the build. |
