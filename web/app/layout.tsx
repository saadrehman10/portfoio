import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import { DevtoolsConsoleFilter } from "@/components/DevtoolsConsoleFilter";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteThemeStyle } from "@/components/SiteTheme";
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = await getSiteThemeStyle();

  return (
    <html lang="en" data-theme={theme.preset} style={theme.style}>
      <body id="top" className={`${body.variable} ${display.variable}`}>
        {process.env.NODE_ENV === "development" ? <DevtoolsConsoleFilter /> : null}
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
