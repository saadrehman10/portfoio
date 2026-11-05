"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProjectCategory } from "@/lib/content";
import { categoryGroups } from "@/lib/content";
import type { AdminProjectRow } from "@/lib/admin-project-types";
import { CategoryOverviewGrid } from "@/components/admin/CategoryOverviewGrid";

const categories = categoryGroups.flatMap((group) =>
  group.sections.map((section) => ({ id: section.id, label: section.label, group: group.label })),
);

type ReviewOption = {
  id: string;
  contractTitle: string;
  quote: string;
  rating: number;
  projectSlug: string | null;
};

type MediaOption = {
  src: string;
  type: "image" | "video" | "embed";
  label: string;
  visible: boolean;
};

function isVideoSrc(src: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(src);
}

function slugifyLocal(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function MediaThumb({ src, className }: { src: string; className?: string }) {
  if (isVideoSrc(src)) {
    return <video className={className} src={src} muted playsInline preload="metadata" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={className} loading="lazy" />;
}

type Props = {
  initialProjects?: AdminProjectRow[];
  initialReviews?: ReviewOption[];
  initialHiddenMedia?: string[];
};

export function ProjectManager({
  initialProjects,
  initialReviews = [],
  initialHiddenMedia = [],
}: Props = {} as Props) {
  const router = useRouter();
  const [rows, setRows] = useState<AdminProjectRow[]>(initialProjects ?? []);
  const [reviews, setReviews] = useState<ReviewOption[]>(initialReviews);
  const [hiddenMedia, setHiddenMedia] = useState<Set<string>>(
    () => new Set(initialHiddenMedia),
  );
  const [ready, setReady] = useState(Boolean(initialProjects));
  const [loadError, setLoadError] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "hidden">("all");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaLibrary, setMediaLibrary] = useState<MediaOption[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    slug: "",
    category: "unity" as ProjectCategory,
    summary: "",
    cover: "",
    media: [] as string[],
  });

  useEffect(() => {
    setHiddenMedia(new Set(initialHiddenMedia));
  }, [initialHiddenMedia]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const response = await fetch("/api/admin/projects");
      if (!response.ok) {
        if (!cancelled && !initialProjects) setLoadError("Could not load projects.");
        return;
      }
      const data = (await response.json()) as {
        projects: AdminProjectRow[];
        reviews?: ReviewOption[];
        hiddenMedia?: string[];
        mediaLibrary?: MediaOption[];
      };
      if (cancelled) return;
      if (!initialProjects) setRows(data.projects);
      else if (data.projects) setRows(data.projects);
      if (data.reviews) setReviews(data.reviews);
      setHiddenMedia(new Set(data.hiddenMedia ?? []));
      setMediaLibrary(data.mediaLibrary ?? []);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [initialProjects, initialReviews]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return rows.filter((row) => {
      if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
      if (statusFilter === "published" && !row.active) return false;
      if (statusFilter === "hidden" && row.active) return false;
      if (!q) return true;
      return (
        row.title.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.folder.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, categoryFilter, statusFilter]);

  const visibleByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of rows) {
      if (!row.active) continue;
      map[row.category] = (map[row.category] ?? 0) + 1;
    }
    return map;
  }, [rows]);

  const suggestedBySlug = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const review of reviews) {
      if (!review.projectSlug) continue;
      if (!map[review.projectSlug]) map[review.projectSlug] = [];
      map[review.projectSlug].push(review.id);
    }
    return map;
  }, [reviews]);

  if (loadError) {
    return (
      <div className="admin-panel">
        <p className="admin-error">{loadError}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="admin-panel" aria-busy="true">
        <p className="meta">Loading projects…</p>
      </div>
    );
  }

  function updateRow(slug: string, patch: Partial<AdminProjectRow>) {
    setRows((current) => current.map((row) => (row.slug === slug ? { ...row, ...patch } : row)));
  }

  function toggleReview(slug: string, reviewId: string) {
    setRows((current) =>
      current.map((row) => {
        if (row.slug !== slug) return row;
        const existing = row.reviewIds ?? suggestedBySlug[slug] ?? [];
        const next = existing.includes(reviewId)
          ? existing.filter((id) => id !== reviewId)
          : [...existing, reviewId];
        return { ...row, reviewIds: next };
      }),
    );
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projects: rows.map((row) => ({
          slug: row.slug,
          active: row.active,
          category: row.category,
          cover: row.cover,
          title: row.title,
          summary: row.summary,
          role: row.role,
          media: row.media,
          reviewIds: row.reviewIds,
          pageHeadline: row.pageHeadline ?? "",
          pageOverview: row.pageOverview ?? "",
          storyBlocks: row.storyBlocks ?? [],
          ctaLabel: row.ctaLabel ?? "",
          isCustom: row.isCustom,
        })),
      }),
    });
    setSaving(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(body?.error ?? "Save failed. Try again.");
      return;
    }
    const data = (await response.json()) as { projects: AdminProjectRow[] };
    setRows(data.projects);
    router.refresh();
    setMessage("Saved. Project details, media, reviews, and page copy are live.");
  }

  async function createProject() {
    setCreating(true);
    setMessage("");
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    setCreating(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(body?.error ?? "Could not create project.");
      return;
    }
    const data = (await response.json()) as { projects: AdminProjectRow[]; created?: { slug: string } };
    setRows(data.projects);
    setShowCreate(false);
    setCreateForm({ title: "", slug: "", category: "unity", summary: "", cover: "", media: [] });
    if (data.created?.slug) setExpandedSlug(data.created.slug);
    router.refresh();
    setMessage("Project created. Customize the page below, then save.");
  }

  async function removeCustom(slug: string) {
    if (!window.confirm("Delete this custom project? This cannot be undone.")) return;
    const response = await fetch(`/api/admin/projects?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setMessage("Could not delete project.");
      return;
    }
    const data = (await response.json()) as { projects: AdminProjectRow[] };
    setRows(data.projects);
    setExpandedSlug(null);
    router.refresh();
    setMessage("Custom project deleted.");
  }

  function toggleCreateMedia(src: string) {
    setCreateForm((current) => {
      const exists = current.media.includes(src);
      const media = exists ? current.media.filter((item) => item !== src) : [...current.media, src];
      const cover = media.includes(current.cover) ? current.cover : media[0] ?? "";
      return { ...current, media, cover };
    });
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel-head">
        <div>
          <h1>Projects</h1>
          <p className="meta">
            Create projects from media, attach client reviews, and customize each project page.
            Open a row with <strong>Edit</strong> to change content.
          </p>
        </div>
        <div className="admin-quick-actions admin-panel-actions">
          <button type="button" className="pill" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Close create" : "Create project"}
          </button>
          <button type="button" className="pill solid" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save project changes"}
          </button>
        </div>
      </header>

      {showCreate && (
        <div className="admin-config-surface" style={{ marginBottom: 24 }}>
          <h2 className="admin-subtitle" style={{ marginTop: 0 }}>
            Create project from media
          </h2>
          <div className="admin-form-stack admin-form-stack-split">
            <label>
              Title
              <input
                value={createForm.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setCreateForm((current) => ({
                    ...current,
                    title,
                    slug:
                      current.slug && current.slug !== slugifyLocal(current.title)
                        ? current.slug
                        : slugifyLocal(title),
                  }));
                }}
              />
            </label>
            <label>
              Slug
              <input
                value={createForm.slug}
                onChange={(e) => setCreateForm((current) => ({ ...current, slug: e.target.value }))}
              />
            </label>
            <label>
              Category
              <select
                value={createForm.category}
                onChange={(e) =>
                  setCreateForm((current) => ({
                    ...current,
                    category: e.target.value as ProjectCategory,
                  }))
                }
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.group} · {cat.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-form-span-2">
              Summary
              <textarea
                rows={3}
                value={createForm.summary}
                onChange={(e) => setCreateForm((current) => ({ ...current, summary: e.target.value }))}
              />
            </label>
          </div>
          <div className="admin-cover-picker" style={{ marginTop: 16 }}>
            <h3 className="admin-config-kicker">Media from library</h3>
            <p className="meta">Select files, then choose a cover. Hidden media cannot be selected.</p>
            <div className="admin-cover-grid">
              {mediaLibrary
                .filter((asset) => asset.visible)
                .slice(0, 48)
                .map((asset) => {
                  const selected = createForm.media.includes(asset.src);
                  const isCover = createForm.cover === asset.src;
                  return (
                    <button
                      key={asset.src}
                      type="button"
                      className={[
                        "admin-cover-option",
                        selected ? "is-selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => toggleCreateMedia(asset.src)}
                      onDoubleClick={() =>
                        setCreateForm((current) =>
                          current.media.includes(asset.src)
                            ? { ...current, cover: asset.src }
                            : current,
                        )
                      }
                      title="Click to toggle · double-click selected to set cover"
                    >
                      <MediaThumb src={asset.src} className="admin-cover-option-media" />
                      <span className="meta">
                        {isCover ? "Cover" : selected ? "Selected" : asset.type}
                      </span>
                    </button>
                  );
                })}
            </div>
            {createForm.media.length > 0 && (
              <p className="meta" style={{ marginTop: 10 }}>
                {createForm.media.length} selected
                {createForm.cover ? ` · cover set` : " · double-click one to set cover"}
              </p>
            )}
          </div>
          <div className="admin-quick-actions" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="pill solid"
              disabled={creating || !createForm.title || !createForm.media.length || !createForm.cover}
              onClick={createProject}
            >
              {creating ? "Creating…" : "Create project"}
            </button>
          </div>
        </div>
      )}

      <h2 className="admin-subtitle" style={{ marginTop: 8 }}>
        Visible by category
      </h2>
      <p className="meta" style={{ marginBottom: 12 }}>
        {rows.length} total · {rows.filter((row) => row.active).length} published ·{" "}
        {rows.filter((row) => !row.active).length} hidden
      </p>
      <CategoryOverviewGrid byCategory={visibleByCategory} compact />

      <div className="admin-media-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search by title, slug, folder, or details…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.group} · {cat.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-project-list" role="list">
        <div className="admin-project-list-head" aria-hidden="true">
          <span>Show</span>
          <span>Thumbnail</span>
          <span>Project</span>
          <span>Category</span>
          <span>Reviews</span>
          <span>Actions</span>
        </div>

        {filtered.map((row) => {
          const open = expandedSlug === row.slug;
          const reviewCount =
            row.reviewIds === null
              ? (suggestedBySlug[row.slug]?.length ?? 0)
              : row.reviewIds.length;
          const reviewMode = row.reviewIds === null ? "Auto" : "Custom";

          return (
            <article
              key={row.slug}
              className={[
                "admin-project-card",
                row.active ? "" : "is-hidden",
                open ? "is-open" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="listitem"
            >
              <div className="admin-project-card-main">
                <label className="admin-project-card-field admin-project-card-show">
                  <span className="admin-project-card-label">Show on site</span>
                  <input
                    type="checkbox"
                    checked={row.active}
                    onChange={(e) => updateRow(row.slug, { active: e.target.checked })}
                    aria-label={`Show ${row.title}`}
                  />
                </label>

                <div className="admin-project-card-field admin-project-card-thumb">
                  <span className="admin-project-card-label">Thumbnail</span>
                  <MediaThumb
                    src={row.cover}
                    className={
                      hiddenMedia.has(row.cover)
                        ? "admin-project-thumb is-hidden-media"
                        : "admin-project-thumb"
                    }
                  />
                  {hiddenMedia.has(row.cover) && (
                    <span className="meta">Hidden media</span>
                  )}
                </div>

                <div className="admin-project-card-field admin-project-card-info">
                  <span className="admin-project-card-label">Project</span>
                  <strong>{row.title}</strong>
                  <span className="admin-slug">{row.slug}</span>
                  <span className="meta admin-project-card-summary">
                    {row.summary.length > 120 ? `${row.summary.slice(0, 120)}…` : row.summary}
                  </span>
                </div>

                <label className="admin-project-card-field admin-project-card-category">
                  <span className="admin-project-card-label">Category</span>
                  <select
                    value={row.category}
                    onChange={(e) =>
                      updateRow(row.slug, { category: e.target.value as ProjectCategory })
                    }
                    aria-label={`Category for ${row.title}`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.group} · {cat.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="admin-project-card-field admin-project-card-reviews">
                  <span className="admin-project-card-label">Reviews</span>
                  <span className="meta">
                    {reviewMode} · {reviewCount}
                  </span>
                </div>

                <div className="admin-project-card-field admin-project-card-actions">
                  <span className="admin-project-card-label">Actions</span>
                  <div className="admin-quick-actions">
                    <button
                      type="button"
                      className={open ? "pill solid" : "pill"}
                      onClick={() => setExpandedSlug(open ? null : row.slug)}
                      aria-expanded={open}
                    >
                      {open ? "Close" : "Edit"}
                    </button>
                    <Link className="pill" href={`/work/${row.slug}`} target="_blank">
                      View
                    </Link>
                    {row.isCustom ? (
                      <button type="button" className="pill" onClick={() => removeCustom(row.slug)}>
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {open && (
                <div className="admin-project-editor">
                  <div className="admin-form-stack admin-form-stack-split">
                    <label>
                      Project title
                      <input
                        value={row.title}
                        onChange={(e) => updateRow(row.slug, { title: e.target.value })}
                      />
                    </label>
                    <label>
                      Role
                      <input
                        value={row.role}
                        onChange={(e) => updateRow(row.slug, { role: e.target.value })}
                      />
                    </label>
                    <label className="admin-form-span-2">
                      Project details / summary
                      <textarea
                        rows={4}
                        value={row.summary}
                        onChange={(e) => updateRow(row.slug, { summary: e.target.value })}
                      />
                    </label>
                    <label>
                      Page headline
                      <input
                        value={row.pageHeadline ?? ""}
                        placeholder={row.title}
                        onChange={(e) => updateRow(row.slug, { pageHeadline: e.target.value })}
                      />
                    </label>
                    <label>
                      Hire CTA label
                      <input
                        value={row.ctaLabel ?? ""}
                        placeholder="Contact me"
                        onChange={(e) => updateRow(row.slug, { ctaLabel: e.target.value })}
                      />
                    </label>
                    <label className="admin-form-span-2">
                      Page overview
                      <textarea
                        rows={4}
                        value={row.pageOverview ?? ""}
                        placeholder="Longer case-study overview for the project page"
                        onChange={(e) => updateRow(row.slug, { pageOverview: e.target.value })}
                      />
                    </label>
                    <label className="admin-form-span-2">
                      Story blocks (one per line as Title | Body)
                      <textarea
                        rows={5}
                        value={(row.storyBlocks ?? [])
                          .map((block) => `${block.title} | ${block.body}`)
                          .join("\n")}
                        placeholder={"Challenge | What we solved\nApproach | How we built it"}
                        onChange={(e) => {
                          const storyBlocks = e.target.value
                            .split("\n")
                            .map((line) => line.trim())
                            .filter(Boolean)
                            .map((line) => {
                              const [title, ...rest] = line.split("|");
                              return {
                                title: (title ?? "").trim(),
                                body: rest.join("|").trim(),
                              };
                            });
                          updateRow(row.slug, { storyBlocks });
                        }}
                      />
                    </label>
                  </div>

                  {row.media.length > 0 && (
                    <div className="admin-cover-picker">
                      <h3 className="admin-config-kicker">Thumbnail</h3>
                      <p className="meta">
                        Shown on Work cards and anywhere this project cover is used. Media marked
                        Hidden in Media Library stay visible here so you can see them, but cannot be
                        chosen as the public thumbnail.
                      </p>
                      {hiddenMedia.has(row.cover) && (
                        <p className="admin-message">
                          Current thumbnail is hidden in Media Library. Pick a visible option below,
                          or turn that file back on in Media Library.
                        </p>
                      )}
                      <div className="admin-cover-grid">
                        {row.media.map((src, index) => {
                          const selected = src === row.cover;
                          const isHidden = hiddenMedia.has(src);
                          return (
                            <button
                              key={`${row.slug}-cover-${index}`}
                              type="button"
                              className={[
                                "admin-cover-option",
                                selected ? "is-selected" : "",
                                isHidden ? "is-hidden-media" : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              onClick={() => {
                                if (isHidden) return;
                                updateRow(row.slug, { cover: src });
                              }}
                              disabled={isHidden}
                              aria-pressed={selected}
                              title={
                                isHidden
                                  ? "Hidden in Media Library — turn Visible on to use as thumbnail"
                                  : undefined
                              }
                            >
                              <MediaThumb src={src} className="admin-cover-option-media" />
                              <span className="meta">
                                {isHidden
                                  ? "Hidden"
                                  : selected
                                    ? "Current"
                                    : `Option ${index + 1}`}
                                {isVideoSrc(src) ? " · video" : " · image"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="admin-cover-picker">
                    <h3 className="admin-config-kicker">Client reviews on this project</h3>
                    <p className="meta">
                      Auto uses reviews linked to this project from source records. Custom lets you
                      choose exactly which verified written reviews appear.
                    </p>
                    <div className="admin-quick-actions" style={{ marginBottom: 12 }}>
                      <button
                        type="button"
                        className={row.reviewIds === null ? "pill solid" : "pill"}
                        onClick={() => updateRow(row.slug, { reviewIds: null })}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        className={row.reviewIds !== null ? "pill solid" : "pill"}
                        onClick={() =>
                          updateRow(row.slug, {
                            reviewIds: [...(suggestedBySlug[row.slug] ?? [])],
                          })
                        }
                      >
                        Custom selection
                      </button>
                      {row.reviewIds !== null && (
                        <button
                          type="button"
                          className="pill"
                          onClick={() => updateRow(row.slug, { reviewIds: [] })}
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {row.reviewIds === null ? (
                      <p className="meta">
                        Using automatic mapping
                        {(suggestedBySlug[row.slug]?.length ?? 0) > 0
                          ? ` (${suggestedBySlug[row.slug].length} linked written review${
                              suggestedBySlug[row.slug].length === 1 ? "" : "s"
                            })`
                          : " (no linked written reviews yet)"}
                        .
                      </p>
                    ) : (
                      <ul className="admin-review-pick-list">
                        {reviews.map((review) => {
                          const checked = row.reviewIds?.includes(review.id) ?? false;
                          const suggested = suggestedBySlug[row.slug]?.includes(review.id);
                          return (
                            <li key={review.id}>
                              <label className="admin-inline-check">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleReview(row.slug, review.id)}
                                />
                                <span>
                                  <strong>{review.contractTitle}</strong>
                                  <span className="meta" style={{ display: "block" }}>
                                    {review.id}
                                    {suggested ? " · suggested for this project" : ""}
                                    {review.projectSlug
                                      ? ` · linked slug: ${review.projectSlug}`
                                      : ""}
                                    {` · ${review.rating.toFixed(1)}★`}
                                  </span>
                                  <span className="meta" style={{ display: "block" }}>
                                    {review.quote.length > 160
                                      ? `${review.quote.slice(0, 160)}…`
                                      : review.quote}
                                  </span>
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
