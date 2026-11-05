import type { Project } from "@/lib/content";
import { getBaseProjects, getBundledProjects } from "@/lib/projects-base";
import { isEmbed, isVideo } from "@/lib/media";
import { hiddenMediaSet, readMediaVisibility } from "@/lib/media-visibility";
import type { CustomProjectRecord } from "@/lib/custom-projects";

export type MediaAsset = {
  id: string;
  src: string;
  type: "image" | "video" | "embed";
  projectSlug: string;
  projectTitle: string;
  isCover: boolean;
  visible: boolean;
};

export function buildMediaCatalog(
  hidden: Set<string> = new Set(),
  projects: Project[] = getBundledProjects(),
): MediaAsset[] {
  const assets: MediaAsset[] = [];
  const seen = new Set<string>();

  for (const project of projects) {
    for (const src of project.media) {
      if (seen.has(src)) continue;
      seen.add(src);
      assets.push({
        id: src,
        src,
        type: isEmbed(src) ? "embed" : isVideo(src) ? "video" : "image",
        projectSlug: project.slug,
        projectTitle: project.title,
        isCover: src === project.cover,
        visible: !hidden.has(src),
      });
    }
  }

  return assets;
}

export async function buildMediaCatalogWithVisibility(
  custom: CustomProjectRecord[] = [],
): Promise<MediaAsset[]> {
  const store = await readMediaVisibility();
  const projects = getBaseProjects(custom);
  return buildMediaCatalog(hiddenMediaSet(store), projects);
}

export function mediaStats(assets: MediaAsset[] = buildMediaCatalog()) {
  return {
    total: assets.length,
    images: assets.filter((asset) => asset.type === "image").length,
    videos: assets.filter((asset) => asset.type === "video").length,
    embeds: assets.filter((asset) => asset.type === "embed").length,
    visible: assets.filter((asset) => asset.visible).length,
    hidden: assets.filter((asset) => !asset.visible).length,
  };
}
