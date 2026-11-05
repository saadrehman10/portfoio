import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { readSiteConfig } from "@/lib/site-config";

export const instant = false;

export const metadata = {
  title: "Contact | Saad ur Rehman",
  description:
    "Contact Saad ur Rehman for Unity, Unreal, AI/computer vision, and XR work — email, phone, or send a project note.",
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export default async function ContactPage() {
  const config = await readSiteConfig();
  const contact = config.pages.contact;

  return (
    <main>
      <section className="page-hero contact-hero">
        <div className="wrap contact-hero-inner">
          <p className="kicker">{contact.eyebrow}</p>
          <h1>{contact.headline}</h1>
          {contact.intro ? <p className="contact-hero-lede">{contact.intro}</p> : null}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap contact-layout">
          <aside className="contact-details">
            <p className="kicker">reach me directly</p>
            <h2 className="manifesto" style={{ fontSize: "clamp(28px, 4vw, 40px)", maxWidth: "16ch" }}>
              Email or call anytime.
            </h2>
            {contact.formNote ? <p className="meta">{contact.formNote}</p> : null}

            <dl className="contact-detail-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={phoneHref(contact.phone)}>{contact.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Karachi, Pakistan</dd>
              </div>
              <div>
                <dt>Resume</dt>
                <dd>
                  <a href={contact.cvUrl} target="_blank" rel="noopener noreferrer">
                    View CV (PDF)
                  </a>
                </dd>
              </div>
            </dl>

            <div className="hero-actions" style={{ justifyContent: "flex-start", marginTop: 8 }}>
              <a className="pill solid" href={contact.cvUrl} download="Saad_Ur_Rehman_CV.pdf">
                {contact.cvLabel}
              </a>
              <Link className="pill" href="/work">
                View work
              </Link>
            </div>
          </aside>

          {contact.formVisible ? (
            <div className="contact-form-panel">
              <p className="kicker">send a note</p>
              <h2 style={{ margin: "8px 0 18px", fontSize: "clamp(24px, 3vw, 32px)" }}>Project brief</h2>
              <ContactForm
                successMessage={contact.successMessage}
                errorMessage={contact.errorMessage}
              />
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
