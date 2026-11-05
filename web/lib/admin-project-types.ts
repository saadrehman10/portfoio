import type { Project } from "./content";
import type { ProjectStoryBlock } from "./project-overrides";

export type AdminProjectRow = Project & {
  active: boolean;
  /** null = automatic review mapping; string[] = explicit selection (may be empty). */
  reviewIds: string[] | null;
  /** True when created in admin (not from bundled projects.json). */
  isCustom?: boolean;
  pageHeadline?: string;
  pageOverview?: string;
  storyBlocks?: ProjectStoryBlock[];
  ctaLabel?: string;
};
