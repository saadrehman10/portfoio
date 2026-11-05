import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { ProjectCategory } from "./content";

export type CustomProjectRecord = {
  slug: string;
  title: string;
  category: ProjectCategory;
  folder: string;
  summary: string;
  cover: string;
  media: string[];
};

export type CustomProjectsStore = {
  version: 1;
  projects: CustomProjectRecord[];
};

const EMPTY: CustomProjectsStore = { version: 1, projects: [] };

function localPath() {
  return path.join(process.cwd(), "data", "custom-projects.json");
}

async function readLocal(): Promise<CustomProjectsStore> {
  try {
    const raw = await readFile(localPath(), "utf8");
    const parsed = JSON.parse(raw) as CustomProjectsStore;
    if (!parsed || !Array.isArray(parsed.projects)) return EMPTY;
    return { version: 1, projects: parsed.projects };
  } catch {
    return EMPTY;
  }
}

async function writeLocal(data: CustomProjectsStore) {
  const dir = path.dirname(localPath());
  await mkdir(dir, { recursive: true });
  await writeFile(localPath(), JSON.stringify(data, null, 2), "utf8");
}

async function readCustomProjectsImpl(): Promise<CustomProjectsStore> {
  noStore();
  return readLocal();
}

export const readCustomProjects = cache(readCustomProjectsImpl);

export async function writeCustomProjects(data: CustomProjectsStore) {
  await writeLocal({ version: 1, projects: data.projects });
}

export async function upsertCustomProject(project: CustomProjectRecord) {
  const store = await readLocal();
  const next = store.projects.filter((item) => item.slug !== project.slug);
  next.push(project);
  await writeLocal({ version: 1, projects: next });
  return project;
}

export async function deleteCustomProject(slug: string) {
  const store = await readLocal();
  await writeLocal({
    version: 1,
    projects: store.projects.filter((item) => item.slug !== slug),
  });
}
