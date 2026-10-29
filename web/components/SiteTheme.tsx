import { Suspense } from "react";
import { readSiteConfig } from "@/lib/site-config";
import { resolveThemeColors, themeToCssVars } from "@/lib/themes";

async function SiteThemeStyle() {
  const config = await readSiteConfig();
  const colors = resolveThemeColors(config.global.themePreset, config.global.themeColors);
  const vars = themeToCssVars(colors) as Record<string, string>;
  const css = Object.entries(vars)
    .map(([key, value]) =>
      key === "colorScheme" ? `color-scheme: ${value};` : `${key}: ${value};`,
    )
    .join(" ");

  return (
    <style
      data-site-theme={config.global.themePreset}
      dangerouslySetInnerHTML={{
        __html: `html { ${css} }`,
      }}
    />
  );
}

/** Injects published theme CSS variables without blocking the root layout prerender. */
export function SiteTheme() {
  return (
    <Suspense fallback={null}>
      <SiteThemeStyle />
    </Suspense>
  );
}
