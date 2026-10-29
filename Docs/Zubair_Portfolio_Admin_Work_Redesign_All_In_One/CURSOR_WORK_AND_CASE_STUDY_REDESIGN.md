# CURSOR AGENT — WORK PAGE, PROJECT CASE STUDIES & ADMIN CONFIGURATOR REDESIGN

**Project**: Zubair Ali personal 3D and interactive development portfolio  
**Public website**: https://zubarirali.3dverse.io/  
**Work page**: https://zubarirali.3dverse.io/work  
**Admin entry**: https://zubarirali.3dverse.io/admin  
**Upwork profile**: https://www.upwork.com/freelancers/zubaira27  
**Primary structured data**: `work_portfolio_source_data.json` (included in this package)  
**Other source files**: `Project with reviews.docx`, `Product_Animation_Portfolio_Copy_5_Projects.docx`, `Character_Art_Game_Character_Portfolio.docx`, `previous_review_extraction.json`.

## Your role and objective

Act as a principal frontend/full-stack engineer, creative portfolio art director, interaction designer, and CMS architect. **Implement** a high-quality Work collection page, visually excellent individual case-study pages, and a secure, configurable admin system for managing the taxonomy, work ordering, project page layouts, real assets, and verified client testimonials.

The business goal is to make potential clients **experience the work first, understand the scope second, trust the execution third, and contact Zubair naturally**. This is a freelance portfolio, not an agency SaaS dashboard. The **work and media are the heroes**, not abstract visual decoration.

## Evidence and limits

The live website did not reliably expose its current rendered Work pages or authenticated admin views for an external automated audit. **You are operating inside the source repository**, so your first responsibility is to audit the actual app and browser render. Do not assume a screenshot, UI fault, category count, CMS capability, authentication implementation, or route shape that you have not verified.

The structured dataset is a source-backed content proposal, **not a verified dump of the current production database**. It contains 32 unique project records from three user-provided documents and a previous extraction, plus 26 previously extracted review records. The most recent DOCXs contribute five product animations and three additional character projects; the Fox Girl work overlaps with the prior fox/VRM record and MUST be merged, not duplicated. Some review-only records are not sufficiently detailed to publish as projects until completed.

The public website was previously observed with approximately 51 listed projects. **DO NOT overwrite or reduce that collection to 32**. Preserve every existing project and carefully merge these source records using stable IDs, slugs, titles, client names, URLs, and asset matches.

### Non-negotiable requirements

1. Preserve the current branding, color palette, fonts, visual identity, light/dark behavior (if present), navigation, homepage storytelling, and gradient footer.
2. Keep all existing published project URLs working. Use redirects if absolutely necessary when a slug changes; prefer no slug changes.
3. Preserve original source images/videos, media CDN configuration, project records, verified reviews, and published metadata. Do not delete/replace assets by guessing.
4. **Never crop important project media unintentionally**. Original aspect ratios, video posters, full-screen viewing, video loading and real 3D exploration are priority issues. Do not repeat the site's earlier problems of slow video startup or partially visible media.
5. All Work ordering, category tree, subcategory labels, project membership, media placement, gallery order, story blocks, review selections, and related projects must be editable in the admin and persist after publishing.
6. No invented clients, verified metrics, production specs, role claims, testimonial text, publication dates, project outcomes, media files, or fake working demos.
7. **Sample/dummy content is allowed ONLY in clearly labeled admin drafts and previews**. Never present dummy copy as a genuine public client case study. Public missing fields should be omitted gracefully.
8. Protect the admin with server-side authorization. Never hardcode passwords or client credentials or expose draft project information.
9. Do the work in the repository; do not stop at an outline. If any environment constraint prevents full completion, implement the largest safe working portion and list the exact blocker.

---

# PART A — FIRST: AUDIT THE ACTUAL REPOSITORY AND RUN THE SITE

## A1. Identify existing data and pages

- Locate Work listing route and shared project-card components.
- Locate project details route(s), data structures and gallery components. Existing routes have previously included `/work/character-anime`, `/work/explainer-configurator`, and `/work/explainer-app-animation` — check routes rather than assuming they are correct now.
- Inspect current 3D Animation / Renders / Architectural / Development categories and the real category-to-project mapping.
- Find current source of category/subcategory ordering. Determine whether it is hardcoded, JSON, database, config, etc.
- Open the actual admin Projects panel in a local browser with the existing authenticated development setup. Determine **whether** and **how** an admin can change a project's category today; document limitations before changing the architecture.
- Find any current configuration forms, project/category editors, media library and draft/publish mechanism. Extend them instead of building parallel CMS systems.
- Inspect media file availability, CDN URLs, video codecs, 3D viewer model formats, lazy loading, poster frames, lightbox/gallery implementation, video buffering and responsive object-fit rules.
- Examine the previous imported project/review JSON if already integrated and avoid duplicates.
- Verify the actual framework, routing, animation stack, state management, database, storage, and deployment path before deciding architecture.

