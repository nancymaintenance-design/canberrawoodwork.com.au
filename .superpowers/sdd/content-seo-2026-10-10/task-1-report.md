# Task 1 report: all 17 existing service pages

Completed locally on 2026-10-10 against baseline `1512094776d6cc876f4ee82b956df29cca8d7790`. No push or deployment. All existing service identities, H1 topics and URLs remain; the existing search titles were retained because they already describe the route topic. Each service received a rewritten intro, concise meta description, component-specific narrative, quote guidance and contextual guide link. This is an editorial and rendering improvement, not a ranking or content-quality guarantee.

## Implementation and scope

- `src/service-editorial.mjs`: reviewed editorial data for all 17 services; three decision headings and six narrative paragraphs per service, relevant guides and narrowly relevant sources. Three merged FAQ answer overrides are explicitly keyed to the final visible question, preserving shared consolidation and the FAQ hub.
- `src/service-deep-content.mjs`: compatibility re-export to retain existing build imports. The previous copy is replaced, not appended beneath the new content.
- `src/site-enhancements.mjs`: renders the edited service intro/meta and matching Service/WebPage descriptions, uses topic-specific H2s, removes the exhaustive keyword catalogue, combines useful service paragraphs once, and renders contextual guide/source links. Installation pages use installation FAQ wording and an on-site measure heading. Shared homepage/hub/article branches are unchanged.
- `src/priority-service-content.mjs`: removes duplicate scope/method inserts, leaves component-focused photo commentary, and preserves the article guide data and enrichment function. No project story or claim of photo provenance was added.
- `src/faq-answers.mjs`: nine service-specific answers revised for glass retention, leak scope, flooring sequence, plumbing, structural and approval responsibilities. Shared general FAQ answers unchanged.
- Tests: new rendered service regressions, plus service-only revisions in `test/site.test.cjs`, `test/deep-conversion.test.cjs` and `test/priority-service-content.test.mjs`.
- No edits to base service data in `src/content.mjs`, article data, shared FAQ consolidation, keyword IDs, hub content, CSS, media, security configuration or contact form behavior. Existing unrelated tracked/untracked files were preserved.

The pipeline was traced through build.mjs → enhanceSite → enhanceSearchContent → priority enrichment. The last two layers previously rewrote headings and appended scope/method text, so simply editing the base service records would not resolve the final rendered repetition. The service renderer now supplies the final decision headings and removes the research-term catalogue before those layers run. Service intro and schema description are updated together without changing the shared service-card excerpts or article conversion excerpts.

## Research and individual editorial map

Research: `C:/Users/UFTR/Desktop/Entry/10、Canberrawoodwork/Canberra_Carpentry_AI_Keyword_Map.md`, dated 2026-09-28. IDs below identify the themes consulted, not a promise to print each phrase. No density, traffic, volume, price, availability or capability claim is inferred. Local map discrepancies CBR-C-165 and CBR-C-254 were not used as evidence or renamed.

