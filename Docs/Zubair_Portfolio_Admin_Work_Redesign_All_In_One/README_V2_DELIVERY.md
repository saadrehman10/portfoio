# Zubair Ali Portfolio — All-in-One Cursor Delivery V2

## Start here

1. Extract this ZIP **outside production**, into a safe project workspace or documentation folder alongside the existing portfolio repository. The included DOCX files/screenshot reference images are documentation assets, not assets to deploy in `public/`.
2. In Cursor Agent mode, paste the content of **`START_HERE_CURSOR_MASTER_PROMPT.md`**.
3. Ensure Cursor can access the original repository (not only the extracted ZIP). It must inspect the actual `/admin/configuration`, `/admin/projects`, `/work` and project routes.
4. Let Cursor complete the initial audit, safe dry-run migration, implementation and verification. Existing credentials should be used only via authorized secure session/environment, never pasted into source or scripts.

## Core files

- `START_HERE_CURSOR_MASTER_PROMPT.md` — master instruction to paste into Cursor.
- `ADMIN_CONFIG_AND_PROJECTS_DEEP_SPEC.md` — new admin UI and CMS implementation detail focused on the two URLs.
- `CURRENT_ADMIN_AUDIT_LIMITATIONS_AND_CHECKLIST.md` — what was not accessible externally, and what Cursor must actually verify.
- `CURSOR_WORK_AND_CASE_STUDY_REDESIGN.md` — original comprehensive public Work and case-study redesign prompt.
- `work_portfolio_source_data.json` — 32 document-backed projects and 26 reviews, subject to matching against existing CMS.
- `PROJECT_CATEGORY_MAPPING.csv` and `PROJECT_INTEGRATION_TRIAGE.csv` — category mapping proposals and import/verification priorities.
- `IMPLEMENTATION_ACCEPTANCE_TESTS.md` — QA checklist for admin, public pages, media and publishing.
- `ADMIN_DATA_MODEL_EXAMPLE.json` — example only, adapt to actual stack.
- `README_START_HERE.md` — earlier work package instructions.

## Original source materials

- `Project with reviews.docx` — project descriptions, links and review screenshots.
- `Product_Animation_Portfolio_Copy_5_Projects.docx` — five product-animation case studies.
- `Character_Art_Game_Character_Portfolio.docx` — football, Fox Girl, Michella and game creatures source.
- `previous_review_extraction.json` — earlier review extraction for cross-check.
- `reference-only-review-screenshots/` and `reference-only-character-doc-images/` — originals included **for source verification only**. Use approved full-quality media from the actual project library on public pages.

## Honest status of admin access

The browsing environment did not permit a logged-in inspection of the two protected admin pages or fetch the live site. Therefore this ZIP **does not claim to document the current admin's exact visible components**. It provides a specific audit-and-implementation contract to be executed against the repository that Cursor can access. User-provided admin credentials are deliberately NOT copied into any supplied file.

## What successful delivery looks like

- My Work configuration controls order of main categories, subcategories and projects independently.
- Projects manager controls actual category assignment, content, media, layout and review associations.
- Every project page is visual-first, category-appropriate, responsive and content accurate.
- Draft/preview/publish persists through the existing production architecture.
- Current theme, homepage, URLs, media and legitimate reviews are preserved.
