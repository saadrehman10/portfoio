/** Homepage narrative copy and featured-chapter config (homepage only). */

export type FeaturedChapterCopy = {
  slug: string;
  clientLabel: string;
  headline: string;
  body: string;
  cta: string;
};

export const featuredChaptersCopy: FeaturedChapterCopy[] = [
  {
    slug: "unity-unity-game",
    clientLabel: "Unity — Real-time Gameplay & Environments",
    headline: "Built to play. Tuned to feel right.",
    body: "Unity systems, environments, and interactive prototypes shaped for performance, clarity, and player-facing polish—from first playable to shippable build.",
    cta: "Explore Project",
  },
  {
    slug: "unreal-fantasy-castle",
    clientLabel: "Unreal Engine — Immersive Worlds",
    headline: "Worlds you can walk through.",
    body: "Unreal environments and cinematic real-time scenes designed for presence—lighting, scale, and spatial storytelling that hold up in-engine.",
    cta: "Explore Project",
  },
  {
    slug: "explainer-app-animation",
    clientLabel: "XR — Augmented Reality Experience",
    headline: "Beyond the screen. Into the room.",
    body: "AR and XR experiences that place digital systems in physical space—built for real devices, real lighting, and real user behavior.",
    cta: "Explore Project",
  },
];

export const expertiseItems = [
  {
    id: "unity",
    index: "01",
    title: "Unity Development",
    body: "Gameplay systems, tools, environments, and interactive apps in Unity—shipped with clean architecture and production-minded performance.",
    href: "/work#unity",
    mediaSlug: "unity-unity-game",
  },
  {
    id: "unreal",
    index: "02",
    title: "Unreal Engine",
    body: "Real-time environments, cinematic lighting, and interactive Unreal experiences built for immersion, fidelity, and frame budget.",
    href: "/work#unreal",
    mediaSlug: "unreal-fantasy-castle",
  },
  {
    id: "ai",
    index: "03",
    title: "AI / ML / Computer Vision",
    body: "Intelligent pipelines that see, classify, and generate—computer vision, model-assisted workflows, and AI features wired into real products.",
    href: "/work#ai",
    mediaSlug: "product-animation-ai-product",
  },
  {
    id: "xr",
    index: "04",
    title: "XR · AR · VR",
    body: "Spatial experiences for headsets and phones—AR overlays, VR presence, and XR prototypes that feel natural in three dimensions.",
    href: "/work#xr",
    mediaSlug: "explainer-app-animation",
  },
] as const;

export const processSteps = [
  {
    index: "01",
    title: "Scope",
    body: "We lock the platform, success metrics, references, and constraints—Unity, Unreal, AI pipeline, or XR device targets.",
  },
  {
    index: "02",
    title: "Build",
    body: "I prototype early, iterate in-engine or in-model, and keep demos reviewable so decisions stay fast and visible.",
  },
  {
    index: "03",
    title: "Ship",
    body: "You get a stable build, documented handoff, and assets organized for the next sprint—not a black-box dump.",
  },
] as const;

/** Prefer named collaborations with project links; quotes flagged as unverified. */
export const trustEvidenceSlugs = [
  "unity-unity-game",
  "unreal-fantasy-castle",
  "explainer-app-animation",
] as const;

export const HERO_FALLBACK_MEDIA = "/assets/Untiy/Unity%20Game/Movie_002.mp4";
