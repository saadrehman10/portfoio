import { readFileSync, writeFileSync } from "node:fs";

for (const rel of ["./data/site-config.json", "./data/site-config.previous.json"]) {
  const j = JSON.parse(readFileSync(rel, "utf8"));
  j.pages.contact = {
    ...j.pages.contact,
    email: j.pages.contact.email || "saadrehman264@hotmail.com",
    phone: j.pages.contact.phone || "+92 313 2274337",
    cvUrl: "/Saad_Ur_Rehman_CV.pdf",
    cvLabel: "Download CV",
    formVisible: true,
    intro:
      j.pages.contact.intro ||
      "Share the platform, brief, references, and timeline. Unity, Unreal, AI/CV, 3D, or XR—start with the outcome and I'll reply with next steps.",
  };
  if (j.homepage?.hero) {
    j.homepage.hero.secondaryCtaLabel = "Contact me";
    j.homepage.hero.secondaryCtaHref = "/contact";
  }
  if (j.homepage?.finalCta) {
    j.homepage.finalCta.primaryLabel = "Contact me";
    j.homepage.finalCta.primaryHref = "/contact";
  }
  if (j.workPage) {
    j.workPage.ctaPrimaryLabel = "Contact me";
    j.workPage.ctaPrimaryHref = "/contact";
  }
  if (j.pages?.about) {
    j.pages.about.ctaSecondaryLabel = "Contact me";
    j.pages.about.ctaSecondaryHref = "/contact";
  }
  j.updatedAt = new Date().toISOString();
  writeFileSync(rel, `${JSON.stringify(j, null, 2)}\n`);
  console.log("patched", rel, j.pages.contact.cvUrl);
}