## A2. Mandatory visual inspection

Run and visually inspect the current `/work`, at least one existing project in each main category, and `/admin/projects` + `/admin/configuration` on 1440px, 1024px, 768px, 390px, and 360px viewports (Playwright screenshots where possible).

Record in an `IMPLEMENTATION_AUDIT.md` file:

- Current category tree and category order.
- Actual project counts, published vs draft, mismatches and uncategorized records.
- How changing a project's category currently works (or does not).
- Listing issues: hierarchy, card proportions, visual prominence, hover behavior, alignment, project duplication, filters, navigation, pagination.
- Detail-page issues: image/video cropping, slow playback, low-res media, spacing, gallery viewing, meta text readability, review association, empty sections.
- Existing CMS features to preserve and reuse.

Then implement the improvements instead of stopping after the report.

---

# PART B — CATEGORY INFORMATION ARCHITECTURE

## B1. Exact top-level taxonomy and subcategory structure

Use the following **user-requested** top-level categories, with the labels edited and ordered through the admin. The tree may have THREE levels. Stable IDs must be independent of display labels.

**MAIN 01 — 3D**

- **3D Animation**
  - Product Animation
  - Installation Animation
  - Product Explainer
- **Character Art & Game Assets** — *proposed necessary addition* to represent character/creature work rather than mislabel it as animation
- **3D Modeling & Assets** — *proposed necessary addition* for modeling/AR-ready static assets

**MAIN 02 — Renders**

- Product Renders
- Hero Renders
- Lifestyle Renders
- Standalone

**MAIN 03 — Architectural**

- Interior & Exterior
- Interior
- Exterior
- Arch Viz

**MAIN 04 — Development**

- Unity
- Unreal
- Web Interactive & Configurators — *proposed necessary addition* for Web/PlayCanvas/browser configurators; do not misrepresent them as Unity/Unreal
- XR / Real-Time (Engine to Verify) — *admin-only staging category until engine classification is checked*

The proposed additions **must be editable**, not fixed in code, and may be renamed/hidden/reorganized by the owner. The requested categories remain the default public structure. In public navigation, don't expose unverified/admin-only categories.

### Semantics

- Each project has **one primary leaf category**, plus optional **secondary placements/tags**.
- Parent category pages automatically include unique projects from descendant categories; prevent double counting.
- If a project spans product rendering + animation, prefer one canonical project detail page appearing in more than one filter, not two cloned records.
- A character used in an Unreal project is not automatically classified as an Unreal *development* deliverable; evidence determines the primary classification.
- Do not classify an interactive PlayCanvas/WebGL/Three.js configurator under Unity or Unreal unless the actual engine is confirmed.
- Keep source-specific contract tags (e.g. Rigging / CGI / Rendering) as searchable disciplines, separate from the public hierarchical taxonomy.
- Handle missing category mappings with an **admin triage queue**, not a silently empty public section.

## B2. Proposed project mapping (MUST reconcile, not force)

Consult the JSON dataset for every record. Starting proposals:

| Primary category path | Matching source projects |
|---|---|
| 3D > 3D Animation > Product Animation | ZERO Lifestyle smartwatch; Bang & Olufsen speaker; VENTY tower fan; Mini PC; MNSTR Assoc jewelry |
| 3D > 3D Animation > Installation Animation | GooPlast construction / formwork installation sequences |
| 3D > 3D Animation > Product Explainer | Air Purifier; IntelliRoad tolling explainer; Macrovey machine animation (also AR context) |
| 3D > Character Art & Game Assets | Anime-Style Fox Girl/VRM (merge stylized-fox-vrm); Michella family characters; Game Creatures & Monsters (boss + mobs); Football Player Characters; Zebra mascot; AI Avatar Blendshapes; Photorealistic Character Rigging |
| 3D > 3D Modeling & Assets | Bordertown Retail FBX / AR-ready display assets; 3D Symbol and Logo |
| Renders > Product Renders | Zaffiri Precision visualization; Preat dental renders (also animation) |
| Renders > Standalone | Container Ship Rendering (verify actual media) |
| Architectural > Arch Viz | Creative Group event spatial concepts; DW Spectrum event booth visualization (tentative) |
| Architectural > Interior | Extra for Ceilings (tentative; verify) |
| Development > Unity | Artscapes AR; Dandy Shandy mobile game; VR House Walkthrough (review title references Unity; verify application implementation) |
| Development > Unreal | Football Player Characters as optional *secondary placement* based on the stated Unreal workflow; do not claim gameplay coding |
| Development > Web Interactive & Configurators | Engo Planet / Blue Bird; Adam AI architectural configurator |
| Development > XR / Real-Time (Engine to Verify) | Ski Patrol VR Rescue Training; Photon VR Meeting (and other XR work with engine not confirmed) |
| Needs review | HEXANEST PRODUCTION review-only record; any project whose scope/category cannot be established |

