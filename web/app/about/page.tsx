import Link from "next/link";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = {
  title: "About | Saad ur Rehman",
  description:
    "Unity and Unreal game developer specializing in AR/VR/XR and AI computer vision — based in Karachi, Pakistan.",
};

export default async function AboutPage() {
  const { pages } = await readSiteConfig();
  const about = pages.about;

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">{about.eyebrow}</p>
          <p className="meta" style={{ marginTop: 8 }}>
            {about.name}
            {about.location ? ` · ${about.location}` : ""}
          </p>
          <h1>{about.headline}</h1>
          <p>{about.intro}</p>
          <div className="hero-actions" style={{ justifyContent: "flex-start", marginTop: 28 }}>
            <Link className="pill solid" href={about.ctaPrimaryHref}>
              {about.ctaPrimaryLabel}
            </Link>
            <Link className="pill" href={about.ctaSecondaryHref}>
              {about.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="kicker">objective</p>
          <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 42px)", maxWidth: "28ch" }}>
            Built for immersion and intelligence.
          </h2>
          <p className="home-section-sub" style={{ marginTop: 18, maxWidth: "68ch" }}>
            {about.objective}
          </p>
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <p className="kicker">skills &amp; abilities</p>
          <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
            Stack I ship with.
          </h2>
          <div className="service-grid" style={{ marginTop: 36 }}>
            {about.skillGroups.map((group) => (
              <article key={group.title} className="service">
                <h3>{group.title}</h3>
                <p>{group.items}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap reason-grid">
          <article className="reason">
            <p className="kicker">education</p>
            <h3>{about.educationTitle}</h3>
            <p>
              {about.educationSchool}
              <br />
              {about.educationPeriod}
            </p>
          </article>
          <article className="reason" style={{ gridColumn: "span 2" }}>
            <p className="kicker">certificates</p>
            <div style={{ display: "grid", gap: 18, marginTop: 8 }}>
              {about.certificates.map((cert) => (
                <div key={cert.title}>
                  <h3 style={{ fontSize: 22, margin: "0 0 6px" }}>{cert.title}</h3>
                  <p style={{ margin: 0 }}>{cert.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section paper" style={{ textAlign: "center" }}>
        <div className="wrap">
          <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
            Want the full timeline?
          </h2>
          <p style={{ maxWidth: 520, margin: "12px auto 24px" }}>
            See roles at Techversol, Linchpin Global, and more—or start a conversation on Upwork.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link className="pill solid" href="/experience">
              Past experience
            </Link>
            <Link className="pill" href="/services">
              Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
