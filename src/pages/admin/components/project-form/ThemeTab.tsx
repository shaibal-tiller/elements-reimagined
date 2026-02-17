import React from "react";
import { FirestoreProject } from "../../../../types/firebase";
import {
  TW_COLORS,
  TW_COLOR_NAMES,
  TW_SHADES,
  parseTwColor,
  buildTwClass,
  hexFromBgMain,
  bgMainFromHex,
  resolveThemeStyles,
} from "../../../../lib/twColors";
import { themePresets } from "../../data/themePresets";

interface ThemeTabProps {
  formData: FirestoreProject;
  updateTheme: (field: string, value: string) => void;
  applyThemePreset: (preset: typeof themePresets[0]) => void;
}

const ThemeTab: React.FC<ThemeTabProps> = ({
  formData,
  updateTheme,
  applyThemePreset,
}) => {
  const gradientParsed = {
    from: parseTwColor(formData.theme.bgGradient.split(" ")[0] || "from-indigo-400"),
    to: parseTwColor(formData.theme.bgGradient.split(" ")[1] || "to-blue-400"),
  };
  const accentParsed = parseTwColor(formData.theme.accentBlur);
  const pillBgParsed = parseTwColor(formData.theme.pillBg);
  const pillBorderParsed = parseTwColor(formData.theme.pillBorder);
  const pillTextParsed = parseTwColor(formData.theme.pillText);

  const sharedAccentColor = accentParsed.color || "indigo";

  const updateAccentColor = (color: string) => {
    const aShade = accentParsed.shade || "500";
    const pbShade = pillBgParsed.shade || "500";
    const pbOpacity = pillBgParsed.opacity || "10";
    const pbrShade = pillBorderParsed.shade || "500";
    const pbrOpacity = pillBorderParsed.opacity || "20";
    const ptShade = pillTextParsed.shade || "400";
    updateTheme("accentBlur", buildTwClass("bg-", color, aShade));
    updateTheme("pillBg", buildTwClass("bg-", color, pbShade, pbOpacity));
    updateTheme("pillBorder", buildTwClass("border-", color, pbrShade, pbrOpacity));
    updateTheme("pillText", buildTwClass("text-", color, ptShade));
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Quick Presets
        </label>
        <div className="grid grid-cols-4 gap-2">
          {themePresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyThemePreset(preset)}
              className={`
                flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all
                ${formData.theme.primary === preset.theme.primary && formData.theme.secondary === preset.theme.secondary
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-600 hover:border-slate-500 bg-slate-700/30"
                }
              `}
            >
              <div
                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: preset.color }}
              />
              <span className="text-xs text-slate-300 truncate">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Identity */}
      <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
        <label className="block text-sm font-medium text-slate-300 mb-3">Color Identity</label>
        {(["primary", "secondary"] as const).map((field) => (
          <div key={field} className="mb-3 last:mb-0">
            <label className="block text-xs font-medium text-slate-400 mb-2 capitalize">{field}</label>
            <div className="flex flex-wrap gap-2">
              {TW_COLOR_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => updateTheme(field, name)}
                  title={name}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    formData.theme[field] === name
                      ? "border-white scale-110 ring-2 ring-white/30"
                      : "border-transparent hover:border-slate-400"
                  }`}
                  style={{ backgroundColor: TW_COLORS[name]?.[500] || "#888" }}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">{formData.theme[field]}</span>
          </div>
        ))}
      </div>

      {/* Backgrounds */}
      <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
        <label className="block text-sm font-medium text-slate-300 mb-3">Backgrounds</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Banner Background</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hexFromBgMain(formData.theme.bgMain)}
                onChange={(e) => updateTheme("bgMain", bgMainFromHex(e.target.value))}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-600 bg-transparent"
              />
              <span className="text-xs text-slate-400 font-mono">{hexFromBgMain(formData.theme.bgMain)}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Accent Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.theme.textMain}
                onChange={(e) => updateTheme("textMain", e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-600 bg-transparent"
              />
              <span className="text-xs text-slate-400 font-mono">{formData.theme.textMain}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient */}
      <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
        <label className="block text-sm font-medium text-slate-300 mb-3">Gradient</label>
        <div className="grid grid-cols-2 gap-4 mb-3">
          {(["from", "to"] as const).map((dir) => {
            const parsed = gradientParsed[dir];
            const prefix = dir === "from" ? "from-" : "to-";
            return (
              <div key={dir}>
                <label className="block text-xs font-medium text-slate-400 mb-2 capitalize">{dir}</label>
                <div className="flex gap-2">
                  <select
                    value={parsed.color}
                    onChange={(e) => {
                      const other = dir === "from" ? formData.theme.bgGradient.split(" ")[1] : formData.theme.bgGradient.split(" ")[0];
                      const built = buildTwClass(prefix, e.target.value, parsed.shade || "400");
                      updateTheme("bgGradient", dir === "from" ? `${built} ${other}` : `${other} ${built}`);
                    }}
                    className="flex-1 px-2 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-xs"
                  >
                    {TW_COLOR_NAMES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <select
                    value={parsed.shade || "400"}
                    onChange={(e) => {
                      const other = dir === "from" ? formData.theme.bgGradient.split(" ")[1] : formData.theme.bgGradient.split(" ")[0];
                      const built = buildTwClass(prefix, parsed.color, e.target.value);
                      updateTheme("bgGradient", dir === "from" ? `${built} ${other}` : `${other} ${built}`);
                    }}
                    className="w-16 px-2 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-xs"
                  >
                    {TW_SHADES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
        {/* Gradient preview bar */}
        <div
          className="h-6 rounded-lg"
          style={{
            background: `linear-gradient(to right, ${TW_COLORS[gradientParsed.from.color]?.[Number(gradientParsed.from.shade) || 400] || "#818cf8"}, ${TW_COLORS[gradientParsed.to.color]?.[Number(gradientParsed.to.shade) || 400] || "#60a5fa"})`,
          }}
        />
        <span className="text-[10px] text-slate-500 font-mono mt-1 block">{formData.theme.bgGradient}</span>
      </div>

      {/* Accent & Pills */}
      <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
        <label className="block text-sm font-medium text-slate-300 mb-3">Accent &amp; Pills</label>

        {/* Shared color selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-400 mb-2">Shared Accent Color</label>
          <div className="flex flex-wrap gap-2">
            {TW_COLOR_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => updateAccentColor(name)}
                title={name}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  sharedAccentColor === name
                    ? "border-white scale-110 ring-2 ring-white/30"
                    : "border-transparent hover:border-slate-400"
                }`}
                style={{ backgroundColor: TW_COLORS[name]?.[500] || "#888" }}
              />
            ))}
          </div>
        </div>

        {/* Individual controls */}
        <div className="space-y-3">
          {/* Accent Blur */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-400 w-20 flex-shrink-0">Accent Blur</label>
            <div className="flex gap-1">
              {TW_SHADES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateTheme("accentBlur", buildTwClass("bg-", accentParsed.color || sharedAccentColor, s))}
                  className={`px-2 py-1 text-[10px] rounded transition-all ${
                    String(accentParsed.shade) === String(s)
                      ? "bg-white/20 text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >{s}</button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-mono ml-auto">{formData.theme.accentBlur}</span>
          </div>

          {/* Pill Background */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-400 w-20 flex-shrink-0">Pill BG</label>
            <div className="flex gap-1">
              {TW_SHADES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateTheme("pillBg", buildTwClass("bg-", pillBgParsed.color || sharedAccentColor, s, pillBgParsed.opacity || "10"))}
                  className={`px-2 py-1 text-[10px] rounded transition-all ${
                    String(pillBgParsed.shade) === String(s)
                      ? "bg-white/20 text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >{s}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={Number(pillBgParsed.opacity) || 10}
                onChange={(e) => updateTheme("pillBg", buildTwClass("bg-", pillBgParsed.color || sharedAccentColor, pillBgParsed.shade || "500", e.target.value))}
                className="w-20 accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500 w-6">{pillBgParsed.opacity || "10"}%</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono ml-auto">{formData.theme.pillBg}</span>
          </div>

          {/* Pill Border */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-400 w-20 flex-shrink-0">Pill Border</label>
            <div className="flex gap-1">
              {TW_SHADES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateTheme("pillBorder", buildTwClass("border-", pillBorderParsed.color || sharedAccentColor, s, pillBorderParsed.opacity || "20"))}
                  className={`px-2 py-1 text-[10px] rounded transition-all ${
                    String(pillBorderParsed.shade) === String(s)
                      ? "bg-white/20 text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >{s}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={Number(pillBorderParsed.opacity) || 20}
                onChange={(e) => updateTheme("pillBorder", buildTwClass("border-", pillBorderParsed.color || sharedAccentColor, pillBorderParsed.shade || "500", e.target.value))}
                className="w-20 accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500 w-6">{pillBorderParsed.opacity || "20"}%</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono ml-auto">{formData.theme.pillBorder}</span>
          </div>

          {/* Pill Text */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-400 w-20 flex-shrink-0">Pill Text</label>
            <div className="flex gap-1">
              {TW_SHADES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateTheme("pillText", buildTwClass("text-", pillTextParsed.color || sharedAccentColor, s))}
                  className={`px-2 py-1 text-[10px] rounded transition-all ${
                    String(pillTextParsed.shade) === String(s)
                      ? "bg-white/20 text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >{s}</button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-mono ml-auto">{formData.theme.pillText}</span>
          </div>
        </div>
      </div>

      {/* Tech Stack Colors */}
      <div className="p-4 bg-slate-700/20 rounded-xl border border-slate-600/50">
        <label className="block text-sm font-medium text-slate-300 mb-3">Tech Stack Colors</label>
        <p className="text-[10px] text-slate-500 mb-3">Per-category pill hue override. Leave empty to use the shared accent color.</p>
        {([
          { field: "techFrontendColor" as const, label: "Frontend" },
          { field: "techBackendColor" as const, label: "Backend" },
          { field: "techDevopsColor" as const, label: "DevOps" },
        ]).map(({ field, label }) => (
          <div key={field} className="mb-3 last:mb-0">
            <label className="block text-xs font-medium text-slate-400 mb-2">{label}</label>
            <div className="flex flex-wrap gap-2">
              {/* "None" option — clears the override */}
              <button
                type="button"
                onClick={() => updateTheme(field, "")}
                title="None (use default)"
                className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center text-[8px] font-bold ${
                  !formData.theme[field]
                    ? "border-white scale-110 ring-2 ring-white/30 text-white"
                    : "border-transparent hover:border-slate-400 text-slate-500"
                }`}
                style={{ backgroundColor: "#334155" }}
              >
                —
              </button>
              {TW_COLOR_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => updateTheme(field, name)}
                  title={name}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    formData.theme[field] === name
                      ? "border-white scale-110 ring-2 ring-white/30"
                      : "border-transparent hover:border-slate-400"
                  }`}
                  style={{ backgroundColor: TW_COLORS[name]?.[500] || "#888" }}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">{formData.theme[field] || "(default)"}</span>
          </div>
        ))}
      </div>

      {/* Theme Preview */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Theme Preview
        </label>
        {(() => {
          const styles = resolveThemeStyles(formData.theme);
          return (
            <div className="p-4 rounded-xl" style={styles.bgMain}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="border px-3 py-1 rounded-full text-xs font-bold uppercase"
                  style={{ ...styles.pillBg, ...styles.pillText, ...styles.pillBorder }}
                >
                  Category
                </span>
              </div>
              <h4 className="text-white text-lg font-bold mb-1">Sample Title</h4>
              <p className="text-slate-300 text-sm">Subtitle text here</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default ThemeTab;
