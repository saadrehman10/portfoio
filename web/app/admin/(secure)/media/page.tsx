import { MediaLibraryManager } from "@/components/admin/MediaLibraryManager";
import { buildMediaCatalogWithVisibility } from "@/lib/cms/media-catalog";
import { readCustomProjects } from "@/lib/custom-projects";

export const instant = false;

export const metadata = { title: "Media | Admin" };

export default async function AdminMediaPage() {
  const custom = await readCustomProjects();
  const assets = await buildMediaCatalogWithVisibility(custom.projects);
  return <MediaLibraryManager assets={assets} />;
}
