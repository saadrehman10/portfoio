import projectsData from "./projects.json";
import type { Project, ProjectCategory } from "./content";
import { categoryGroups } from "./content";
import { withExtraMedia } from "./project-embeds";
import type { CustomProjectRecord } from "./custom-projects";

const raw = projectsData as Array<{
  category: ProjectCategory;
  slug: string;
  title: string;
  folder: string;
  summary: string;
  cover: string;
  media: string[];
}>;

const leafById = new Map(
  categoryGroups.flatMap((g) => g.sections).map((leaf) => [leaf.id, leaf] as const),
);

function decorateRaw(item: {
  category: ProjectCategory;
  slug: string;
  title: string;
  folder: string;
  summary: string;
  cover: string;
  media: string[];
}): Project {
  const leaf = leafById.get(item.category);
  const group = categoryGroups.find((entry) => entry.sections.some((section) => section.id === item.category));
  return withExtraMedia({
    ...item,
    year: "2024–2026",
    role: "Unity · Unreal · AI / ML · XR",
    services: [group?.label ?? "Work", leaf?.label ?? item.category],
    hue: leaf?.hue ?? "#1c2430",
    accent: leaf?.accent ?? "#e7b15a",
    kind: leaf?.kind ?? "product",
  });
}

/** Bundled catalog only (no custom admin-created projects). */
export function getBundledProjects(): Project[] {
  return raw.map(decorateRaw);
}

export function decorateCustomProject(item: CustomProjectRecord): Project {
  return decorateRaw(item);
}

export function getBaseProjects(custom: CustomProjectRecord[] = []): Project[] {
  const bundled = getBundledProjects();
  const bundledSlugs = new Set(bundled.map((project) => project.slug));
  const extras = custom
    .filter((item) => item.slug && !bundledSlugs.has(item.slug))
    .map(decorateCustomProject);
  return [...bundled, ...extras];
}

export function decorateProjectCategory(project: Project, category: ProjectCategory): Project {
  const leaf = leafById.get(category);
  const group = categoryGroups.find((entry) => entry.sections.some((section) => section.id === category));
  return {
    ...project,
    category,
    services: [group?.label ?? "Work", leaf?.label ?? category],
    hue: leaf?.hue ?? project.hue,
    accent: leaf?.accent ?? project.accent,
    kind: leaf?.kind ?? project.kind,
  };
}
