import Link from "next/link";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = {
  title: "Services | Saad ur Rehman",
  description:
    "Hire for Unity, Unreal Engine, AI/ML computer vision, XR (AR/VR), and 3D visualization.",
};

export default async function ServicesPage() {
  const { pages } = await readSiteConfig();
  const services = pages.services;
  const offers = services.offers.filter((offer) => offer.enabled);

  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker">{services.eyebrow}</p>
          <h1>{services.headline}</h1>
          <p>{services.intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 12 }}>
        <div className="wrap service-grid">
          {offers.map((offer, index) => (
            <article key={offer.title} className="service">
              <p className="kicker">0{index + 1}</p>
              <h3>{offer.title}</h3>
              <p>{offer.detail}</p>
              {offer.tools ? (
                <p className="meta" style={{ marginTop: 14 }}>
                  {offer.tools}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section paper" style={{ textAlign: "center" }}>
        <div className="wrap">
          <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
            Ready to scope a build?
          </h2>
          <p style={{ maxWidth: 520, margin: "12px auto 24px" }}>
            Bring the platform, timeline, and definition of done—I will come back with a clear first milestone.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link className="pill solid" href="/contact">
              Contact me
            </Link>
            <Link className="pill" href="/work">
              See work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
