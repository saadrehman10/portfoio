import { NextResponse } from "next/server";
import type { ProjectCategory } from "@/lib/content";
import { isAdminSession } from "@/lib/admin-auth";
import {
  deleteCustomProject,
  readCustomProjects,
  upsertCustomProject,
  type CustomProjectRecord,
} from "@/lib/custom-projects";
import {
  writeProjectOverrides,
  type ProjectOverride,
  type ProjectStoryBlock,
} from "@/lib/project-overrides";
import { getAdminProjectRows } from "@/lib/published-projects";
import { getWrittenReviews } from "@/lib/portfolio-reviews";
import { getBundledProjects } from "@/lib/projects-base";
import { revalidatePublicSite } from "@/lib/revalidate-public-site";

const validCategories = new Set(["unity", "unreal", "ai", "three-d", "xr"]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function cleanStoryBlocks(raw: unknown): ProjectStoryBlock[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const blocks = raw
    .map((block) => {
      const item = block as { title?: string; body?: string };
      return {
        title: String(item.title ?? "").trim(),
        body: String(item.body ?? "").trim(),
      };
    })
    .filter((block) => block.title || block.body);
  return blocks;
}

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { readMediaVisibility } = await import("@/lib/media-visibility");
  const customStore = await readCustomProjects();
  const [rows, written, visibility, mediaCatalog] = await Promise.all([
    getAdminProjectRows(),
    Promise.resolve(getWrittenReviews()),
    readMediaVisibility(),
    import("@/lib/cms/media-catalog").then((mod) =>
      mod.buildMediaCatalogWithVisibility(customStore.projects),
    ),
  ]);
  return NextResponse.json({
    projects: rows,
    hiddenMedia: visibility.hidden,
    mediaLibrary: mediaCatalog.map((asset) => ({
      src: asset.src,
      type: asset.type,
      label: asset.projectTitle,
      visible: asset.visible,
    })),
    reviews: written.map((review) => ({
      id: review.id,
      contractTitle: review.contractTitle,
      quote: review.quote ?? "",
      rating: review.rating,
      projectSlug: review.projectSlug,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title?: string;
    slug?: string;
    category?: string;
    summary?: string;
    cover?: string;
    media?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const category = String(body.category ?? "");
  const summary = String(body.summary ?? "").trim();
  const media = Array.isArray(body.media) ? body.media.map(String).filter(Boolean) : [];
  const cover = String(body.cover ?? media[0] ?? "").trim();
  const slug = slugify(String(body.slug ?? title));

  if (!title || !slug) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!validCategories.has(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!media.length || !cover || !media.includes(cover)) {
    return NextResponse.json({ error: "Pick cover and media from the library" }, { status: 400 });
  }

  const bundled = new Set(getBundledProjects().map((project) => project.slug));
  const custom = await readCustomProjects();
  if (bundled.has(slug) || custom.projects.some((project) => project.slug === slug)) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const record: CustomProjectRecord = {
    slug,
    title,
    category: category as ProjectCategory,
    folder: `custom/${slug}`,
    summary: summary || title,
    cover,
    media,
  };

  await upsertCustomProject(record);
  revalidatePublicSite();
  const rows = await getAdminProjectRows();
  return NextResponse.json({ ok: true, projects: rows, created: record });
}

export async function PUT(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    projects?: Array<{
      slug: string;
      active: boolean;
      category: ProjectCategory;
      cover?: string;
      title?: string;
      summary?: string;
      role?: string;
      media?: string[];
      reviewIds?: string[] | null;
      pageHeadline?: string;
      pageOverview?: string;
      storyBlocks?: ProjectStoryBlock[];
      ctaLabel?: string;
      isCustom?: boolean;
    }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const validReviewIds = new Set(getWrittenReviews().map((review) => review.id));
  const customStore = await readCustomProjects();
  const customBySlug = new Map(customStore.projects.map((project) => [project.slug, project]));
  const bundledBySlug = new Map(getBundledProjects().map((project) => [project.slug, project]));
  const cleaned: Record<string, ProjectOverride> = {};

  for (const row of body.projects ?? []) {
    if (!validCategories.has(row.category)) continue;
    const custom = customBySlug.get(row.slug);
    const bundled = bundledBySlug.get(row.slug);
    if (!custom && !bundled) continue;

    const media =
      Array.isArray(row.media) && row.media.length
        ? row.media.map(String)
        : custom?.media ?? bundled?.media ?? [];
    const cover =
      typeof row.cover === "string" && media.includes(row.cover) ? row.cover : media[0];
    const title = typeof row.title === "string" ? row.title.trim() : "";
    const summary = typeof row.summary === "string" ? row.summary.trim() : "";
    const role = typeof row.role === "string" ? row.role.trim() : "";
    const reviewIds = Array.isArray(row.reviewIds)
      ? row.reviewIds.map(String).filter((id) => validReviewIds.has(id))
      : null;
    const storyBlocks = cleanStoryBlocks(row.storyBlocks);
    const pageHeadline = typeof row.pageHeadline === "string" ? row.pageHeadline.trim() : "";
    const pageOverview = typeof row.pageOverview === "string" ? row.pageOverview.trim() : "";
    const ctaLabel = typeof row.ctaLabel === "string" ? row.ctaLabel.trim() : "";

    if (custom) {
      await upsertCustomProject({
        ...custom,
        title: title || custom.title,
        category: row.category,
        summary: summary || custom.summary,
        cover: cover || custom.cover,
        media: media.length ? media : custom.media,
      });
    }

    const base = custom ?? bundled!;
    const entry: ProjectOverride = { active: row.active };
    if (row.category !== base.category) entry.category = row.category;
    if (cover && cover !== base.cover) entry.cover = cover;
    if (title && title !== base.title) entry.title = title;
    if (summary && summary !== base.summary) entry.summary = summary;
    if (role && role !== (bundled?.role ?? "Unity · Unreal · AI / ML · XR")) entry.role = role;
    if (Array.isArray(row.media) && row.media.length) entry.media = media;
    if (reviewIds !== null) entry.reviewIds = reviewIds;
    if (pageHeadline) entry.pageHeadline = pageHeadline;
    if (pageOverview) entry.pageOverview = pageOverview;
    if (storyBlocks?.length) entry.storyBlocks = storyBlocks;
    if (ctaLabel) entry.ctaLabel = ctaLabel;

    const hasMeaningful =
      entry.active === false ||
      entry.category ||
      entry.cover ||
      entry.title ||
      entry.summary ||
      entry.role ||
      entry.media ||
      entry.reviewIds ||
      entry.pageHeadline ||
      entry.pageOverview ||
      entry.storyBlocks ||
      entry.ctaLabel;

    if (hasMeaningful || custom) {
      cleaned[row.slug] = entry;
    }
  }

  try {
    await writeProjectOverrides({ version: 1, overrides: cleaned });
    revalidatePublicSite();
    const rows = await getAdminProjectRows();
    return NextResponse.json({ ok: true, projects: rows, live: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const slug = String(searchParams.get("slug") ?? "").trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const bundled = new Set(getBundledProjects().map((project) => project.slug));
  if (bundled.has(slug)) {
    return NextResponse.json({ error: "Bundled projects cannot be deleted" }, { status: 400 });
  }
  await deleteCustomProject(slug);
  const { overrides } = await import("@/lib/project-overrides").then((mod) =>
    mod.readProjectOverrides(),
  );
  if (overrides[slug]) {
    const next = { ...overrides };
    delete next[slug];
    await writeProjectOverrides({ version: 1, overrides: next });
  }
  revalidatePublicSite();
  const rows = await getAdminProjectRows();
  return NextResponse.json({ ok: true, projects: rows });
}
