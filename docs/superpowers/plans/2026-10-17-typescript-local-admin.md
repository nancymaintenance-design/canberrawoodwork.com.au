# TypeScript Local Admin Implementation Plan

> For agentic workers: Use superpowers:executing-plans inline. User explicitly prohibits subagents and authorizes direct execution.

**Goal:** Deliver a local Chinese editor, reliable English synchronization ledger, TypeScript production sources and reproducible upload archives.
**Architecture:** Preserve generated production markup; index editable text/attributes by stable page and DOM positions. Store versioned local drafts, apply approved bilingual changes at build time, and keep admin outside public API.
**Tech Stack:** Node 24, TypeScript, parse5 source locations, fflate, native browser controls.
**Spec:** ../specs/2026-10-17-typescript-local-admin-design.md

## Global Constraints

- Work only in E:/Ellis-Services/Canberra Woodwork/source; reports in sibling reports.
- No push or production deployment in this implementation turn.
- Preserve baseline e5650ab content/layout and original phone/mail behavior.
- Admin binds 127.0.0.1; drafts, history and private files excluded from release.
- User: no subagents; native implementation and self-review.

## Review Focus

- Stale saves must return conflict instead of losing data.
- Duplicate text on unrelated pages must not be silently changed globally.
- Chinese revision invalidates the corresponding English synchronization.
- Invalid links, image paths and script injection must fail validation.
- Package must reproduce approved output without local state or secrets.

### Task 1: Baseline and typed build

Files: package.json, tsconfig.json, build.mts, src/*.mts, browser/*.ts, api/contact.ts, build.mjs bootstrap, scripts/compile.mjs, migration fixtures/tests.
Interfaces: npm run build emits dist; npm run typecheck verifies TypeScript; old test entry points may be generated compatibility files.
- [ ] Capture original rendered page and asset hashes before migration.
- [ ] Add a preservation test; migrate production sources with annotations and compile browser scripts.
- [ ] Compare rendered text, headings, links and images to baseline; run original tests adapted to generated sources.

### Task 2: Content and revisions

Files: admin/model.mts, admin/catalog.mts, admin/store.mts, admin/render.mts, content/approved.json, test/local-admin.test.mjs.
Interfaces: getCatalog(dist), readState(root), saveDraft(root,id,zh,expectedVersion), syncEnglish(root,id,en,expectedVersion), restore(root,revision,expectedVersion), applyContent(dist,state,mode).
- [ ] Test persistence, stale-write conflict, page-local fields and English invalidation before implementation.
- [ ] Implement stable IDs, source-offset patches, shared-field labeling and atomic state/history.
- [ ] Apply edits to their exact occurrences; synchronize metadata/feed/schema and block release with pending English.

### Task 3: Local server and editor

Files: admin/server.mts, admin/ui/index.html, admin/ui/editor.ts, admin/ui/admin.css, start-admin.cmd.
Interfaces: GET /admin/api/state; POST /admin/api/save, /restore, /sync, /preview, /package; GET /preview/{zh/}... . Writes require local Origin/Host/token and expectedVersion.
- [ ] Test rejection of invalid origins, paths, stale revisions and real contact POST.
- [ ] Implement Chinese page navigation, search, field editing, diff/history/restore, pending English, image upload and previews.
- [ ] Browser-check save/reload/restart, no-results, keyboard and narrow layout.

### Task 4: Upload artifacts and delivery

Files: admin/package.mts, admin/sync.mts, docs/local-admin-guide.md, report artifacts.
Interfaces: npm run package emits source-release.zip, static-site.zip, SHA256 manifest and instructions; npm run sync imports reviewed English changes.
- [ ] Test pending-English rejection and private-file exclusion.
- [ ] Build verified archives and rebuild from extracted source in temporary report folder.
- [ ] Run typecheck, tests, browser checks and self-review; start local admin and deliver Chinese instructions.