| Existing service | Themes / representative source IDs | Individual changes and FAQ review | Main contextual guide | Approx. words before → after |
| --- | --- | --- | --- | --- |
| small-carpentry-jobs | Grouped small repairs, quote/call-out arrangements: 006, 012–014, 151–158 | One task per line, priorities by room, fixing checks, larger work separately, accepted tasks and minimum-charge confirmation. Reviewed existing grouped-task, fee, access and scheduling answers; retained current availability confirmation, no new guarantee. | carpentry-jobs-before-selling | 1090 → 929 |
| door-and-frame-repairs | Timber leaf/jamb, sticking door, hanging/trimming: 015–024, 027, 043, 159–164, 338 | Fault location and retained leaf vs jamb replacement; floor clearance and permitted trimming allowance; supplied-door compatibility. Merged latch answer distinguishes alignment from lock/security mechanisms. | timber-door-sticks-after-rain | 1078 → 922 |
| timber-window-repairs | Timber frames/sills/sashes, glass retention: 028–033, 166–169, 343–344 | Local sill vs connected-frame damage; lower rails, sill fall/drip edge, agreed inspection access. Glass-retention FAQ now states glazier scope and condition/access limit; leak FAQ separates specialist work. No promise of sash-cord, double-glazing or heritage-restoration capability from research terms. | rotten-window-sill | 901 → 814 |
| rotten-timber-repairs | Decay, water damage, fitted timber sections: 037–042, 170–172, 346 | Component role and sound repair joints, filler limits, decay vs pest findings, moisture source vs timber scope. Merged recurring-rot answer no longer implies Ellis supplies every moisture-source trade. | why-timber-rot-returns | 822 → 699 |
| fascia-and-eaves-repairs | Fascia/bargeboard/lining: 044–051, 173–175, 351–352 | Lower roof edge vs gable vs underside lining, gutter bracket access, unknown-material checks and quote inclusions. Gutter FAQ distinguishes timber and roofing/guttering responsibilities. Relevant official asbestos link. | fascia-bargeboard-eaves | 1026 → 743 |
| deck-repairs | Boards vs frame, finishing vs repair: 052–057, 059–060, 176–180 | Board damage vs joists/bearers/posts; underside access and retained framing; old/new appearance and separate coating scope. Existing board-only, frame-inspection, cost-factor and finish FAQs retained as useful. Removed duplicate priority prose and duplicate local guide insertion; retained comparison guide. | deck-boards-or-frame; repair-or-rebuild-a-deck | 1191 → 824 |
| timber-fence-repairs | Palings/pickets/posts/rails: 062–070, 181–184, 359–361 | Single paling vs leaning run, footing and retained-board consequences, affected length, neighbour-side access, cost-sharing separate from repair quote. Existing repair/replacement, post-cost and written-quote answers reviewed and retained. | leaning-paling-fence | 967 → 788 |
| timber-gate-repairs | Sagging leaf/frame/post/hinges: 072–079, 185–187, 363–364 | Whole moving assembly, paving clearance, sound hinge timber and retained leaf vs replacement; motorised equipment and safety-barrier scope. Existing sag/retention/post-check FAQs retained; no powered-gate service added. | why-timber-gates-sag | 888 → 732 |
| skirting-and-architraves | Profiles, installation, floor junctions: 080–089, 188–191, 367–368 | Height/thickness/material/profile match, MDF swelling vs open mitre, floor sequence and separate door clearance; removal, customer supply and painting inclusions. Flooring FAQ identifies installer confirmation without promising coordination. | skirting-after-new-flooring | 1110 → 815 |
| cabinet-door-and-drawer-repairs | Hinges/runners/panels/wardrobe fittings: 090–100, 192–195, 369, 372 | Hardware vs panel failure, part number and compatibility, MDF/particleboard fixing limits, match limits and mirrored/glazed-panel boundary. Plumbing-leak FAQ now states relevant plumbing trade scope. Existing parts and local repair FAQs reviewed. | cabinet-hinges-and-drawer-runners | 993 → 821 |
| interior-carpentry | Shelves/panelling/fix-out: 101–104, 107, 196–198, 373–374 | Room-detail list, shelf load, substrate and concealed services, panelling junctions, final renovation levels; trim/custom storage routed to existing owners. Existing uneven-wall shelving, room panelling and fix-out FAQs reviewed; no bulkhead capability added. | skirting-after-new-flooring | 810 → 644 |
| timber-weatherboard-repairs | Timber boards/profile/lap/backing: 108–111, 199, 375–376 | Local board vs wall-wide dampness, accessible backing and water path, agreed wider opening, timber vs other cladding systems, profile and finish extent. Existing individual-board and backing-check FAQs retained. | timber-weatherboard-damage | 732 → 576 |
| timber-stair-and-handrail-repairs | Treads/rails/supports/anchorage: 112–117, 200–201, 377–379 | Tread vs rail checks, no weight-testing, assessed supporting material, repair vs new design and safety requirements; quote includes profiles/fixings/access. Existing safe-assessment and anchorage FAQs reviewed. Removed duplicate priority narratives. | loose-timber-stairs | 1071 → 736 |
| pergola-timber-repairs | Existing posts/beams/verandahs/screens: 118–120, 202–203, 380–381 | Decorative screen vs roof support, footing/house attachments, base repair vs post replacement, temporary support, alteration vs existing repair. Approval FAQ no longer promises Ellis arranges qualified approval checks. No new pergola/carport construction capability inferred. | pergola-post-rot | 998 → 656 |
| custom-joinery | Measured built-ins/shelving: 124, 126–128, 204–206, 384 | Intended storage and operating clearances, standard fitted products vs specialist manufacture, measured approvals, material/edges/finish and responsibility split. Existing design/manufacture/under-stair FAQs reviewed; no factory, showroom, cabinetmaker credential or new product capability claimed. | cabinet-hinges-and-drawer-runners, specifically existing repair vs new storage | 854 → 664 |
| structural-timber-repairs | Framing/joists/bearers/termite damage: 131–136, 207–208, 385–387, 390 | Load-bearing role, treatment vs timber assessment, safe access/support and engineering prerequisites. Merged termite FAQ and floor-joist/load-bearing/roof-leak answers remove unsupported specialist coordination. Relevant ACT approval link. | why-timber-rot-returns, specifically moisture-source sequence | 841 → 709 |
| deck-building | New timber deck/extension: 137–138, 140, 209–210, 388–389 | Footprint/height/house connection, existing support capacity for extension, set-out/footings/drainage, demolition vs construction inclusions and DA vs BA. Existing approval/extension FAQs retained. No composite-installation capability inferred from 139. | repair-or-rebuild-a-deck | 836 → 691 |