Use the real published inventory too. Any public projects absent from the provided documents must remain in the Work database with existing content, media, and routes. Do not show empty labels merely because user supplied a taxonomy with no matching source project.

---

# PART C — REDESIGN `/work` AS A CLIENT-FIRST EXPERIENCE

## C1. Core principle

The Work page is not an undifferentiated wall of 50+ cards. It should feel like a carefully art-directed, high-performing digital gallery with instant understanding of: (1) the main expertise areas; (2) the sub-specialties; (3) the strongest real work in each; (4) how to inspect each project.

## C2. Exact page copy

**Eyebrow:** SELECTED & COMPLETE WORK

**H1:** Work, made to be experienced.

**Introduction:** Explore 3D animation, product imagery, architectural visualization, and interactive development. Every project is a different way of making an idea clearer, more engaging, or easier to explore.

**Section utility label:** EXPLORE BY DISCIPLINE

**Root category titles and intros:**

- **3D** — *From the first shape to the final frame.* Character work, product animation, technical storytelling, and game-ready assets built with attention to form and motion.
- **Renders** — *Every surface has a story.* Carefully composed CGI images for products, campaigns, and visual presentations, where lighting and material detail matter.
- **Architectural** — *Spaces before they exist.* Interior, exterior, and spatial visualizations that help people understand a place, explore options, and imagine the result.
- **Development** — *Beyond looking. Into interacting.* Unity, Unreal, AR/VR, and browser-based experiences that let users play, explore, configure, and learn.

**Search placeholder:** Search projects, clients, or skills

**Empty result text:** No projects match these filters. Try a different category or search.

**CTA heading:** Have something similar in mind?

**CTA description:** From a product visualization to an interactive experience, I can help turn your brief into a project worth exploring.

