import {
  expertiseItems,
  featuredChaptersCopy,
  HERO_FALLBACK_MEDIA,
  processSteps,
} from "@/lib/homepage-content";
import { UPWORK_PROFILE_URL } from "@/lib/site-links";
import type { ThemeColors, ThemePresetId } from "@/lib/themes";
import { DEFAULT_THEME_PRESET, getPreset } from "@/lib/themes";

export type FeaturedProjectPlacement = {
  slug: string;
  enabled: boolean;
  clientLabel: string;
  headline: string;
  body: string;
  cta: string;
  /** Optional media override (path under /assets/…). */
  mediaSrc: string;
};

export type HomepageStore = {
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    scrollLabel: string;
    mediaSrc: string;
  };
  featuredProjects: FeaturedProjectPlacement[];
  expertise: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      id: string;
      index: string;
      title: string;
      body: string;
      href: string;
      mediaSlug: string;
      enabled: boolean;
    }>;
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: Array<{ index: string; title: string; body: string; enabled: boolean }>;
  };
  trust: {
    eyebrow: string;
    title: string;
    description: string;
    support: string;
    enabled: boolean;
    reviewIds: string[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    ctaLabel: string;
    ctaHref: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    closing: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export type GlobalSiteSettings = {
  upworkUrl: string;
  footerLabel: string;
  footerHeadline: string;
  footerDescription: string;
  footerTagline: string;
  siteTitle: string;
  /** Active theme preset, or `custom` when using themeColors fully. */
  themePreset: ThemePresetId;
  /** Color tokens — used when themePreset is `custom`, or as overrides snapshot. */
  themeColors: ThemeColors;
};

export type SkillGroup = {
  title: string;
  items: string;
};

export type AboutPageStore = {
  eyebrow: string;
  name: string;
  headline: string;
  location: string;
  intro: string;
  objective: string;
  skillGroups: SkillGroup[];
  educationTitle: string;
  educationPeriod: string;
  educationSchool: string;
  certificates: Array<{ title: string; detail: string }>;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  /** @deprecated kept for older drafts */
  startTitle?: string;
  startBody?: string;
  finishTitle?: string;
  finishBody?: string;
  hireTitle?: string;
  hireBody?: string;
  editorialFlag?: string;
};

export type ServicesPageStore = {
  eyebrow: string;
  headline: string;
  intro: string;
  offers: Array<{ title: string; detail: string; tools?: string; enabled: boolean }>;
};

export type ExperienceJob = {
  title: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  bullets: string[];
};

export type ExperiencePageStore = {
  eyebrow: string;
  headline: string;
  intro: string;
  jobs: ExperienceJob[];
};

export type ContactPageStore = {
  eyebrow: string;
  headline: string;
  intro: string;
  email: string;
  phone: string;
  cvUrl: string;
  cvLabel: string;
  formVisible: boolean;
  formNote: string;
  successMessage: string;
  errorMessage: string;
  /** @deprecated prefer contact form / email */
  upworkLabel: string;
};

export type PagesStore = {
  about: AboutPageStore;
  services: ServicesPageStore;
  experience: ExperiencePageStore;
  contact: ContactPageStore;
};

export function buildDefaultPages(): PagesStore {
  return {
    about: {
      eyebrow: "about",
      name: "Saad ur Rehman",
      headline: "Game Developer · AR & VR · AI / Computer Vision",
      location: "Karachi, Pakistan",
      intro:
        "I build immersive 2D/3D applications and simulations in Unity and Unreal Engine 5, and I develop computer-vision models that power real product features—not just demos.",
      objective:
        "AR/VR and game developer experienced in building immersive applications and simulations using Unity (AR Foundation, OpenXR) and Unreal Engine 5. Also experienced in developing and training AI models for computer vision—especially CNNs—including dataset preparation, model optimization, and evaluation for image classification and visual recognition.",
      skillGroups: [
        {
          title: "Game engines",
          items:
            "Unity 3D (C#), Unreal Engine 5 (Blueprints), PlayCanvas, real-time rendering, lighting, physics",
        },
        {
          title: "AR development",
          items:
            "Unity AR Foundation, Vuforia, ARCore, ARKit, DeepAR, OpenXR, geospatial anchors, image/object tracking, scene understanding",
        },
        {
          title: "VR / XR",
          items:
            "Unreal VR template, Blueprint VR interactions, Meta Quest / HTC Vive, Unity XR Interaction Toolkit, LOD & level streaming, motion controllers, teleportation & smooth locomotion",
        },
        {
          title: "AI & computer vision",
          items:
            "Python, OpenCV, NumPy, Pandas, PyTorch, TensorFlow/Keras, YOLO, object detection, classification, segmentation, data annotation & augmentation, ONNX",
        },
        {
          title: "Mobile & web",
          items: "Flutter (Dart), React, Next.js, Astro, Firebase, REST APIs, responsive UI, state management",
        },
        {
          title: "Cloud & tools",
          items:
            "Firebase, AWS (EC2, S3), Supabase, n8n, Linux, Git/GitHub, Figma, Blender basics, Adobe Illustrator & Photoshop",
        },
      ],
      educationTitle: "Bachelor of Science in Software Engineering",
      educationPeriod: "Feb 2021 – Feb 2025",
      educationSchool: "University of Karachi, Karachi",
      certificates: [
        {
          title: "Game Development — LearnEasy.pk (Innovista)",
          detail:
            "Unity fundamentals, C# scripting, and 2D/3D game mechanics with playable project work.",
        },
        {
          title: "Flutter Development — Hazza Institute of Technology",
          detail: "Dart, widget-based UI, and Firebase-backed cross-platform apps.",
        },
        {
          title: "Cloud Solution Architecture — Hazza Institute of Technology",
          detail: "AWS services, Linux server management, and scalable cloud-native deployment.",
        },
        {
          title: "MERN Stack Development — Saylani Mass IT Training",
          detail: "MongoDB, Express, React, Node—full-stack apps and REST APIs.",
        },
      ],
      ctaPrimaryLabel: "View experience",
      ctaPrimaryHref: "/experience",
      ctaSecondaryLabel: "Contact me",
      ctaSecondaryHref: "/contact",
      editorialFlag: "",
    },
    services: {
      eyebrow: "services",
      headline: "what you can hire me for.",
      intro:
        "Outcome-first offerings for teams shipping games, XR products, intelligent vision features, and real-time 3D experiences.",
      offers: [
        {
          title: "Unity development",
          detail:
            "2D/3D games, tools, UI, and interactive apps in Unity—built with C#, clear architecture, and mobile-ready performance.",
          tools: "Unity 3D · C# · Physics · UI · Mobile builds",
          enabled: true,
        },
        {
          title: "Unreal Engine",
          detail:
            "UE5 environments, cinematic lighting, Blueprint systems, and interactive experiences ready for in-engine review.",
          tools: "Unreal Engine 5 · Blueprints · Real-time lighting · Level streaming",
          enabled: true,
        },
        {
          title: "AI / ML / computer vision",
          detail:
            "CNN pipelines for classification and recognition—dataset prep, training, evaluation, and integration into real apps.",
          tools: "PyTorch · TensorFlow/Keras · OpenCV · YOLO · ONNX",
          enabled: true,
        },
        {
          title: "XR — AR / VR",
          detail:
            "Marker-based and markerless AR, geospatial anchors, and VR simulations for Quest and Vive with solid interaction loops.",
          tools: "AR Foundation · Vuforia · OpenXR · XR Toolkit · Meta Quest",
          enabled: true,
        },
        {
          title: "3D visualization",
          detail:
            "Interactive walkthroughs, 360° tours, and spatial product storytelling that support games, real estate, and demos.",
          tools: "Real-time rendering · Lighting · 3D UI · Spatial audio",
          enabled: true,
        },
      ],
    },
    experience: {
      eyebrow: "experience",
      headline: "where the work got shipped.",
      intro:
        "Roles across game development, AR/VR production, and data systems—always focused on builds you can run and metrics you can trust.",
      jobs: [
        {
          title: "Jr Game Developer",
          company: "Techversol",
          location: "Karachi, Pakistan · Full-time, Onsite",
          period: "June 2025 – Present",
          summary:
            "Contributing to interactive 2D/3D games and immersive AR/VR applications in Unity and Unreal Engine. Previously Game Developer Intern (Apr 2025 – May 2025).",
          bullets: [
            "Developed and optimized 2D/3D games in Unity for mobile platforms.",
            "Built AR apps in Unity and Unreal using marker-based, markerless, Google Cloud Anchors, and Geospatial Anchors.",
            "Created VR simulations for Oculus Quest and HTC Vive with interactive environments.",
            "Improved XR performance with level streaming and LOD systems.",
            "Developing and training CNN-based computer vision models.",
          ],
        },
        {
          title: "Game Developer Intern",
          company: "Linchpin Global",
          location: "Karachi, Pakistan · Full-time, Onsite",
          period: "Nov 2024 – Feb 2025",
          summary:
            "Focused on AR/VR for real estate visualization—Unity, Vuforia, XR Toolkit, and Unreal Engine 5 walkthroughs.",
          bullets: [
            "Built AR applications with marker-based and markerless tracking for real estate visualization.",
            "Created immersive VR environments with Unity XR Toolkit and OpenXR for Quest and related headsets.",
            "Built 360° virtual tours and interactive walkthroughs in Unreal Engine 5 with cinematic lighting and navigation.",
            "Integrated interactive 3D models, UI, and spatial audio for stronger immersion.",
          ],
        },
        {
          title: "Data Automation & Reporting Specialist",
          company: "Billing Expert",
          location: "Pearland, USA · Full-time, Remote",
          period: "Jan 2023 – Jan 2024",
          summary:
            "Automated reporting and dashboards for business operations—bridging data sources into decisions.",
          bullets: [
            "Designed and maintained interactive Power BI dashboards for key business metrics.",
            "Automated data-entry workflows with Power Automate and n8n to cut manual errors.",
            "Integrated Excel and SQL sources for real-time synchronization across platforms.",
          ],
        },
      ],
    },
    contact: {
      eyebrow: "contact",
      headline: "tell me what you're building.",
      intro:
        "Share the platform, brief, references, and timeline. Unity, Unreal, AI/CV, 3D, or XR—start with the outcome and I'll reply with next steps.",
      email: "saadrehman264@hotmail.com",
      phone: "+92 313 2274337",
      cvUrl: "/Saad_Ur_Rehman_CV.pdf",
      cvLabel: "Download CV",
      formVisible: true,
      formNote: "Prefer a call or email? Use the details on the left—or send a note with the form.",
      successMessage: "Thanks — your note is saved. I'll get back to you soon.",
      errorMessage: "Could not save your message. Please try again or email me directly.",
      upworkLabel: "Contact me",
    },
  };
}

export function buildDefaultHomepage(): HomepageStore {
  return {
    hero: {
      eyebrow: "Saad ur Rehman / Unity · Unreal · AI / ML · XR",
      headline: "Real-time software. Intelligent systems.",
      description:
        "I build Unity and Unreal experiences, AI and computer-vision features, and XR products—helping teams ship interactive software that feels sharp in-engine and smart in production.",
      primaryCtaLabel: "Explore My Work",
      primaryCtaHref: "#selected-work",
      secondaryCtaLabel: "Contact me",
      secondaryCtaHref: "/contact",
      scrollLabel: "Scroll to Explore",
      mediaSrc: HERO_FALLBACK_MEDIA,
    },
    featuredProjects: featuredChaptersCopy.map((chapter) => ({
      ...chapter,
      enabled: true,
      mediaSrc: "",
    })),
    expertise: {
      eyebrow: "What I Build / 02",
      title: "Engines, intelligence, and space.",
      description:
        "From Unity systems to Unreal worlds, from vision models to XR prototypes—I connect technical depth with experiences people can actually use.",
      items: expertiseItems.map((item) => ({ ...item, enabled: true })),
    },
    process: {
      eyebrow: "My Process / 03",
      title: "From brief to build you can run.",
      description:
        "I keep milestones demoable. You see progress in the engine, in the model, or on device—not buried in slide decks.",
      steps: processSteps.map((step) => ({ ...step, enabled: true })),
    },
    trust: {
      eyebrow: "Client Trust / 04",
      title: "Reliable delivery. Clear communication.",
      description:
        "Clients hire me for focused execution—honest scoping, steady updates, and builds that survive review with their stakeholders.",
      support: "Feedback from real client projects.",
      enabled: true,
      reviewIds: ["r22", "r24", "r03", "r08", "r01", "r20", "r12", "r18"],
    },
    about: {
      eyebrow: "Behind the Work / 06",
      title: "One partner for engines and intelligence.",
      paragraph1:
        "I'm Saad ur Rehman—a Unity and Unreal developer working across real-time interactive software, AI/ML and computer vision, 3D pipelines, and XR.",
      paragraph2:
        "I like problems that need both systems thinking and visual judgment: shippable gameplay, spatial UX, and AI features that earn their place in the product.",
      ctaLabel: "More About Me",
      ctaHref: "/about",
    },
    finalCta: {
      eyebrow: "Build With Me / 05",
      title: "Need Unity, Unreal, AI, or XR?",
      description:
        "Whether you are shipping a game feature, an Unreal environment, a vision pipeline, or an AR/VR prototype—I can help you move from idea to runnable build.",
      closing: "Let's make the next milestone something your team can open and trust.",
      primaryLabel: "Contact me",
      primaryHref: "/contact",
      secondaryLabel: "Explore All Work",
      secondaryHref: "/work",
    },
  };
}

export function buildDefaultGlobal(): GlobalSiteSettings {
  const themePreset = DEFAULT_THEME_PRESET;
  return {
    upworkUrl: UPWORK_PROFILE_URL,
    footerLabel: "Saad ur Rehman / Real-time & AI Developer",
    footerHeadline: "Build what users can run.",
    footerDescription:
      "Unity, Unreal, AI/ML, computer vision, 3D, and XR—interactive software and intelligent systems made for production, not just demos.",
    footerTagline: "Engineered for play. Tuned for clarity.",
    siteTitle: "Saad ur Rehman | Unity · Unreal · AI / ML · XR",
    themePreset,
    themeColors: { ...getPreset(themePreset).colors },
  };
}
