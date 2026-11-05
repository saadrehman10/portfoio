"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/admin/media", label: "Media", match: ["/admin/media"] },
  { href: "/admin/projects", label: "Projects", match: ["/admin/projects"] },
  { href: "/admin/configuration", label: "Work page", match: ["/admin/configuration"] },
  { href: "/admin/homepage", label: "Homepage", match: ["/admin/homepage"] },
];

function isActive(pathname: string, match: string[]) {
  return match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AdminShell({
  children,
  hasDraft = false,
}: {
  children: React.ReactNode;
  hasDraft?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="admin-shell admin-shell-top">
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <p className="admin-brand">Saad Portfolio Admin</p>
          <p className={`admin-status-pill ${hasDraft ? "is-draft" : "is-live"}`}>
            {hasDraft ? "Unpublished draft" : "All changes published"}
          </p>
        </div>
        <div className="admin-topbar-actions">
          <a className="pill ghost-light" href="/" target="_blank" rel="noopener noreferrer">
            Preview website
          </a>
          <a
            className="pill ghost-light"
            href="https://portfoio-seven-ashy.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit live site
          </a>
          <button type="button" className="pill admin-logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        <div className="admin-tabs-scroll">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              prefetch={false}
              className={isActive(pathname, tab.match) ? "admin-tab active" : "admin-tab"}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="admin-main" key={pathname}>
        {children}
      </div>
    </div>
  );
}
