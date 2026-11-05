import { readFileSync, writeFileSync } from "node:fs";

// Run with: npx tsx scripts/seed-site-config-from-defaults.mjs
const { buildDefaultSiteConfig, normalizeSiteConfig } = await import("../lib/site-config.ts");

const CONFIG_PATH = new URL("../data/site-config.json", import.meta.url);
const PREV_PATH = new URL("../data/site-config.previous.json", import.meta.url);

const prev = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
const fresh = buildDefaultSiteConfig();

const merged = normalizeSiteConfig({
  ...fresh,
  viewerModelSrc: prev.viewerModelSrc ?? fresh.viewerModelSrc,
  viewerBackgroundColor: prev.viewerBackgroundColor ?? fresh.viewerBackgroundColor,
  viewerEnvironmentPreset: prev.viewerEnvironmentPreset ?? fresh.viewerEnvironmentPreset,
  viewerHdriSrc: prev.viewerHdriSrc ?? fresh.viewerHdriSrc,
  viewerBackdrop: prev.viewerBackdrop ?? fresh.viewerBackdrop,
  viewerAnimationLoop: prev.viewerAnimationLoop ?? fresh.viewerAnimationLoop,
  viewerAutoPlayAnimation: prev.viewerAutoPlayAnimation ?? fresh.viewerAutoPlayAnimation,
  reviews: Array.isArray(prev.reviews) ? prev.reviews : fresh.reviews,
  global: {
    ...fresh.global,
    ...(prev.global ?? {}),
    // Prefer fresh CV-aligned chrome copy, keep theme + Upwork from previous
    upworkUrl: prev.global?.upworkUrl ?? fresh.global.upworkUrl,
    themePreset: prev.global?.themePreset ?? fresh.global.themePreset,
    themeColors: prev.global?.themeColors ?? fresh.global.themeColors,
    siteTitle: fresh.global.siteTitle,
    footerLabel: fresh.global.footerLabel,
    footerHeadline: fresh.global.footerHeadline,
    footerDescription: fresh.global.footerDescription,
    footerTagline: fresh.global.footerTagline,
  },
  homepage: {
    ...fresh.homepage,
    hero: {
      ...fresh.homepage.hero,
      mediaSrc: prev.homepage?.hero?.mediaSrc || fresh.homepage.hero.mediaSrc,
    },
  },
  // Always reseed public pages from CV defaults
  pages: fresh.pages,
  updatedAt: new Date().toISOString(),
});

const json = `${JSON.stringify(merged, null, 2)}\n`;
writeFileSync(CONFIG_PATH, json);
writeFileSync(PREV_PATH, json);

console.log("Seeded site-config.json");
console.log("about:", merged.pages.about.headline);
console.log("experience jobs:", merged.pages.experience.jobs.length);
console.log(
  "services:",
  merged.pages.services.offers.map((o) => o.title).join(" | "),
);
