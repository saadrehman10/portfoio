# Implementation acceptance tests — don't mark unexecuted tests as passing

## Admin audit and security

- [ ] Current protected Configuration and Projects pages visually inspected after authorized login.
- [ ] Existing controls and storage mapped in `IMPLEMENTATION_AUDIT.md`.
- [ ] Unauthorized route and API calls denied; authenticated edits permitted.
- [ ] Credential values never placed in source, screenshots, logs, test fixtures or ZIP.
- [ ] Logout invalidates session; hidden/draft content not exposed publicly.

## Category hierarchy

- [ ] Existing main category IDs correctly mapped; four requested labels available and editable.
- [ ] Three-level hierarchy works for 3D > 3D Animation > Product Animation.
- [ ] Root order persists after draft/save, publish, page reload and restart.
- [ ] Sibling subcategory order persists independently of root order.
- [ ] Per-category project rank persists independently of other categories.
- [ ] Move-up/down accessible fallback works without drag-and-drop.
- [ ] Hiding a parent category has predictable effect without deleting project records.
- [ ] Circular parenting, duplicate sibling slugs and orphan categories rejected.
- [ ] Published category counts derived from actual unique published project IDs.
- [ ] All Work shows a multi-category project once; no duplicate route/card in All Work.

## Project editing and placement

- [ ] Search/filter project list and open edit form at `/admin/projects`.
- [ ] Change primary category in draft; preview and publish update Work listing.
- [ ] Add secondary category placement with independent position and cover.
- [ ] Canonical slug and existing route remain unchanged on category changes.
- [ ] Change homepage featured placement without deleting from Work.
- [ ] Set listing cover without affecting project detail hero.
- [ ] Gallery reorder edits one project's gallery, not global media.
- [ ] Invalid media/review references block publication with actionable error.
- [ ] Unsaved changes warning and save acknowledgment work correctly.
- [ ] Project creation, hide, unpublish, publish and rollback work.

## Individual project page

- [ ] Animation case uses genuine video, usable play/pause, poster, loading/error and replay controls.
- [ ] Vertical Mini PC (9:16) video remains fully visible without stretch/cutoff.
- [ ] Renders case keeps full-resolution image gallery with uncropped full-view lightbox.
- [ ] Architectural case presents full compositions and any actual option variants without clipping.
- [ ] Development case includes genuine gameplay/app media and valid demo links.
- [ ] Character case presents useful multiple angles; 3D viewer only for actual approved model.
- [ ] Keyboard Escape closes lightbox; previous/next arrows, focus return and zoom work as intended.
- [ ] At most appropriate media preload; no simultaneous dozen-video network load.
- [ ] Review displayed only on associated project and only when approved.
- [ ] A ratings-only record does not invent quote text.
- [ ] Related projects real, published and don't repeat current item.
- [ ] No lorem ipsum, invented client outcomes or dummy text on published public pages.

## Draft and publish

- [ ] Edits remain as drafts and do not appear on public site before publish.
- [ ] Draft preview reflects actual frontend, not separate unrelated mock UI.
- [ ] Publish validates all dependencies and fails atomically if invalid.
- [ ] Published update visible after expected cache regeneration/revalidation.
- [ ] Reload or production restart retains changes in durable store.
- [ ] Rollback restores previous revision without media/reference loss.

## Data import

- [ ] Existing published inventory enumerated before importing document-derived records.
- [ ] Dry-run shows exact matches, new draft candidates, ambiguous matches and missing media.
- [ ] Source Fox Girl/VRM merged with matching existing project; no duplicate.
- [ ] 32 supplemental records do not replace or reduce larger existing collection.
- [ ] 26 extracted review records matched to appropriate project/evidence status.
- [ ] Authentic content from two newest DOCXs used for nine source entries, with one overlap.
- [ ] Links and media validated before publication; source screenshots treated as evidence only.

## Viewports and performance

- [ ] Test browser screenshot for `/work`, representative case studies, admin Projects/Configuration at 1440×900.
- [ ] Repeat at 1280×800, 1024×768, 768×1024, 390×844, 360×800.
- [ ] No horizontal overflow, clipping, inaccessible nested nav, broken responsive media, sticky overlap.
- [ ] Work route remains navigable through categories and remembers filter/back state appropriately.
- [ ] `prefers-reduced-motion`, keyboard focus, image alt text and touch scrolling handled.
- [ ] Existing homepage and footer visual identity preserved and working.
- [ ] Lint, TypeScript, build and relevant end-to-end tests executed and reported with actual results.
