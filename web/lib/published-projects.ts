import type { Project, ProjectCategory } from "./content";
import { categoryGroups } from "./content";
import { mergeProjectSummary } from "./project-client-details";
import { readCustomProjects } from "./custom-projects";
import { readProjectOverrides, type ProjectOverride } from "./project-overrides";
import { decorateProjectCategory, getBaseProjects, getBundledProjects } from "./projects-base";
import { homeFeaturedCategoryOrder, readSiteConfig } from "./site-config";
import type { AdminProjectRow } from "./admin-project-types";
import {
  applyMediaVisibility,
  hiddenMediaSet,
  readMediaVisibility,
} from "./media-visibility";
import {
  getRatingOnlyForSlug,
  getReviewsByIds,
  getReviewsForSlug,
  type PortfolioReview,
} from "./portfolio-reviews";

export type { AdminProjectRow } from "./admin-project-types";

function mergeOne(
  project: Project,
  override?: ProjectOverride,
  isCustom = false,
): AdminProjectRow {
  const active = override?.active ?? true;
  const category = override?.category ?? project.category;
  const decorated = category === project.category ? project : decorateProjectCategory(project, category);
  const media =
    Array.isArray(override?.media) && override!.media.length > 0
      ? override!.media.map(String)
      : decorated.media;
  const cover =
    override?.cover && media.includes(override.cover)
      ? override.cover
      : media.includes(decorated.cover)
        ? decorated.cover
        : media[0] ?? decorated.cover;
  const title = override?.title?.trim() ? override.title.trim() : decorated.title;
  const summary = override?.summary?.trim() ? override.summary.trim() : decorated.summary;
  const role = override?.role?.trim() ? override.role.trim() : decorated.role;
  const reviewIds = Array.isArray(override?.reviewIds) ? override!.reviewIds.map(String) : null;

  return {
    ...decorated,
    media,
    cover,
    title,
    summary,
    role,
    active,
    reviewIds,
    isCustom,
    pageHeadline: override?.pageHeadline?.trim() || undefined,
    pageOverview: override?.pageOverview?.trim() || undefined,
    storyBlocks: Array.isArray(override?.storyBlocks)
      ? override!.storyBlocks
          .map((block) => ({
            title: String(block.title ?? "").trim(),
            body: String(block.body ?? "").trim(),
          }))
          .filter((block) => block.title || block.body)
      : undefined,
    ctaLabel: override?.ctaLabel?.trim() || undefined,
  };
}

export async function getAdminProjectRows(): Promise<AdminProjectRow[]> {
  const [{ overrides }, customStore] = await Promise.all([
    readProjectOverrides(),
    readCustomProjects(),
  ]);
  const customSlugs = new Set(customStore.projects.map((project) => project.slug));
  return getBaseProjects(customStore.projects).map((project) =>
    mergeOne(project, overrides[project.slug], customSlugs.has(project.slug)),
  );
}

function publishRow(
  {
    active: _a,
    reviewIds: _r,
    isCustom: _c,
    pageHeadline: _ph,
    pageOverview: _po,
    storyBlocks: _sb,
    ctaLabel: _cta,
    ...project
  }: AdminProjectRow,
  hiddenMedia: Set<string>,
  bundledSlugs: Set<string>,
): Project {
  const visible = applyMediaVisibility(project, hiddenMedia);
  if (!bundledSlugs.has(visible.slug)) return visible;
  const base = getBundledProjects().find((entry) => entry.slug === visible.slug);
  // Keep admin-edited copy; only auto-enrich when summary was left as the base text.
  if (base && visible.summary === base.summary) {
    return mergeProjectSummary(visible);
  }
  return visible;
}

export async function getPublishedProjects(): Promise<Project[]> {
  const [rows, visibility] = await Promise.all([getAdminProjectRows(), readMediaVisibility()]);
  const hidden = hiddenMediaSet(visibility);
  const bundledSlugs = new Set(getBundledProjects().map((project) => project.slug));
  return rows
    .filter((project) => project.active)
    .map((row) => publishRow(row, hidden, bundledSlugs));
}

export async function getPublishedProject(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectPageReviews(slug: string): Promise<{
  reviews: PortfolioReview[];
  ratingOnly: PortfolioReview[];
}> {
  const { overrides } = await readProjectOverrides();
  const override = overrides[slug];
  if (Array.isArray(override?.reviewIds)) {
    return {
      reviews: getReviewsByIds(override.reviewIds),
      ratingOnly: getRatingOnlyForSlug(slug),
    };
  }
  return {
    reviews: getReviewsForSlug(slug),
    ratingOnly: getRatingOnlyForSlug(slug),
  };
}

export { projectsByCategoryList } from "./project-ordering";

export async function getFeaturedPublishedProjects(): Promise<Project[]> {
  const [published, siteConfig] = await Promise.all([getPublishedProjects(), readSiteConfig()]);
  const categoryOrder = homeFeaturedCategoryOrder(siteConfig);
  const max = siteConfig.maxHomeFeatured;
  const picked: Project[] = [];
  for (const category of categoryOrder) {
    const match = published.find((project) => project.category === category);
    if (match) picked.push(match);
  }
  if (picked.length < max) {
    for (const project of published) {
      if (picked.length >= max) break;
      if (!picked.some((p) => p.slug === project.slug)) picked.push(project);
    }
  }
  return picked.slice(0, max);
}

export async function getWorkPageLayout() {
  const { resolveWorkLayout } = await import("./site-config");
  const config = await readSiteConfig();
  return resolveWorkLayout(config);
}

export async function getDashboardStats() {
  const rows = await getAdminProjectRows();
  const active = rows.filter((r) => r.active);
  const byCategory: Record<string, number> = {};
  for (const leaf of categoryGroups.flatMap((g) => g.sections)) {
    byCategory[leaf.id] = active.filter((r) => r.category === leaf.id).length;
  }

  const { buildMediaCatalogWithVisibility, mediaStats } = await import("./cms/media-catalog");
  const { getWrittenReviews, getHomepageReviews } = await import("./portfolio-reviews");
  const { readEditableSiteConfig } = await import("./site-config");
  const media = mediaStats(await buildMediaCatalogWithVisibility());
  const editable = await readEditableSiteConfig();
  const homepage = editable.config.homepage;
  const featuredSlugs = homepage.featuredProjects.filter((item) => item.enabled).map((item) => item.slug);
  const missingCovers = active.filter((project) => !project.cover).length;
  const brokenFeatured = featuredSlugs.filter((slug) => !rows.some((row) => row.slug === slug));

  return {
    total: rows.length,
    active: active.length,
    hidden: rows.length - active.length,
    byCategory,
    mediaImages: media.images,
    mediaVideos: media.videos,
    mediaTotal: media.total,
    writtenReviews: getWrittenReviews().length,
    homepageReviews: getHomepageReviews().length,
    featuredOnHomepage: featuredSlugs.length,
    hasDraft: editable.hasDraft,
    missingHeroMedia: !homepage.hero.mediaSrc,
    missingCovers,
    brokenFeatured,
    categoryGroupCounts: {
      unity: active.filter((r) => r.category === "unity").length,
      unreal: active.filter((r) => r.category === "unreal").length,
      ai: active.filter((r) => r.category === "ai").length,
      "three-d": active.filter((r) => r.category === "three-d").length,
      xr: active.filter((r) => r.category === "xr").length,
    },
  };
}
