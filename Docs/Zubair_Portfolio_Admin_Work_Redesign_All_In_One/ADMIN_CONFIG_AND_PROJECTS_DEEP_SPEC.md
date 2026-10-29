# ZUBAIR PORTFOLIO — ADMIN CONFIGURATION, PROJECTS MANAGER & WORK EDITOR

## 0. Product intent

Build a professional publishing-oriented admin **inside the existing application**, centered on the two real user routes:

- `/admin/configuration` — page-level and global placement/presentation configuration.
- `/admin/projects` — source-of-truth records for projects and their detailed case-study content.

Both screens should work together. **Project content** is canonical; **where and how the project is shown** is configurable per page/placement. This is a production CMS and art-direction interface, not an assortment of disconnected inputs. Do not recreate or replace a working system without verifying what exists.

**Primary public targets:** `/work` and existing `/work/[slug]` (or the verified actual route); the homepage featured work must remain compatible. Keep brand colors, fonts, graphic identity, homepage scrollytelling, and gradient footer unchanged.

## 1. Current-state constraint and audit gate

The external tools could not authenticate to or load the current admin URLs, so no claims are made about the exact current inputs, current CSS or DB models. **First run the actual app, review the rendered UI, inspect the code and server storage, and record what really exists.** See `CURRENT_ADMIN_AUDIT_LIMITATIONS_AND_CHECKLIST.md`. Never log/store credentials. No unreviewed production writes during audit.

### Implementation principles

- Reuse current routes, data access, components, authentication and media infrastructure where safe.
- Use stable IDs/foreign-key references. Labels, ordering and URLs must not be the entity identity.
- Prefer progressive migration (read legacy then write stable new form), not destructive bulk replacement.
- Each change has explicit **draft**, **preview**, **publish**, **rollback** semantics.
- Keep one canonical record per project and review. Allow secondary category placements without cloning project pages.
- Enforce source-backed accuracy; sample copy appears only in admin with a `SAMPLE – NOT PUBLISHED` label.
- Never duplicate originals, bulk import media files into `public/`, or hardcode CDN links with guessed paths.

## 2. Admin design architecture

### Global admin shell

Desktop: left lightweight sidebar for core modules (Overview, Projects, Reviews, Media, Configuration) AND top horizontal **configuration subtabs** for Homepage, My Work, Project Detail Defaults, Services, About, Contact, Global. If current admin has top-level tabs instead of a sidebar, preserve its navigation convention while making page tabs unambiguous and reachable; do not duplicate two sets of identical tabs.

Header: breadcrumb, page title, explanation, `Preview`, `Save Draft`, `Publish`, revision/unsaved indicator, live-site link and account/logout menu. Header actions must make sense for context: project edit publishes the project, page configuration publishes page settings, global publish can batch validated revisions. Avoid false 'saved' toast before server acknowledgement.

Default admin content max width ~1400–1500px with left-aligned page heading, consistent gutters, readable field widths, clear hierarchy and responsive controls. Use existing design tokens. No unrequested public theme overhaul.

### Visual hierarchy

Top: the *decision*. e.g. `My Work` with `4 categories · 17 subcategories · 51 published projects` (counts computed, not hardcoded).
Middle: the *editor*. Category tree/reordering or project list.
Right: context-sensitive inspector/preview, collapsible at narrower widths.
Bottom or sticky bar: unsaved changes, undo, save draft, preview, publish.

Avoid making each setting a separate giant card; group by `Content`, `Media`, `Placement`, `Behavior`, `SEO`, `Publishing`.

### Core admin modules

1. `Overview` — real project counts, drafts, hidden items, missing media, source reconciliation items, recently published changes (only real records), quick actions.
2. `Projects` (`/admin/projects`) — searchable CRUD, bulk assignments, per-project case study editor and preview.
3. `Reviews` — import/evidence, project association, verification and publish/visibility.
4. `Media Library` — approved images, posters, video references, real 3D files, metadata, usage lookup, broken links and upload workflow.
5. `Configuration` (`/admin/configuration`) — separate page tabs; in particular Work page taxonomy/order and Project Page Template Defaults.

## 3. My Work Configurator — MUST BE THE FLAGSHIP EDITOR

Route: `/admin/configuration` → top subtab `My Work` (or `/admin/configuration/work` if compatible with existing router). Support direct deep links and preserve current route.

### Three INDEPENDENT ordering controls (critical)

**A. Main categories:** reorder `3D`, `Renders`, `Architectural`, `Development` with drag handles AND move-up/move-down buttons. Current position displayed as 01/04, 02/04 etc. Changing root order affects category nav and sections, **not** project-specific positions or project category membership.

