import Link from "next/link";
import { UpworkHireLink } from "@/components/UpworkHireLink";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = {
  title: "Experience | Saad ur Rehman",
  description:
    "Game, AR/VR, and AI computer-vision experience — Techversol, Linchpin Global, and remote data systems work.",
};

export default async function ExperiencePage() {
  const { pages } = await readSiteConfig();
  const experience = pages.experience;

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">{experience.eyebrow}</p>
          <h1>{experience.headline}</h1>
          <p>{experience.intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ display: "grid", gap: 28 }}>
          {experience.jobs.map((job) => (
            <article key={`${job.company}-${job.period}`} className="service" style={{ padding: 28 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 16px",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>
                  <p className="kicker" style={{ marginBottom: 6 }}>
                    {job.company}
                  </p>
                  <h2 style={{ margin: 0, fontFamily: "var(--font-display), sans-serif", fontSize: 28 }}>
                    {job.title}
                  </h2>
                </div>
                <p className="meta" style={{ margin: 0 }}>
                  {job.period}
                </p>
              </div>
              <p className="meta" style={{ marginTop: 8 }}>
                {job.location}
              </p>
              <p style={{ marginTop: 14, maxWidth: "70ch" }}>{job.summary}</p>
              <ul style={{ margin: "16px 0 0", paddingLeft: "1.2rem", color: "var(--text-secondary)" }}>
                {job.bullets.map((bullet) => (
                  <li key={bullet} style={{ marginTop: 8, lineHeight: 1.55 }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section paper" style={{ textAlign: "center" }}>
        <div className="wrap">
          <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
            Looking for this kind of builder?
          </h2>
          <p style={{ maxWidth: 520, margin: "12px auto 24px" }}>
            Unity, Unreal, XR, or computer vision—share the brief and we can scope the next milestone.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <UpworkHireLink className="pill solid">Hire Me on Upwork</UpworkHireLink>
            <Link className="pill" href="/about">
              About me
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
