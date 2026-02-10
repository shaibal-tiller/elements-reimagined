import {
  Map,
  Droplets,
  Activity,
  Server,
  Code2,
  Layers,
  FileText,
  ShieldCheck,
  Target,
  ArrowRightLeft,
  LayoutDashboard,
  Database,
  Languages,
  BarChart3,
  Globe2,
  Box,
  Terminal,
  Cpu,
  GitBranch,
  PieChart,
  Building,
  Users2,
  Landmark,
  Workflow,
  Award,
  UserCheck,
  Settings,
  BarChart,
  Mail,
  Bell,
  Shield,
  Wrench,
  LifeBuoy,
  LucideIcon,
} from "lucide-react";

// Icon registry mapping string names to Lucide icon components
export const iconRegistry: Record<string, LucideIcon> = {
  Map,
  Droplets,
  Activity,
  Server,
  Code2,
  Layers,
  FileText,
  ShieldCheck,
  Target,
  ArrowRightLeft,
  LayoutDashboard,
  Database,
  Languages,
  BarChart3,
  Globe2,
  Box,
  Terminal,
  Cpu,
  GitBranch,
  PieChart,
  Building,
  Users2,
  Landmark,
  Workflow,
  Award,
  UserCheck,
  Settings,
  BarChart,
  Mail,
  Bell,
  Shield,
  Wrench,
  LifeBuoy,
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
