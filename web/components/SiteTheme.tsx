import { readSiteConfig } from "@/lib/site-config";
import { resolveThemeColors, themeToCssVars } from "@/lib/themes";

/** Resolves published theme tokens for the root layout. */
export async function getSiteThemeStyle() {
  const config = await readSiteConfig();
  const colors = resolveThemeColors(config.global.themePreset, config.global.themeColors);
  return {
    preset: config.global.themePreset,
    style: themeToCssVars(colors),
    colorScheme: colors.colorScheme,
  };
}
