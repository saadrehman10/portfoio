"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteConfigStore } from "@/lib/site-config-types";
import type { ThemeColors, ThemePresetId } from "@/lib/themes";
import {
  THEME_PRESETS,
  getPreset,
  resolveThemeColors,
  themeToCssVars,
} from "@/lib/themes";

const COLOR_FIELDS: Array<{ key: keyof Omit<ThemeColors, "colorScheme">; label: string }> = [
  { key: "bg", label: "Canvas / background" },
  { key: "bgElevated", label: "Elevated surface" },
  { key: "text", label: "Primary text" },
  { key: "textSecondary", label: "Secondary text" },
  { key: "border", label: "Border" },
  { key: "accent", label: "Accent" },
  { key: "accentDeep", label: "Accent deep" },
];

function isHexColor(value: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function applyLivePreview(colors: ThemeColors) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const vars = themeToCssVars(colors) as Record<string, string>;
  for (const [key, value] of Object.entries(vars)) {
    if (key === "colorScheme") {
      root.style.colorScheme = value;
    } else if (key.startsWith("--")) {
      root.style.setProperty(key, value);
    }
  }
  root.dataset.theme = "preview";
}

export function GlobalSettingsManager({ initialConfig }: { initialConfig: SiteConfigStore }) {
  const [config, setConfig] = useState(initialConfig);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const resolvedColors = useMemo(
    () => resolveThemeColors(config.global.themePreset, config.global.themeColors),
    [config.global.themePreset, config.global.themeColors],
  );

  useEffect(() => {
    applyLivePreview(resolvedColors);
  }, [resolvedColors]);

  function updateGlobal<K extends keyof SiteConfigStore["global"]>(
    key: K,
    value: SiteConfigStore["global"][K],
  ) {
    setConfig((current) => ({
      ...current,
      global: { ...current.global, [key]: value },
    }));
  }

  function selectPreset(presetId: ThemePresetId) {
    if (presetId === "custom") {
      updateGlobal("themePreset", "custom");
      return;
    }
    const colors = { ...getPreset(presetId).colors };
    setConfig((current) => ({
      ...current,
      global: {
        ...current.global,
        themePreset: presetId,
        themeColors: colors,
      },
    }));
  }

  function updateThemeColor(key: keyof ThemeColors, value: string) {
    setConfig((current) => ({
      ...current,
      global: {
        ...current.global,
        themePreset: "custom",
        themeColors: {
          ...current.global.themeColors,
          [key]: value,
        },
      },
    }));
  }

  async function saveDraft() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    const data = (await response.json()) as { error?: string; config?: SiteConfigStore; message?: string };
    setSaving(false);
    if (!response.ok) {
      setMessage(data.error ?? "Save failed");
      return;
    }
    if (data.config) setConfig(data.config);
    setMessage(data.message ?? "Draft saved.");
  }

  async function publish() {
    setSaving(true);
    setMessage("");
    const save = await fetch("/api/admin/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    if (!save.ok) {
      setSaving(false);
      setMessage("Could not save draft before publish.");
      return;
    }
    const response = await fetch("/api/admin/site-config/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    });
    setSaving(false);
    if (!response.ok) {
      setMessage("Publish failed");
      return;
    }
    setMessage("Published. Theme, footer, and global settings are live.");
  }

  const global = config.global;
  const activePreset = global.themePreset;

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div className="admin-panel-head-copy">
          <h1>Global Settings</h1>
          <p className="meta">Site title, Upwork link, footer copy, and color themes.</p>
        </div>
        <div className="admin-quick-actions admin-panel-actions">
          <button type="button" className="pill" disabled={saving} onClick={saveDraft}>
            Save draft
          </button>
          <button type="button" className="pill solid" disabled={saving} onClick={publish}>
            Publish
          </button>
        </div>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-config-surface">
        <div className="admin-form-stack admin-form-stack-split">
          <label>
            Site title
            <input value={global.siteTitle} onChange={(e) => updateGlobal("siteTitle", e.target.value)} />
          </label>
          <label>
            Upwork profile URL
            <input value={global.upworkUrl} onChange={(e) => updateGlobal("upworkUrl", e.target.value)} />
          </label>

          <h2 className="admin-subtitle admin-form-span-2">Color theme</h2>
          <p className="meta admin-form-span-2" style={{ marginTop: -8 }}>
            Pick a preset or tune individual colors. Changes preview live in admin; publish to update the
            public site.
          </p>

          <div className="admin-theme-grid admin-form-span-2">
            {THEME_PRESETS.map((preset) => {
              const selected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`admin-theme-card${selected ? " is-selected" : ""}`}
                  onClick={() => selectPreset(preset.id)}
                >
                  <span className="admin-theme-swatches" aria-hidden>
                    <span style={{ background: preset.colors.bg }} />
                    <span style={{ background: preset.colors.bgElevated }} />
                    <span style={{ background: preset.colors.text }} />
                    <span style={{ background: preset.colors.accent }} />
                  </span>
                  <span className="admin-theme-card-copy">
                    <strong>{preset.name}</strong>
                    <span>{preset.description}</span>
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              className={`admin-theme-card${activePreset === "custom" ? " is-selected" : ""}`}
              onClick={() => selectPreset("custom")}
            >
              <span className="admin-theme-swatches" aria-hidden>
                <span style={{ background: resolvedColors.bg }} />
                <span style={{ background: resolvedColors.bgElevated }} />
                <span style={{ background: resolvedColors.text }} />
                <span style={{ background: resolvedColors.accent }} />
              </span>
              <span className="admin-theme-card-copy">
                <strong>Custom</strong>
                <span>Edit any color below to build your own palette.</span>
              </span>
            </button>
          </div>

          <div className="admin-theme-colors admin-form-span-2">
            {COLOR_FIELDS.map(({ key, label }) => {
              const value = resolvedColors[key];
              const hexForPicker = isHexColor(value) ? value : "#000000";
              return (
                <label key={key} className="admin-theme-color-field">
                  <span>{label}</span>
                  <span className="admin-theme-color-inputs">
                    <input
                      type="color"
                      value={hexForPicker}
                      onChange={(e) => updateThemeColor(key, e.target.value)}
                      aria-label={`${label} color picker`}
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateThemeColor(key, e.target.value)}
                      spellCheck={false}
                    />
                  </span>
                </label>
              );
            })}
            <label className="admin-theme-color-field">
              <span>Color scheme</span>
              <select
                value={resolvedColors.colorScheme}
                onChange={(e) =>
                  updateThemeColor("colorScheme", e.target.value as ThemeColors["colorScheme"])
                }
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </label>
          </div>

          <div className="admin-theme-preview admin-form-span-2" aria-hidden>
            <div
              className="admin-theme-preview-card"
              style={{
                background: resolvedColors.bg,
                color: resolvedColors.text,
                borderColor: resolvedColors.border,
              }}
            >
              <p style={{ color: resolvedColors.textSecondary, margin: 0 }}>Eyebrow / muted</p>
              <strong style={{ fontSize: 22 }}>Headline sample</strong>
              <p style={{ margin: "8px 0 14px", color: resolvedColors.textSecondary }}>
                Supporting text uses the secondary color against the canvas.
              </p>
              <span
                className="pill solid"
                style={{
                  background: resolvedColors.accent,
                  borderColor: resolvedColors.accent,
                  color: "#fff",
                  pointerEvents: "none",
                }}
              >
                Accent button
              </span>
            </div>
          </div>

          <h2 className="admin-subtitle admin-form-span-2">Footer</h2>
          <label>
            Footer label
            <input
              value={global.footerLabel}
              onChange={(e) => updateGlobal("footerLabel", e.target.value)}
            />
          </label>
          <label>
            Footer headline
            <input
              value={global.footerHeadline}
              onChange={(e) => updateGlobal("footerHeadline", e.target.value)}
            />
          </label>
          <label className="admin-form-span-2">
            Footer description
            <textarea
              rows={3}
              value={global.footerDescription}
              onChange={(e) => updateGlobal("footerDescription", e.target.value)}
            />
          </label>
          <label className="admin-form-span-2">
            Closing line
            <input
              value={global.footerTagline}
              onChange={(e) => updateGlobal("footerTagline", e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