**B. Subcategory tree:** select a root; reorder its direct children; for `3D > 3D Animation`, reorder Product Animation, Installation Animation, Product Explainer. Preserve hierarchy with explicit parent selection. No invalid nesting, cycles, orphaned subcategories or duplicate sibling slugs. Changing subcategory order affects filter/listing order, **not** root order or project order.

**C. Projects inside category:** select a leaf; see actual assigned projects and drag to change their placement rank. Provide thumbnail/title/status and quick `Edit`, `Preview`, `Change category`, `Set as lead`, `Hide in this category`. A project can appear as a secondary placement in another category with a different rank and cover override. Changing rank in one leaf must not reorder other leaves or the project record itself.

### Taxonomy requested by owner

Top level:

```
3D
  3D Animation
    Product Animation
    Installation Animation
    Product Explainer
  Character Art & Game Assets          [proposed additional category; admin review]
  3D Modeling & Assets                 [proposed additional category; admin review]
Renders
  Product Renders
  Hero Renders
  Lifestyle Renders
  Standalone
Architectural
  Interior & Exterior
  Interior
  Exterior
  Arch Viz
Development
  Unity
  Unreal
  Web Interactive & Configurators     [proposed additional category; admin review]
  XR / Engine To Verify                [internal draft staging ONLY]
```

The supplemental categories are proposed because supplied content documents include characters and WebGL/configurator projects, and they must not be mislabeled Unity, Unreal or product animation. The owner can approve/reorder/rename/hide them in admin. Source taxonomy is stored in supplied JSON; current published category IDs may differ and must be mapped, not deleted wholesale.

### Category inspector fields

- Name, SEO label/slug, parent, description, eyebrow, summary, optional category intro.
- Show/hide (distinguish hidden from deleted); category display order.
- Category visual: image/video poster/cover/alternate mobile media, focal position, image fitting.
- Featured/lead project selection (canonical project ID), card media override, featured layout variant.
- Grid columns/layout preset, content density, static poster/video preview policy, per-category project count/pagination.
- Safe content blocks for intro, optional related-discipline CTA, category metadata/SEO; default to site-wide existing style.
- Draft preview link and publish state; warnings if hiding a category containing published projects.

### Work page global settings

- H1, eyebrow, introduction, category ordering and visibility, search placeholder, filter labels, active-state design preset, empty-state copy.
- Project card default media fitting, title/description visibility and card CTA.
- Configurable editorial lead per root/leaf category; optional full-width category story banner.
- Grid responsive layouts; page-size/pagination strategy; search/sort UX.
- Related project recommendation logic: same leaf first, then parent, without duplicating currently viewed project.
- Persistent query/filter state and back navigation to the last position where reasonable.
- SEO title/description and sharing image chosen from genuine media.

### Categories management safety

Before delete/move/slug change, display affected project counts, descendant count, placement dependencies, published URL impacts and a safe resolution flow. Soft-hide first. Never silently remove associated projects. Revisions must be recoverable.

## 4. Projects Manager (`/admin/projects`)

### Listing UI

A readable table/grid with cover, title, primary category path, any secondary placements, number of gallery assets, review count, publication status, homepage featured flag, Work visibility, last updated, actions. Search by title/client/tags; filter by main category, subcategory, publication state, missing media, review state; sort by last edited, published, alphabetical, or placement rank *within selected category*.

Bulk actions: assign primary category, add secondary placement, change visibility, publish selected valid drafts, add tags, or move rank (when category context selected). Never provide destructive bulk delete without confirmation and referential integrity checks.

### Individual project editor — preferred tabs

1. **Overview**: real title, slug, category, client/brand (only if source-approved), short excerpt, tagline, detailed overview, responsibilities, deliverables, tools/platform, website/demo links, SEO and draft state.
2. **Categories & Placements**: primary leaf picker with breadcrumb, secondary categories, per-placement rank, visibility, list cover override and card copy override; homepage featured toggle and rank independently. Preview placement in Work.
3. **Hero & Media**: hero type `image | video | 3d-model | embedded-demo`, library asset reference, poster, video behavior, focal point, object-fit, desktop/mobile variants, full media gallery ordering, captions/alt text, download permissions. Unsupported type falls back gracefully to approved poster.
4. **Case Study Builder**: reusable ordered typed content blocks with drag/reorder, inline preview and ability to hide sections per project. A blocks array could include: `introduction`, `text`, `image`, `imageGrid`, `video`, `imageComparison`, `modelViewer`, `embed`, `metric` (verified only), `specList`, `techStack`, `processSteps`, `review`, `relatedProjects`, `cta`.
5. **Reviews**: attach verified review ID(s), reorder, select featured review, optionally show source/contract title or anonymized attribution per approval. A ratings-only review may show stars/title but not fabricated quotation.
6. **Related Work**: curate 2–4 real records, optional safe category-based fallback; avoid self-links, duplicates and unpublished project leaks.
7. **Preview & Publish**: actual frontend render draft, desktop/mobile toggles, source status, missing media checks, broken links, publication validation, publish/rollback.

