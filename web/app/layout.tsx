import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import { DevtoolsConsoleFilter } from "@/components/DevtoolsConsoleFilter";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteTheme } from "@/components/SiteTheme";
import "./globals.css";

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Saad | 3D and motion for Upwork",
  description:
    "Personal portfolio for a 3D and motion designer. Product films, characters, spaces, and explainers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="top" className={`${body.variable} ${display.variable}`}>
        <SiteTheme />
        {process.env.NODE_ENV === "development" ? <DevtoolsConsoleFilter /> : null}
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
