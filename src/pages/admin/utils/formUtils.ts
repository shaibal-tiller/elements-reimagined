export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatEta = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return "";
  if (seconds < 60) return `~${Math.ceil(seconds)}s`;
  return `~${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
};

export const cleanFileName = (name: string): string => {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const uniqueCaption = (base: string, existing: string[]): string => {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base} (${i})`)) i++;
  return `${base} (${i})`;
};
