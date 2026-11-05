import Link from "next/link";
import { Suspense } from "react";
import { buildDefaultGlobal, buildDefaultPages } from "@/lib/cms/homepage-defaults";
import { readSiteConfig } from "@/lib/site-config";
import type { GlobalSiteSettings } from "@/lib/cms/homepage-defaults";

const year = new Date().getFullYear();
const defaultContact = buildDefaultPages().contact;

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function FooterMarkup({
  global,
  email,
  phone,
}: {
  global: GlobalSiteSettings;
  email: string;
  phone: string;
}) {
  return (
    <footer className="site-footer">
      <div className="site-footer-glow" aria-hidden />

      <div className="wrap site-footer-inner">
        <div className="site-footer-intro">
          <p className="site-footer-label">{global.footerLabel}</p>
          <h2 className="site-footer-headline">{global.footerHeadline}</h2>
          <p className="site-footer-desc">{global.footerDescription}</p>
          <div className="site-footer-actions">
            <Link className="pill solid site-footer-hire" href="/contact">
              Contact me
            </Link>
            <Link className="pill ghost-light" href="/work">
              View My Work
            </Link>
          </div>
        </div>

        <div className="site-footer-columns">
          <nav aria-label="Explore">
            <h3>Explore</h3>
            <Link href="/work">Selected Work</Link>
            <Link href="/services">Services</Link>
            <Link href="/experience">Experience</Link>
            <Link href="/about">About Me</Link>
            <Link href="/reviews">Client Feedback</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <nav aria-label="Connect">
            <h3>Connect</h3>
            <a href={`mailto:${email}`}>{email}</a>
            <a href={phoneHref(phone)}>{phone}</a>
            <a href="/Saad_Ur_Rehman_CV.pdf" download="Saad_Ur_Rehman_CV.pdf">
              Download CV
            </a>
            <Link href="/contact">Send a project note</Link>
          </nav>
          <div>
            <h3>What I Do</h3>
            <p className="site-footer-specialty">Unity Development</p>
            <p className="site-footer-specialty">Unreal Engine</p>
            <p className="site-footer-specialty">AI / ML / Computer Vision</p>
            <p className="site-footer-specialty">3D &amp; XR (AR / VR)</p>
          </div>
        </div>

        <p className="site-footer-signature" aria-hidden={false}>
          Saad ur Rehman
        </p>

        <div className="site-footer-bar">
          <p className="site-footer-copy">© {year} Saad ur Rehman. All rights reserved.</p>
          <p className="site-footer-tagline">{global.footerTagline}</p>
          <a className="site-footer-top" href="#top">
            Back to Top
          </a>
        </div>
      </div>
    </footer>
  );
}

async function SiteFooterAsync() {
  const config = await readSiteConfig();
  return (
    <FooterMarkup
      global={config.global}
      email={config.pages.contact.email}
      phone={config.pages.contact.phone}
    />
  );
}

export function SiteFooter() {
  return (
    <Suspense
      fallback={
        <FooterMarkup
          global={buildDefaultGlobal()}
          email={defaultContact.email}
          phone={defaultContact.phone}
        />
      }
    >
      <SiteFooterAsync />
    </Suspense>
  );
}