### Editor usability

- Persistent save bar when dirty; distinguish `Save Draft` vs `Publish`.
- Unsaved navigation guard.
- Clear input labels, inline validation and small help text.
- Real media-picker modal: library search, photo/video/GLB filtering, dimensions/duration/size/rights and preview.
- Intelligent empty states, not large blank areas; warn when a review needs approval.
- Make object fit `contain` for original-detail image viewer; card crops only when configured.
- Admin changes must be durable, not just local React state.

## 5. Individual case-study template configurator

Add `Project Detail Defaults` under `/admin/configuration` with per-work-type templates and global defaults. Project-specific overrides stay in its own editor. Source design instructions are fully specified in `CURSOR_WORK_AND_CASE_STUDY_REDESIGN.md` and must be honored.

### Universal story flow

`Breadcrumb → Project title/type & one-line purpose → Real hero media → Short overview/role → Story/process chapters → Additional media/gallery → Verified matching client review if any → Related projects → Hire CTA`

The owner edits text/media/order from admin. Public empty or unsupported sections simply do not render; don't show sample placeholder claims.

### Available media-first presets

- Product Animation: primary optimized video + closeups, colorways, sequence stages.
- Installation Animation: process demonstration with numbered installation stages and supporting stills.
- Product Explainer: main video, system overview, inner mechanism, explanatory sequences; no invented technical metrics.
- Renders: one extremely clear hero still + high-res image sequence with real focal control and uncropped lightbox.
- Architectural: large room/space image or authentic walkthrough + option A/B/C variants, floor plan/360 only if files exist.
- Character Art: turntable video or approved GLB and front/side/back renders, variations, verified tech specs. Preserve user-supplied character description nuances.
- Unity/Unreal: actual gameplay/app video and screenshots, interactive features, engine/toolchain only if confirmed; external demo link when real.
- Web Interactive/Configurator: embedded demo only if safe and tested, otherwise attractive poster plus functioning `Open Live Demo` URL, feature/interaction steps.
- AR/VR: device/platform evidence, walkthrough video and interactions, store links where real; don't falsely claim every XR project used Unity.

### Media player and viewer behavior

- Video poster and skeleton before play; lazy after fold, `preload=metadata` for nearby media, muted autoplay only where sensible and allowed, multiple videos must not decode simultaneously.
- **Keep original aspect ratio**: square, 4:5, 16:9, ultrawide, and **Mini PC vertical 9:16**. Use `object-fit: contain` in detail/lightbox; avoid cutoff half-images or half-videos.
- Fullscreen image/video lightbox: no clipping, maintain focus, Escape closes, arrow keys change items, previous/next buttons, thumbnail strip optional, zoom/pinch as appropriate, restore original scroll/focus.
- Model viewer only for a real approved 3D asset. Configure URL, poster, environment, interaction hint, orbit limits, default camera, quality and fallback. Limit GPU cost and clean up renderer on unmount.
- Embedded demos: preserve aspect ratio, allow full-page demo, safe sandbox permissions, clear loading/error state, and external link fallback.
- Display review only if associated with canonical project; no inferred client names or automated quote rewriting.

## 6. Content ingestion and per-project text

**Do not ask Cursor to parse Word files.** Use the authoritative `work_portfolio_source_data.json`: it provides story sections, excerpts, overview, URLs, review IDs and source pages. The original DOCX files exist as optional proof. `PROJECT_INTEGRATION_TRIAGE.csv` lists each of the 32 source entries and its proposed category, review links, media hints and verification status.

Must preserve and use exact approved copy especially for ZERO Lifestyle smartwatch, Bang & Olufsen exploded speaker, VENTY tower fan, Air Purifier explainer, Mini PC assembly, Football Characters, Fox Girl (merge with existing), Michella family characters, and Game Creatures & Monsters. No independent client claims beyond supplied source.

Reconcile against the real live CMS. The 32 documents-derived records are **not a complete current production dump**; previously the public Work page had a larger collection. Never delete unmentioned live projects, change existing valid routes or duplicate already-inserted records.

### Import statuses

- `matched-existing` (stable record found; propose supplemental text/review evidence)
- `candidate-new-draft` (new authentic source, media not yet verified)
- `duplicate-review-needed`
- `unknown-engine-or-category`
- `missing-media`
- `review-only-evidence`

Generate migration dry-run table with confidence evidence before writing; ambiguous items remain in admin review queue. Do not publish automatically on import.

## 7. Data architecture (adapt, do not force new stack)

Suggested entities:

