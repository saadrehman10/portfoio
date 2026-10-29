import type { CSSProperties } from "react";

export type ThemeColorScheme = "dark" | "light";

export type ThemeColors = {
  bg: string;
  bgElevated: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentDeep: string;
  colorScheme: ThemeColorScheme;
};

export type ThemePresetId =
  | "tech-slate"
  | "warm-atelier"
  | "midnight-emerald"
  | "obsidian-amber"
  | "paper-studio"
  | "custom";

export type ThemePreset = {
  id: ThemePresetId;
  name: string;
  description: string;
  colors: ThemeColors;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "tech-slate",
    name: "Tech Slate",
    description: "Dark charcoal canvas with cobalt accent — code-editor feel.",
    colors: {
      bg: "#0f1115",
      bgElevated: "#161a21",
      text: "#edeff2",
      textSecondary: "#8b929b",
      border: "#242832",
      accent: "#5b8cff",
      accentDeep: "#3d6fe0",
      colorScheme: "dark",
    },
  },
  {
    id: "warm-atelier",
    name: "Warm Atelier",
    description: "Cream paper surfaces with rose accent — original portfolio look.",
    colors: {
      bg: "#f4f0e6",
      bgElevated: "#fbf8f2",
      text: "#141311",
      textSecondary: "#6f675e",
      border: "rgba(20, 19, 17, 0.14)",
      accent: "#d6456a",
      accentDeep: "#a83252",
      colorScheme: "light",
    },
  },
  {
    id: "midnight-emerald",
    name: "Midnight Emerald",
    description: "Deep night background with emerald accents.",
    colors: {
      bg: "#0b1210",
      bgElevated: "#121a17",
      text: "#e8f0ec",
      textSecondary: "#8a9a92",
      border: "#1e2a25",
      accent: "#3ecf8e",
      accentDeep: "#249a66",
      colorScheme: "dark",
    },
  },
  {
    id: "obsidian-amber",
    name: "Obsidian Amber",
    description: "Near-black UI with warm amber highlights.",
    colors: {
      bg: "#100e0c",
      bgElevated: "#1a1714",
      text: "#f3efe8",
      textSecondary: "#9a9186",
      border: "#2a251f",
      accent: "#f0a45c",
      accentDeep: "#c77a35",
      colorScheme: "dark",
    },
  },
  {
    id: "paper-studio",
    name: "Paper Studio",
    description: "Clean light studio with ink and soft blue accent.",
    colors: {
      bg: "#f7f8fa",
      bgElevated: "#ffffff",
      text: "#12141a",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      accent: "#2563eb",
      accentDeep: "#1d4ed8",
      colorScheme: "light",
    },
  },
];

export const DEFAULT_THEME_PRESET: ThemePresetId = "tech-slate";

const PRESET_IDS = new Set<string>([
  ...THEME_PRESETS.map((p) => p.id),
  "custom",
]);

const HEX_OR_RGBA =
  /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\))$/;

export function getPreset(id: string | undefined | null): ThemePreset {
  return THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
}

export function sanitizeThemePresetId(value: unknown): ThemePresetId {
  if (typeof value === "string" && PRESET_IDS.has(value)) {
    return value as ThemePresetId;
  }
  return DEFAULT_THEME_PRESET;
}

export function sanitizeColor(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!HEX_OR_RGBA.test(trimmed)) return fallback;
  return trimmed;
}

export function sanitizeThemeColors(
  partial: unknown,
  fallback: ThemeColors,
): ThemeColors {
  const raw =
    partial && typeof partial === "object"
      ? (partial as Partial<ThemeColors>)
      : {};
  return {
    bg: sanitizeColor(raw.bg, fallback.bg),
    bgElevated: sanitizeColor(raw.bgElevated, fallback.bgElevated),
    text: sanitizeColor(raw.text, fallback.text),
    textSecondary: sanitizeColor(raw.textSecondary, fallback.textSecondary),
    border: sanitizeColor(raw.border, fallback.border),
    accent: sanitizeColor(raw.accent, fallback.accent),
    accentDeep: sanitizeColor(raw.accentDeep, fallback.accentDeep),
    colorScheme: raw.colorScheme === "light" ? "light" : "dark",
  };
}

export function resolveThemeColors(
  presetId: ThemePresetId,
  customColors?: Partial<ThemeColors> | null,
): ThemeColors {
  if (presetId === "custom") {
    return sanitizeThemeColors(customColors, getPreset(DEFAULT_THEME_PRESET).colors);
  }
  return getPreset(presetId).colors;
}

export function themeToCssVars(colors: ThemeColors): CSSProperties {
  const shadow =
    colors.colorScheme === "dark"
      ? "0 18px 50px rgba(0, 0, 0, 0.45)"
      : "0 18px 50px rgba(20, 19, 17, 0.12)";
  const lineLight =
    colors.colorScheme === "dark"
      ? "rgba(237, 239, 242, 0.14)"
      : "rgba(20, 19, 17, 0.08)";

  return {
    ["--bg" as string]: colors.bg,
    ["--bg-elevated" as string]: colors.bgElevated,
    ["--text" as string]: colors.text,
    ["--text-secondary" as string]: colors.textSecondary,
    ["--border" as string]: colors.border,
    ["--accent" as string]: colors.accent,
    ["--accent-deep" as string]: colors.accentDeep,
    ["--ink" as string]: colors.text,
    ["--ink-soft" as string]: colors.textSecondary,
    ["--cream" as string]: colors.bg,
    ["--cream-deep" as string]: colors.bgElevated,
    ["--paper" as string]: colors.bgElevated,
    ["--line" as string]: colors.border,
    ["--line-light" as string]: lineLight,
    ["--muted" as string]: colors.textSecondary,
    ["--shadow" as string]: shadow,
    colorScheme: colors.colorScheme,
  };
}

/** Plain CSS string for inline <style> injection when React.CSSProperties is awkward. */
export function themeToCssText(colors: ThemeColors): string {
  const vars = themeToCssVars(colors) as Record<string, string>;
  return Object.entries(vars)
    .filter(([key]) => key.startsWith("--") || key === "colorScheme")
    .map(([key, value]) =>
      key === "colorScheme" ? `color-scheme: ${value};` : `${key}: ${value};`,
    )
    .join(" ");
}
