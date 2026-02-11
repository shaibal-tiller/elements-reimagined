// Tailwind color name → representative hex values per shade
export const TW_COLORS: Record<string, Record<number, string>> = {
  red:     { 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c" },
  orange:  { 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c" },
  amber:   { 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309" },
  yellow:  { 300: "#fde047", 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207" },
  green:   { 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d" },
  emerald: { 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857" },
  teal:    { 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e" },
  cyan:    { 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490" },
  sky:     { 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1" },
  blue:    { 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8" },
  indigo:  { 300: "#a5b4fc", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca" },
  violet:  { 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9" },
  purple:  { 300: "#d8b4fe", 400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce" },
  rose:    { 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c" },
  pink:    { 300: "#f9a8d4", 400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d" },
};

export const TW_COLOR_NAMES = Object.keys(TW_COLORS);
export const TW_SHADES = [300, 400, 500, 600, 700] as const;

// Parse a Tailwind class like "bg-indigo-500/10" into parts
export function parseTwColor(value: string): { prefix: string; color: string; shade: string; opacity: string } {
  const match = value.match(/^(bg-|text-|border-|from-|to-)([a-z]+)-(\d+)(?:\/(\d+))?$/);
  if (match) {
    return { prefix: match[1], color: match[2], shade: match[3], opacity: match[4] || "" };
  }
  return { prefix: "", color: "", shade: "500", opacity: "" };
}

// Build a Tailwind class from parts
export function buildTwClass(prefix: string, color: string, shade: string | number, opacity?: string | number): string {
  let cls = `${prefix}${color}-${shade}`;
  if (opacity !== undefined && opacity !== "") cls += `/${opacity}`;
  return cls;
}

// Extract hex from "bg-[#1e1b4b]"
export function hexFromBgMain(value: string): string {
  const match = value.match(/bg-\[([#\w]+)\]/);
  return match ? match[1] : "#1e1b4b";
}

// Wrap hex into bg-[#hex]
export function bgMainFromHex(hex: string): string {
  return `bg-[${hex}]`;
}

// Convert hex like "#4f46e5" to rgba with opacity (0–100 scale from Tailwind)
function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

// Resolve a parsed TW color to a hex string
export function resolveHex(color: string, shade: string | number): string {
  return TW_COLORS[color]?.[Number(shade)] || "#888888";
}

// Resolve per-category tech stack pill styles.
// Takes the base theme pill settings and swaps in a category-specific color name.
// Falls back to the base pill styles when categoryColor is empty/undefined.
export function resolveTechPillStyles(
  theme: {
    pillBg: string;
    pillBorder: string;
    pillText: string;
    textMain: string;
  },
  categoryColor?: string,
): { backgroundColor: string; borderColor: string; color: string } {
  const pillBg = parseTwColor(theme.pillBg);
  const pillBorder = parseTwColor(theme.pillBorder);
  const pillText = parseTwColor(theme.pillText);

  const bgColor = categoryColor || pillBg.color || "indigo";
  const borderColorName = categoryColor || pillBorder.color || "indigo";
  const textColor = categoryColor || pillText.color || "indigo";

  const bgShade = pillBg.shade || "500";
  const bgOpacity = pillBg.opacity || "10";
  const borderShade = pillBorder.shade || "500";
  const borderOpacity = pillBorder.opacity || "20";
  const textShade = pillText.shade || "400";

  return {
    backgroundColor: bgOpacity
      ? hexToRgba(resolveHex(bgColor, bgShade), Number(bgOpacity))
      : resolveHex(bgColor, bgShade),
    borderColor: borderOpacity
      ? hexToRgba(resolveHex(borderColorName, borderShade), Number(borderOpacity))
      : resolveHex(borderColorName, borderShade),
    color: resolveHex(textColor, textShade),
  };
}

// Resolve theme object to inline styles for preview rendering
export function resolveThemeStyles(theme: {
  bgMain: string;
  accentBlur: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  textMain: string;
}) {
  const accent = parseTwColor(theme.accentBlur);
  const pillBg = parseTwColor(theme.pillBg);
  const pillBorder = parseTwColor(theme.pillBorder);
  const pillText = parseTwColor(theme.pillText);

  return {
    bgMain: { backgroundColor: hexFromBgMain(theme.bgMain) },
    accentBlur: { backgroundColor: resolveHex(accent.color, accent.shade) },
    pillBg: {
      backgroundColor: pillBg.opacity
        ? hexToRgba(resolveHex(pillBg.color, pillBg.shade), Number(pillBg.opacity))
        : resolveHex(pillBg.color, pillBg.shade),
    },
    pillBorder: {
      borderColor: pillBorder.opacity
        ? hexToRgba(resolveHex(pillBorder.color, pillBorder.shade), Number(pillBorder.opacity))
        : resolveHex(pillBorder.color, pillBorder.shade),
    },
    pillText: { color: resolveHex(pillText.color, pillText.shade) },
    textMain: { color: theme.textMain },
  };
}