**Primary CTA:** Hire Me on Upwork (https://www.upwork.com/freelancers/zubaira27)

**Secondary CTA:** Back to All Work

All of these strings must be editable as Work page settings from the CMS, not embedded indefinitely in JSX.

## C3. Layout and interaction plan

**Intro / category selector:** Strong editorial headline; restrained intro; visual category controls that clearly show 3D / Renders / Architectural / Development. Use existing theme colors, typography, and gradient identity. Do not make another animated full-screen hero that delays access to the work.

**Main navigation:** Top-level category pills/tabs or clear segmented nav, sticky only if it does not conflict with the site's global header. Render a secondary category path/navigation for the active main category. For 3D, permit navigating to `3D Animation` and then its product/installation/explainer leaf filters. Provide breadcrumbs and one-click reset to `All Work`. Avoid exposing too many levels simultaneously on small screens; support a compact accessible selector.

**Editorial lead:** Show one large, configurable genuine project in the active category (if assigned), then the rest of the projects in a flexible gallery. Lead can be disabled per category from admin. The lead project's media and associated layout are fully configurable.

**Gallery:** Use an art-directed grid with predictable reading order, not random masonry that cuts media. Typical desktop: 2–3 columns for cards, with a special full-width lead. On tablet 2 columns; on mobile 1 column. Size card media by configured ratio (portrait, square, landscape), preserve subject visibility and allow the admin to set focal point. Use image and video posters consistent with media dimensions. No hover-only essential information on touch devices.

**Card essentials:** Project cover/preview, title, short accurate excerpt, category/subcategory, optional real client label, CTA `Explore Project`. Strong visual contrast and readable overlay; do not place 5 UI badges over the art. Use video preview on hover/focus or in-view ONLY if muted, optimized, and budgeted; always show poster on slow connections or reduced motion.

**Browsing functions:** Search, category/subcategory filters, optional skill tags; dynamic category counts; filtered-state URL/query params where supported; back-button restoration of filter/scroll position; keyboard navigation; lazy incremental loading/pagination for large galleries; accessible no-results state; route prefetch only where helpful.

**Scroll:** Native vertical scrolling remains in control. Subtle transitions and pinned category nav permitted, but no mandatory snapping, autoplay endless motion, scroll hijacking, or huge blank scrollytelling sections. Most importantly, make the media easy to inspect.

---

# PART D — REDESIGN INDIVIDUAL PROJECT PAGES AS MEDIA-FIRST CASE STUDIES

## D1. Universal page narrative

`Breadcrumb → Project Identity → Main Media → Concise Overview → Detail / Process Sections → Additional Media → Genuine Review (if associated) → Related Work → Hire CTA`

User should see the actual image/video/demo *immediately*. Don't force a client to scroll past a massive generic heading, many paragraphs, or unnecessary effects before seeing the work.

### Universal fields and exact generic copy

- Breadcrumb: `Work / {Main Category} / {Subcategory} / {Project}` (real links)
- Eyebrow: `{Category} / {Subcategory}`
- H1: `{Actual project title}`
- Dek/tagline: `{Project-specific approved tagline}`; omit if unknown
- Summary: `{Project-specific cardExcerpt or source overview}`
- Metadata labels: `CLIENT`, `MY ROLE`, `SERVICES`, `DELIVERABLES`, `TOOLS`, `PLATFORM`, `YEAR` — show only values actually supplied and approved; no blank dashes for unsupported fields
- Story section label: `BEHIND THE WORK`
- Media gallery label: `A CLOSER LOOK`
- Testimonial section label: `WORDS FROM THE CLIENT`
- Related section: `EXPLORE MORE WORK`
- Final CTA: `Have a project like this in mind?` / `Let's discuss how to bring it to life.` / `Hire Me on Upwork`

A project detail page should NOT contain generic lorem ipsum, fabricated challenge/result metrics, or empty filler headings. Placeholders can be used in admin preview as `[SAMPLE — REPLACE BEFORE PUBLISH]`, never on the published page.

### Responsive media behaviors — crucial fixes

- Render images with `object-fit: contain` in full-screen/lightbox; cover crops only for an explicit art-directed thumbnail with focal position.
- Preserve native aspect ratio in long-form article blocks: 16:9, 9:16, square, ultrawide, 4:5, etc. The **Mini PC source is specifically vertical**; don't stretch/crop into a horizontal video.
- Desktop hero media fills an elegant well-aligned layout; scale media to actual intrinsic ratio without ugly black empty bands when feasible.
- Videos: true play/pause and mute controls, visible loading/error states, poster-before-play, click to replay, keyboard controls, `playsInline`, responsive `preload=metadata` for likely-to-play items, lazy below-fold loading, and lazy hydration where appropriate.
- Autoplay only muted + inline, when viewport conditions allow, and never at the cost of page speed. Prefer deliberate user play for full case-study videos. Avoid simultaneous autoplaying video backgrounds.
- Gallery: scroll-friendly image/video sequence with captions, thumbnail strip if useful, click to open uncropped lightbox, next/previous, keyboard Escape and arrow keys, pinch zoom or zoom support, no partial-modal clipping, backdrop close, body scroll locking and focus restoration.
- 3D Viewer: available only for authentic approved GLB/GLTF/other supported models; configure model URL, poster, camera orbit/default view, lighting/environment, interaction hint, auto-rotate opt-in, loading fallback, context-loss fallback, renderer cleanup and performance cap. Don't fake an interactive 3D viewer by turning rendered screenshots into a pretend 3D demo.
- Embed / live demo: provide a clear `Open Live Experience` external link; use iframe only for trusted allowlisted origins, with explicit permission, security and responsive aspect; don't embed third-party pages that block framing. Do not rehost unauthorized media from Drive or client websites.
- Media errors should show a graceful retry / fallback instead of blank panels.

## D2. Category-specific case-study templates

### TEMPLATE 1 — 3D Animation (Product / Installation / Explainer)

**Above fold:** Video hero with proper poster and playback; strong title, one-line result/purpose, short supporting description, client/discipline. 

**Body:** Overview → `What the animation communicates` (three source-based chapters) → sequence stills / closeups → optional modeling/material/exploded-process breakdown → full animation or replay (if desired) → matching verified review → related animations → Hire CTA.

- **Product animation:** product silhouette, material detail, colorways, camera/lighting and visual pacing. Use ZERO Lifestyle, Bang & Olufsen, VENTY and Mini PC copy from supplied dataset.
- **Installation animation:** use process phases, clearly numbered installation/assembly demonstrations; GooPlast has authentic source text about structural installation, reinforcement and concrete-pour visualization. Do not invent engineering claims.
- **Product explainer:** show `Overview / Inside / How it works / Result` visual sections, but exact labels must match source/project. Air Purifier has an approved visual concept description but **no validated performance specs**.

### TEMPLATE 2 — Renders (Product / Hero / Lifestyle / Standalone)

**Above fold:** A full-width high-resolution still render—no generic video player if the only output is a still. 

**Body:** Short overview, 2–4 gallery groupings (e.g., Hero Image, Detail Frames, Material Studies, Context or Colorways), optional side-by-side compare if authentic before/after versions exist, limited production notes, genuine review, related render galleries.

Prioritize large image presentation, sharpness, and direct lightbox viewing. Each image can have independent caption, background, focal point, aspect ratio and lightbox order.

### TEMPLATE 3 — Architectural (Interior / Exterior / Interior & Exterior / Arch Viz)

**Above fold:** Full-bleed environment render / walkthrough (choose based on actual media). 

**Body:** Project context → spatial goals and approach → image-led room/angle/scene chapters → optional floorplan with real drawings → optional 360/VR walkthrough if actual asset exists → multiple design options/variants (Creative Group A/B/C) → relevant review → related architectural work.

Use an art-directed spacious layout that shows the whole space. Avoid cropping away walls, ceiling, focal architecture, furniture or scene edges in detail view. Preserve exact source project roles.

### TEMPLATE 4 — Development (Unity / Unreal / Web Interactive / AR-VR)

**Above fold:** Demonstration reel / gameplay video or true live demo plus a concise explanation of *what the visitor can do*. 

**Body:** The brief → interactive features → controls/flow → screenshots or in-app video → verified technology stack (Unity, C#, Unreal, Vuforia, ARKit etc only when sourced) → real app/store/demo links → genuine review → relevant interactive projects.

- Artscapes has Unity3D/C#, Vuforia, ARCore/ARFoundation, ARKit sourced.
- Dandy Shandy source contains an Android Play Store link and mobile game demo.
- Engo Planet / Blue Bird is interactive browser visualization / PlayCanvas URL — **do not claim Unity/Unreal**.
- Adam AI is an architectural configurator with live demo and floor-plan input links — platform stack unknown unless repository verifies.
- XR/VR examples may have unknown underlying engines — omit engine badges or place in admin review queue.

### TEMPLATE 5 — Character Art & Game Assets (needed addition)

**Above fold:** Highest-quality approved full-body or lineup render; genuine turntable video or real 3D viewer if available.

**Body:** Character overview → silhouette/roster → front/back/side or pose/gallery → sculpt/modeling and material detail → rigging/VRM/deformation if evidenced → engine target/constraints only where confirmed → matching review → related character work.

- Football UE: realistic player builds, clothing/uniform, materials, deformation.
- Fox Girl: anime style, maximum 50K polygons, VRM rigging; merge duplicate.
- Michella: family-reference character recreation; honor reference photo privacy/usage rights.
- Game Creatures: bosses (crocodile monster / dinosaur fantasy / dragon-like flying creature) and mobs (Witch / Realm Knight / The Chaplain / Xanthrikrok / Alian / Monkey) within one organized roster.

## D3. Layout composition rules

Use the current font and brand palette. Respect a repeatable content grid. Desktop: large main media and narrow complementary metadata column where helpful, not a rigid 50/50 split on every page. Editorial, premium negative space; captions beneath associated media; alternating text/image composition only when it enhances reading. Mobile: stack, show visual first, no sticky sidebar blocking content. Limit text width and avoid enormous unbroken copy.

No massive gradient blocks or unrelated 3D effects inside the case study. The actual project is the visual hero.

## D4. Client review placement

- Each project can have 0..n **verified, associated** reviews. Use `reviewIds` from dataset and the previous source screenshots as evidence.
- If 0 reviews, omit the testimonial section entirely.
- If a review is truncated in screenshot (`Show more`), do not invent unseen text; only use captured verified extract.
- Show short real quote, true rating if sourced, exact contract title when appropriate, and truthful attribution `Verified feedback from a completed Upwork contract` ONLY if verification state truly supports that wording; otherwise `Client feedback`.
- Do not display a generic rotating unrelated review on a specific project page.
- Multiple legitimate reviews for one project may use a short controlled carousel; no autoplay.
- Review screenshots are evidence in admin, **not** a replacement for polished public testimonial cards.

---

# PART E — ADMIN CMS / CONFIGURATOR FOR WORK & INDIVIDUAL PROJECTS

This admin scope is as important as the redesign. **No hardcoded category/order/project gallery arrays as the new source of truth.** Extend the existing admin rather than creating a competing application.

## E1. Top-level admin navigation

Follow existing admin conventions, but ensure these distinct areas:

- Dashboard / Overview
- **My Work Page** / Work Configuration
- **Categories & Subcategories**
- **Projects**
- **Reviews**
- Media Library
- Homepage Configuration (existing)
- Services / About / Contact / Global (existing)

If using top tabs as previously requested, do not bury Work configuration under a project editor. Allow direct navigation among pages with active indication and mobile overflow handling.

## E2. My Work Page Configurator

Settings groups:

**Page introduction**: eyebrow, H1, intro, CTA copy, header media (optional), SEO/social fields.

**Main-category order:** drag-and-drop 3D, Renders, Architectural, Development. Must **persist**; support keyboard Move Up/Down alternatives. Each category has status (published/hidden), title, slug or stable route ID, description, optional intro media, lead project selection, and visual style preset.

**Subcategory tree:** expandable, reorderable tree (up to 3 levels), labels, descriptions, aliases, publish/hidden, parent selection, optional lead project. Prevent cycles and orphaned records. Ensure moving a node updates inherited ancestors and navigation safely.

**Project positions within each category:** searchable selectable list with thumbnail, status, primary category, placements, rank, featured, card media and CTA. Drag sort for a selected category; optionally sort by manual/latest/title but ensure manual rank wins when selected. **Separate category rank from project rank**.

**Project visibility:** published vs draft, visible on Work listing, featured on Homepage, featured in category, eligible for Related Work. Hiding from Work must not delete project or media. Preserve URL / SEO semantics for publish vs listing visibility.

**View controls:** display lead project, grid density presets, video preview behavior, filters search, page CTA, `All Work` and mobile header behavior.

**Preview & Publish:** live/draft previews desktop/tablet/mobile, unsaved-change warning, explicit Save Draft / Publish / Discard / Restore. Changes in category order, subcategory order and project rank immediately preview and affect production only after publish.

**Category change from project manager:** In `/admin/projects/[id]`, clearly editable PRIMARY category (tree picker) and SECONDARY placements (multi-select), with validation and explanation. When moving between categories, show downstream effects and don't wipe manual positions in other unrelated categories. Publish via same draft workflow.

## E3. Project Case Study Configurator

Each project's editor needs subtabs (names can adapt to existing UI):

1. **Overview**: Title, client/project label, slug, one-line tagline, card excerpt, long overview, discipline tags, real role, deliverables, verified year, project status, primary/secondary category, SEO.
2. **Hero & Covers**: Work-card image/video poster; detail-page hero image/video/3D viewer; per-placement override; desktop/mobile selection; object-position; display ratio; `contain` vs intentional cover; player settings.
3. **Story Blocks**: A structured, draggable visual page builder with a SAFE subset: `richText`, `fullBleedImage`, `imageWithText`, `video`, `mediaGrid`, `imageComparison`, `captionedGallery`, `3DViewer`, `liveDemoLink`, `trustedEmbed`, `technicalHighlights`, `stat` (ONLY verified values), `quote`, `divider`, `spacer` (bounded), `clientReview`, and `relatedProjects`.
4. **Media Gallery**: Add from canonical Media Library; upload if authorized; drag order; alt text, captions, focal points, filename/size/format, linked project and CDN/storage URL, poster/preview, responsive behavior, library references.
5. **Reviews**: attach existing verified review(s) by reference; unassign; review display order, visibility, evidence link, citation/contract label. Do not create bogus public review content.
6. **Related Work**: explicitly curated list or safe fallback by genuine matching taxonomy, sorted and editable.
7. **Links & CTA**: client site, store listing, verified live demo, source video, preview assets, Upwork hire button; validate URL protocol, no dead placeholders.
8. **Preview & Publish**: validation checklist, preview against actual frontend renderer, publish and restore.

The section list must be **per-project configurable**, so an animation project can lead with a video, a renders project can be an immersive image gallery, an architecture project can show floor plans and large spatial scenes, and a Unity/Unreal project can lead with gameplay or an actual demo. Avoid forcing all projects into the same repetitive card layout.

## E4. Architecture and data model

Suggested relational/entities approach, adapt to current stack:

- `categories`: id, parentId, slug, name, description, order, visibility, status, editorialLeadProjectId, mediaRef; allow up to 3 levels; cycle-proof.
- `projects`: stable id, slug, title, client, content, tags, status, primaryCategoryId, publishedAt, SEO, canonical media refs.
- `project_category_placements`: projectId, categoryId, optional secondary placement, listingVisible, manualRank, categoryCardMediaOverride, cardExcerptOverride.
- `page_work_config`: header text, tabs, gallery display presets, categoryId order, featured leads, CTA, SEO, draft/published versions.
- `project_page_blocks`: projectId, unique id, type, order, visibility, props, mediaRef IDs; validated against schema.
- `media`: id, kind, dimensions, duration, aspect ratio, URL/storage key, preview/poster, license/public permission status, association counts, alt/caption.
- `reviews`: id, projectId, original source/title, quote, screenshot evidence, rating, verified flag, publication state, createdAt if known.
- `content_revisions`: draft/published revision, author, timestamps, diffs or snapshots and rollback.

Use the existing DB/storage/JSON architecture where suitable. **Production persistence cannot rely on writing mutable files into a serverless deployment.** Ensure authorization and atomic publish semantics; revalidate or regenerate relevant public pages after publish.

## E5. Import and migration requirements

1. Load `work_portfolio_source_data.json` and existing CMS data.
2. Generate a dry-run migration report before writes: matched, new, ambiguous, source-only, media-missing, review-association, and category-unverified.
3. Match using stable IDs/slugs, existing URLs, normalized title/client, review links and media signatures; no unsafe fuzzy duplicate overwrite.
4. Apply approved copy to matched records without replacing existing stronger verified content or media without clear owner approval.
5. Add genuinely new records as **draft** until their approved media and rights are confirmed.
6. Merge Fox Girl with the existing stylized-fox/VRM project, not as a second project.
7. Preserve every existing published route and media reference. Handle `redirects` if slugs are changed.
8. Do not automatically claim all 26 reviews are already verified/published. Maintain proper evidence and review moderation status.
9. Rebuild category counts from actual normalized data, never hardcode previous observed figures.
10. In admin show a reconciliation table for ambiguous projects and missing media; admin owners can resolve.

## E6. Admin UI specifics

- Desktop category tree (left) + reorderable projects (center) + contextual preview/settings (right) if room permits. Avoid dense 3-column layout on 1024px; collapse preview to drawer/panel.
- Clear Move/Sort indicators, drop targets and explicit draft/save/publish state.
- `Add Category`, `Add Subcategory`, `Assign Project`, `Change Category`, `Use as Category Lead`, `Choose Cover`, `Preview Page` actions.
- Reusable media picker with search, type/aspect filter and usage tags; selecting a cover never deletes physical media or changes unrelated placements.
- Warnings for changing published category URLs, deleting a category with children, hiding currently featured work, using a broken demo link, or invalid video asset.
- Audit log of real edits and migration sources, no fake analytics.
- Browser-accessible tests with permissions; protected admin routes and server endpoints.

---

# PART F — SOURCE CONTENT TO INCLUDE

The file `work_portfolio_source_data.json` is the canonical extracted source payload. **Use the actual `overview`, `cardExcerpt`, `tagline`, `storyBlocks`, `closingLine`, `services`, URLs, reviewIds, taxonomyProposal and source metadata**; do not ask the user or Cursor to re-extract the DOCX.

### Exact new product project copy (5 cases)

1. **ZERO Lifestyle — Smartwatch Colorway Animation** — *One design, multiple expressions.* Details: casing/screen/silhouette; multiple colorways; coordinated closeups and wider product compositions. Source client URL: https://zerolifestyle.co. Primary: 3D > 3D Animation > Product Animation.
2. **Bang & Olufsen — Exploded-View Speaker Animation** — *Every layer, thoughtfully revealed.* Details: internal exploded components, material details, cinematic hero shots. Source client URL: https://bang-olufsen.com. Primary: Product Animation; optional Product Explainer secondary.
3. **VENTY — Tower Fan Product Animation** — *Airflow meets atmosphere.* Details: warm interior lighting, grille/silhouette, illuminated base/display, hero reveal. Source product URL: https://ventyfan.com/products/tower-fan. Primary: Product Animation.
4. **Air Purifier — Product Explainer Animation** — *Inside the product. Through the process.* Details: exploded filtration assembly, moving particles, explanatory motion; **no unverified filtration-performance claim**. Client URL not provided. Primary: Product Explainer.
5. **Mini PC — Cinematic Assembly Animation** — *Small form factor. Detailed construction.* Details: floating components, board/connectors, assembly sequence, macro shots; video is **vertical**, preserve aspect ratio. Client URL not provided. Primary: Product Animation.

### Exact character project copy (3 new + 1 overlap)

6. **Football Player Characters for Unreal Engine** — realistic player roster, cornerback/running back/lineman body variation, skin/hair/materials, clothing deformation and uniform variants. Primary: Character Art & Game Assets; optional Unreal secondary.
7. **Anime-Style Fox Girl — Modeling & VRM Rigging** — stylized silhouette, layered costume, actual max **50,000-polygon** constraint, VRM rigging. **Merge into existing `stylized-fox-vrm`.** Primary: Character Art & Game Assets.
8. **Michella — Stylized Family Characters for Animation** — photo-based stylized family cast, costumes/hairstyles/identities and consistent animation character look. Primary: Character Art & Game Assets. Protect private reference image rights.
9. **Game Creatures & Monsters — Bosses and Mobs** — bosses: crocodile, dinosaur fantasy, flying dragon-like creature; mobs: Witch, Realm Knight, The Chaplain, Xanthrikrok, Alian, Monkey. Primary: Character Art & Game Assets. Group as one project with two gallery chapters unless actual CMS indicates separate existing projects.

### Prior project and client reviews to preserve

Source record IDs (24): `creative-group-events`, `stylized-fox-vrm`, `zaffiri-precision`, `adam-ai-architectural-configurator`, `mnstr-assoc`, `bordertown-retail`, `gooplast`, `artscapes-ar`, `ai-avatar-blendshapes`, `photorealistic-character-rigging`, `macrovey-ar-machine`, `ski-patrol-vr`, `vr-house-walkthrough`, `dw-spectrum-showcase`, `photon-vr-meeting`, `dandy-shandy`, `zebra-mascot`, `preat-dental`, `intelliroad-explainer`, `engo-bluebird`, `hexanest-production`, `3d-symbol-logo`, `extra-ceilings`, `container-ship-render`.

Source review record IDs (26): `r01`–`r26`. Each exact review record contains the quoted review text if captured, rating, Upwork contract title, evidence image filename, and projectId. Preserve the source screenshot in admin evidence when available. **Ratings-only reviews must never generate made-up quote copy.**

Notable examples for case-study evidence:

- Creative Group: spatial concepts, A/B/C alternatives, ongoing event visualization, 2 feedback records.
- Zaffiri Precision: 5,000+ product renders with automated pipeline **as stated in the supplied user document**, two feedback records; use with correct scope and no extra results.
- MNSTR Assoc: 360° jewelry render/animation, matched feedback.
- Bordertown Retail: AR-ready FBX retail rack/display assets, two feedback records; don't claim building client AR platform.
- Preat: dental technology product renders and animation, a long positive review.
- Engo Planet/Blue Bird: browser-based interactive solar-product configurator, actual PlayCanvas URL, review.
- Artscapes: Unity3D+C# mobile AR, Google Play and App Store links, review.
- Dandy Shandy: mobile Unity game / Play Store/demo evidence, review.
- Ski Patrol VR: medical-response training simulation, with CPR/basic checkup/bandaging/stretcher/helicopter sequence per document, review; engine not confirmed.

All detailed text, external links, file names and evidence associations are in the included JSON. **Do not rewrite them from memory or invent missing copy.**

---

# PART G — REQUIRED TECHNICAL / UX TESTS

1. Test `/work`, main-category selector, nested filters, category ordering, case-study pages on 1440, 1024, 768, 390 and 360 widths.
2. Test all existing slugs still resolve; new projects in draft do not surface publicly until published.
3. Validate no lost original media, bad thumbnails, cropped full-screen art, blank 3D viewer, incorrect model loading, broken poster links, mobile overflow or video loading stalls.
4. Verify video player play/pause, mute, poster, load/error/replay behavior and no simultaneous media overload.
5. Verify gallery lightbox (uncropped at all aspect ratios), keyboard, Escape, focus return, swipe and touch close.
6. Verify 3D viewer only loads on-demand, controls work, resize/dispose/cleanup and fallback states work.
7. Verify route navigations, breadcrumbs, filter back navigation, related project links, store and external links.
8. Verify project/category/subcategory reorder in admin, persisted ranks, category count updates, change of primary category, secondary placements, hidden/unpublished logic, and safe rollback.
9. Verify case-study block builder, media overrides and selected review associations update the public page after explicit publish.
10. Verify SEO title/description, alt text, semantic heading hierarchy, color contrast, accessible keyboard navigation, reduced motion, CWV/LCP and media loading budget.
11. Verify auth, authorization on every admin mutation, secure uploads, data validation and draft preview access controls.
12. Run lint, type-check, unit/integration tests, production build, and existing end-to-end tests. Add high-value automated tests for taxonomy ordering, migrations and media gallery behavior.

## Delivery report

At completion produce:

- Actual current UI findings from screenshots, with page URL/viewport and before/after where available.
- Exact category tree implemented and how it compares to previous categories.
- Mapping table for every existing project and each source import (matched/new/needs review).
- Correctly preserved old slugs and new draft records.
- Visual explanation of Work and individual category-specific case-study templates.
- Admin routes and live config interactions added or reused.
- Data schema, migrations, draft/publish persistence and rollback behavior.
- Files changed, tests run and their results.
- Unresolved media or content gaps in an editable admin review queue.

**Implement, validate, and deliver production-ready code within the current repo and architecture. Don't just generate a static mockup.**
