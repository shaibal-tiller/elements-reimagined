import { icons, LucideIcon } from "lucide-react";
// Legacy aliases that exist as individual exports but not in the bulk `icons` object
import {
  Code2,
  BarChart3,
  Globe2,
  PieChart,
  Users2,
  BarChart,
} from "lucide-react";

// Icon registry: all current icons + legacy aliases for backward compatibility
export const iconRegistry: Record<string, LucideIcon> = {
  ...icons,
  Code2,
  BarChart3,
  Globe2,
  PieChart,
  Users2,
  BarChart,
};

/**
 * Get an icon component by name from the registry
 * Returns Code2 as default if icon is not found
 */
export const getIcon = (name: string): LucideIcon => {
  return iconRegistry[name] || Code2;
};

/**
 * Get multiple icon components from an array of names
 */
export const getIcons = (names: string[]): LucideIcon[] => {
  return names.map((name) => getIcon(name));
};
