export type ProjectCategory = "unity" | "unreal" | "ai" | "three-d" | "xr";

export type ProjectKind = "product" | "character" | "space" | "motion";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  folder: string;
  summary: string;
  cover: string;
  media: string[];
  year: string;
  role: string;
  services: string[];
  hue: string;
  accent: string;
  kind: ProjectKind;
};

type Leaf = { id: ProjectCategory; label: string; hue: string; accent: string; kind: ProjectKind };

/**
 * Work taxonomy — five top-level disciplines.
 * Group ids are URL-safe anchors (`/work#three-d`); labels are display names.
 */
export const categoryGroups: {
  id: string;
  label: string;
  sections: Leaf[];
}[] = [
  {
    id: "unity",
    label: "Unity",
    sections: [
      {
        id: "unity",
        label: "Unity Development",
        hue: "#0f1a14",
        accent: "#6bcf8e",
        kind: "motion",
      },
    ],
  },
  {
    id: "unreal",
    label: "Unreal",
    sections: [
      {
        id: "unreal",
        label: "Unreal Engine",
        hue: "#10141c",
        accent: "#5b8cff",
        kind: "space",
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    sections: [
      {
        id: "ai",
        label: "AI / ML / Computer Vision",
        hue: "#141018",
        accent: "#c084fc",
        kind: "motion",
      },
    ],
  },
  {
    id: "three-d",
    label: "3D",
    sections: [
      {
        id: "three-d",
        label: "3D Art & Visualization",
        hue: "#16120e",
        accent: "#f0a45c",
        kind: "product",
      },
    ],
  },
  {
    id: "xr",
    label: "XR",
    sections: [
      {
        id: "xr",
        label: "AR / VR / XR",
        hue: "#0e1418",
        accent: "#38bdf8",
        kind: "space",
      },
    ],
  },
];

/** Display parent for leaf categories (stable IDs unchanged). */
export function categoryGroupFor(category: ProjectCategory) {
  return categoryGroups.find((group) => group.sections.some((section) => section.id === category));
}

export const categoryOrder: Leaf[] = categoryGroups.flatMap((group) => group.sections);

export function categoryLabel(category: ProjectCategory) {
  return categoryOrder.find((leaf) => leaf.id === category)?.label ?? category;
}