- `category`: stable ID, parent ID, label, slug, description, `sortOrder`, `visible`, `status`, default media, optional lead project, version.
- `project`: stable ID, canonical slug, title, rich content, client field, metadata, flags, canonical media refs, primary leaf category ID, status, SEO, updated time.
- `projectPlacement`: composite ID of project+category, `primary/secondary`, `sortOrder`, `visibleInWork`, `coverOverrideId`, `excerptOverride`, `featuredInCategory`; index by category+order; cannot point at missing project.
- `workPageConfig`: edited page text, active root category IDs/ordering reference, card presets, empty state, display preferences, SEO, draft/published revision.
- `projectPageLayout`: default layout by content type and optional per-project overrides, ordered block IDs and props.
- `mediaAsset`: original uploaded file key or existing external CDN URL, type, dimensions, aspect ratio, duration, poster, alt, rights, verified availability, version, usage references.
- `review`: original quote, rating if source-supplied, contract title, source screenshot and project association, publication/verification status, display order.
- `contentRevision`: author ID, timestamp, entity type+ID, diff or immutable snapshot, draft/published flag, rollback pointer.

DO NOT treat a category label or route slug as the unique stable identifier. Do not store a full duplicate project object in every page configuration. Keep image URL resolution in the existing media layer and support large-video CDN base URLs.

### Persistence + publication

Audit hosting platform; use existing durable database and storage. Immutable deploy/serverless runtime file writes must not be used as the sole persistent admin storage. Draft preview must be access-controlled, server-generated or tokenized safely, nonindexed and must never poison public caches. Publish should be atomic/validated; expire/invalidate correct public routes and cached records. Rollback to last known published version should be possible.

### Security

Every admin read/write API checks valid server-side session and role. Passwords not logged, stored in docs or shipped to browser. Sanitize rich text and links; server-validate uploaded media MIME/type/size; protect against CSRF as applicable; rate-limit login; use secure httpOnly session cookies; audit published changes; do not expose private draft media publicly. Avoid SSRF via untrusted media fetches. Never embed actual login credentials in tests or package files.

## 8. Per-page edit interactions — explicit acceptance scenarios

**Scenario A: Reordering main categories**
Admin visits Configuration > My Work; drags `Development` ahead of `Renders`; saves draft; preview shows changed root nav/section order; public `/work` unchanged; publishes; public changes; reload still saved. Project assignments and ranks unchanged.

**Scenario B: Reordering nested subcategories**
Within 3D > 3D Animation, moves `Product Explainer` first. Preview and public upon publish reorder the subcategory control. Project order inside Product Animation unchanged.

**Scenario C: Changing project category**
In Projects opens an existing item, changes primary leaf from one valid category to another and sets placement rank; sees warning and preview, saves draft and publishes; target Work filter includes it and old primary filter does not (unless explicit secondary placement); slug and detail page unchanged; media/reviews preserved.

**Scenario D: Secondary placement**
One Preat or Zaffiri project can appear under primary Renders and secondary Product Animation, without cloned case study or conflicting SEO canonical. Show unique count in All Work.

**Scenario E: Project cover override**
Choose a new media asset for a Work listing card only; project detail hero and homepage featured cover do not change unless separately edited.

**Scenario F: Per-project media-first detail**
Set a real hero video for an animation project, vertical video for Mini PC, and high-res hero still for render project; configure supporting image order, short text, 3D viewer only if GLB actually present; publish; verify aspect ratio & lightbox at all widths.

**Scenario G: Review association**
Attach genuine Preat client review to Preat case study; not to another project; preview and publish only after verification. Ratings-only record never shows invented quote.

**Scenario H: Undo/rollback**
Admin publishes a changed category rank then reverts; published public category order returns to prior version with no missing project data.

## 9. Tests and reporting

Use `IMPLEMENTATION_ACCEPTANCE_TESTS.md` as detailed QA criteria. Minimum viewport captures: 1440, 1280, 1024, 768, 390 and 360px on `/work`, three different content-type case studies, `/admin/configuration` and `/admin/projects`.

At minimum test category reorder, subcategory reorder, per-placement project reorder, primary category edit, secondary placement, cover overrides, project detail block order, review association, draft isolation, publish persistence, rollback, invalid references, media performance, keyboard and mobile nav. Run lint/typecheck/build. Report real observed failures and fixes rather than claiming tests not executed passed.

## 10. Required artifacts from Cursor

- `IMPLEMENTATION_AUDIT.md`: observed original behavior and exact UI/code issues, with screenshots.
- `MIGRATION_DRY_RUN.md`: matched, new draft, duplicate, ambiguous, missing media and review association counts with evidence.
- `IMPLEMENTATION_REPORT.md`: functionality delivered; changed source/migrations; screenshots/tests; any remaining server setup or blockers.

**End goal:** I can manage main categories and their order, nested subcategories and their order, independent project placements and their order, each project's exact text and high-resolution media, verified reviews and the entire Work page presentation—through the already existing admin, without writing code or changing the public theme.