Word counts use the controller’s baseline method: extract `<main>`, replace HTML tags with spaces, collapse whitespace and split on spaces. They include breadcrumbs, closed FAQ text and related links, and are approximate whitespace counts, not linguistic word counts. All 17 services total 16,208 → 12,763 (−3,445); the whole site totals 27,640 → 24,195. The 22 non-service routes have unchanged counts under the same method. No minimum word count was enforced; shorter pages were not padded. Duplicate H1-as-H2 occurrences fell from 17 service pages to zero. Existing visible FAQ counts were retained.

## RED / GREEN and test revisions

Initial RED: `node --test test/service-editorial.test.mjs` failed 3/3 before implementation. The observed failures were `small-carpentry-jobs: H1 must not repeat as H2`, missing one-task-per-line component guidance, and `timber-window-repairs` unsupported coordination copy. These tests exercise built HTML, not the new data source.

Initial full-suite iteration: 24 passed, 4 failed. Failures were `rendered enquiry channels and FAQ answers match the service customers request`, `five priority services preserve headings, add unique detail and relevant guide links`, `safety boundaries do not promise third-party coordination or unsupported qualifications`, and `test/site.test.cjs`. Three contained legacy exact-wording/catalogue assumptions; the fourth correctly exposed surviving structural FAQ coordination claims, which were fixed.

Second RED: after the main tests were green, added `window FAQ defines glass retention as a glazing decision`. Focused run: 3 passed, 1 failed because the visible glass-retention answer did not name the glazier boundary. Revised CBR-C-169, rebuilt, and observed GREEN.

Legacy service assertions were revised only where they required repeated service-title H2s, the removed keyword-scope section, a census of every core keyword phrase, unchanged obsolete source paragraphs, or a rigid 650-word floor. Their real purposes remain protected: distinct topic/installation wording, three coherent narrative headings, unique paragraphs, relevant resolving links, optional-photo channels, matching visible intro/Service description, canonical provider, routes, forms and safety/schema boundaries. Related official source links are allowed only on the relevant service pages; global link/schema/security checks remain. Existing consolidation questions/counts and article checks remain intact.

Final full-suite command: `node scripts/test.mjs`, exit 0. Full output (timings omitted):

