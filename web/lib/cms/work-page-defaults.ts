import type { ProjectCategory } from "@/lib/content";

export type WorkCategoryMeta = {
  description: string;
  leadProjectSlug: string;
};

export type WorkPageStore = {
  eyebrow: string;
  headline: string;
  introduction: string;
  exploreLabel: string;
  searchPlaceholder: string;
  emptyText: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  showLeadProject: boolean;
  /** Independent project rank per leaf category (slug order). */
  projectOrder: Partial<Record<ProjectCategory, string[]>>;
  /** Per root-group intro copy (unity | unreal | ai | three-d | xr). */
  groupIntros: Record<string, string>;
  /** Per leaf category lead + description. */
  categoryMeta: Partial<Record<ProjectCategory, WorkCategoryMeta>>;
};

export function buildDefaultWorkPage(): WorkPageStore {
  return {
    eyebrow: "SELECTED & COMPLETE WORK",
    headline: "Work across engines, intelligence, and space.",
    introduction:
      "Browse Unity and Unreal projects, AI / ML / computer-vision work, 3D visualization, and XR (AR / VR). Each piece is a different way of making software interactive, spatial, or smarter.",
    exploreLabel: "EXPLORE BY DISCIPLINE",
    searchPlaceholder: "Search projects, platforms, or skills",
    emptyText: "No projects match these filters. Try Unity, Unreal, AI, 3D, or XR.",
    ctaHeading: "Building something in this stack?",
    ctaDescription:
      "From a Unity prototype to an Unreal environment, an AI feature, or an XR demo—I can help turn the brief into a build you can run.",
    ctaPrimaryLabel: "Contact me",
    ctaPrimaryHref: "/contact",
    ctaSecondaryLabel: "Back to All Work",
    showLeadProject: true,
    projectOrder: {},
    groupIntros: {
      unity:
        "Interactive systems in Unity—gameplay, tools, environments, and apps built for performance, iteration speed, and clean handoff.",
      unreal:
        "Unreal Engine worlds and real-time experiences—environments, lighting, and interactive scenes that hold up under review in-engine.",
      ai: "AI, machine learning, and computer vision—pipelines and product features that see, decide, and assist inside real software.",
      "three-d":
        "3D art and visualization—models, look-dev, animation, and imagery that support games, products, and spatial storytelling.",
      xr: "AR, VR, and XR—spatial experiences for headsets and mobile that put users inside the product, not just in front of a screen.",
    },
    categoryMeta: {
      unity: {
        description: "Unity gameplay, tools, environments, and interactive applications.",
        leadProjectSlug: "unity-unity-game",
      },
      unreal: {
        description: "Unreal environments, cinematic real-time scenes, and interactive experiences.",
        leadProjectSlug: "unreal-fantasy-castle",
      },
      ai: {
        description: "AI / ML features and computer-vision workflows embedded in products.",
        leadProjectSlug: "product-animation-ai-product",
      },
      "three-d": {
        description: "3D modeling, visualization, animation, and look development.",
        leadProjectSlug: "product-animation-cars",
      },
      xr: {
        description: "Augmented, virtual, and extended reality experiences.",
        leadProjectSlug: "explainer-app-animation",
      },
    },
  };
}