```text
Built 39 public routes at https://www.canberrawoodwork.com.au
✔ built site provides a root favicon while retaining its existing page icon
✔ rendered repair pages provide a site-assessment route without deflection or internal editorial talk
✔ rendered enquiry channels and FAQ answers match the service customers request
Canonical host rule verified; live HTTP chain still requires infrastructure verification
✔ test/domain-redirect.test.mjs
Visible FAQ consolidation and FAQPage absence verified
✔ test/faq-consolidation.test.mjs
✔ five priority services retain photo commentary and relevant guide links without duplicate narratives
✔ general FAQ and homepage design are retained
✔ informational guides retain their service conversion path and add distinct explanations
✔ local search content is rendered with district anchors and matching article schema
✔ /: identifies the canonical business once
✔ /services/deck-repairs/: identifies the canonical business once
✔ /news/repair-or-rebuild-a-deck/: identifies the canonical business once
✔ /faq/: identifies the canonical business once
✔ /about/: identifies the canonical business once
✔ /contact/: identifies the canonical business once
✔ page schemas identify the website and appropriate page types
✔ service provider and article publisher resolve to the canonical business
✔ FAQ schema is absent while visible FAQ details remain
✔ AI discovery document provides dated canonical Markdown links
✔ service headings describe decisions without repeating the H1 or a keyword catalogue
✔ all seventeen services connect component decisions, quote scope and a relevant guide
✔ safety boundaries do not promise third-party coordination or unsupported qualifications
✔ window FAQ defines glass retention as a glazing decision
Validated 40 pages, internal links, metadata, JSON-LD and deep service content
✔ test/site.test.cjs
✔ deck decision guide publishes three scopes, quotation checks and professional repair approach
✔ security policy preserves the canonical redirect and contact function settings
✔ all static paths receive MIME, referrer, permissions and frame protection
✔ mutable assets require revalidation and cannot use immutable caching
✔ this phase does not enforce a Content-Security-Policy
tests 29; suites 0; pass 29; fail 0; cancelled 0; skipped 0; todo 0
```

## Self-review and concerns

- All 17 narratives explain the actual component or installation decision, inspection/measurement, retain/replace options, quote factors and next step. Existing useful FAQs were reviewed together with the rewritten bodies; answer changes were targeted where scope or responsibility was unclear.
- Meta descriptions are unique and 148–164 characters. Service descriptions match visible edited intros; WebPage descriptions match edited meta descriptions. Service.provider and Article.publisher business references remain canonical; FAQPage JSON-LD stays absent and visible FAQs remain.
- Existing tone, narrative layout, images, contact form, navigation and contact channels are retained. No browser visual audit was performed in this subtask; controller review can inspect the local preview. Rendered HTML and full-suite checks are green.
- Photo provenance, first-hand projects, professional credentials, insurance, precise licensed capability, supply/manufacture arrangements, prices and live availability were not independently verified. No new proof, reviews or author claims were created. Existing business facts and supplied media were preserved; component commentary does not certify that the images show Ellis projects.
- Existing shared FAQ hub copy and article/hub content are outside this task. Their unchanged scope statements are not independently validated by these service edits.
- Relevant primary sources checked on 2026-10-10: [ACT building approval check](https://www.planning.act.gov.au/applications-and-assessments/building-approvals/check-if-you-need-a-ba) and [Access Canberra asbestos assessor/removal licensing](https://www.accesscanberra.act.gov.au/business-and-work/building-and-construction/asbestos-assessor-and-removal-licensing). ACT direct open initially timed out; the same official page was retrieved through web search. The copy uses general scope checks and no numeric exemption thresholds, legal determination or DIY structural method.
- `seo-content` informed removal of repetitive copy, useful internal links and truthful evidence boundaries. No rigid word-count/density advice from that skill was applied where it conflicted with the task. `.seo-cache/` was absent; no out-of-scope cache or ignore changes were made.
- Live redirects, indexing, ranking, enquiries and deployment were not tested or changed. No push or deployment was performed.
