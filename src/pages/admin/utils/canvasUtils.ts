export type AnnotateTool = "line" | "arrow" | "dashed" | "rectangle" | "ellipse" | "text" | "select";
export type Mode = "crop" | "annotate";
export type AspectLabel = "Free" | "16:9" | "4:3" | "1:1";

export interface Shape {
  type: Exclude<AnnotateTool, "select">;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  width: number;
  dashed: boolean;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
}

export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type CropHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | "move" | null;

export const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff",
  "#000000", "#64748b",
];

export const STROKE_WIDTHS = [
  { label: "Thin", value: 2 },
  { label: "Medium", value: 4 },
  { label: "Thick", value: 8 },
];

export const ASPECTS: { label: AspectLabel; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
];

export const HANDLE_SIZE = 8;

export const FONT_FAMILIES = [
  { label: "Sans", value: "Arial, Helvetica, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "'Courier New', Courier, monospace" },
  { label: "Impact", value: "Impact, 'Arial Black', sans-serif" },
  { label: "Comic", value: "'Comic Sans MS', cursive" },
];

export const FONT_SIZES = [16, 24, 32, 48, 64, 80, 96, 128];

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  ctx.save();
  ctx.strokeStyle = shape.color;
  ctx.fillStyle = shape.color;
  ctx.lineWidth = shape.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (shape.dashed) {
    ctx.setLineDash([shape.width * 3, shape.width * 2]);
  } else {
    ctx.setLineDash([]);
  }

  switch (shape.type) {
    case "line":
    case "dashed":
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
      break;

    case "arrow": {
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
      const angle = Math.atan2(shape.endY - shape.startY, shape.endX - shape.startX);
      const headLen = shape.width * 4;
      ctx.beginPath();
      ctx.moveTo(shape.endX, shape.endY);
      ctx.lineTo(
        shape.endX - headLen * Math.cos(angle - Math.PI / 6),
        shape.endY - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        shape.endX - headLen * Math.cos(angle + Math.PI / 6),
        shape.endY - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "rectangle":
      ctx.beginPath();
      ctx.rect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY);
      ctx.stroke();
      break;

    case "ellipse": {
      const cx = (shape.startX + shape.endX) / 2;
      const cy = (shape.startY + shape.endY) / 2;
      const rx = Math.abs(shape.endX - shape.startX) / 2;
      const ry = Math.abs(shape.endY - shape.startY) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case "text":
      if (shape.text) {
        ctx.setLineDash([]);
        const fs = shape.fontSize || Math.max(16, shape.width * 6);
        const ff = shape.fontFamily || "Arial, Helvetica, sans-serif";
        ctx.font = `bold ${fs}px ${ff}`;
        ctx.fillText(shape.text, shape.startX, shape.startY);
      }
      break;
  }

  ctx.restore();
}

export function getShapeBounds(s: Shape) {
  const minX = Math.min(s.startX, s.endX);
  const minY = Math.min(s.startY, s.endY);
  const maxX = Math.max(s.startX, s.endX);
  const maxY = Math.max(s.startY, s.endY);
  return { minX, minY, maxX, maxY };
}

export function hitTestShape(s: Shape, x: number, y: number, tolerance: number): boolean {
  if (s.type === "text") {
    const fontSize = s.fontSize || Math.max(16, s.width * 6);
    const textW = (s.text?.length || 1) * fontSize * 0.6;
    return x >= s.startX && x <= s.startX + textW && y >= s.startY - fontSize && y <= s.startY;
  }

  if (s.type === "rectangle") {
    const b = getShapeBounds(s);
    const nearLeft = Math.abs(x - b.minX) < tolerance && y >= b.minY - tolerance && y <= b.maxY + tolerance;
    const nearRight = Math.abs(x - b.maxX) < tolerance && y >= b.minY - tolerance && y <= b.maxY + tolerance;
    const nearTop = Math.abs(y - b.minY) < tolerance && x >= b.minX - tolerance && x <= b.maxX + tolerance;
    const nearBottom = Math.abs(y - b.maxY) < tolerance && x >= b.minX - tolerance && x <= b.maxX + tolerance;
    return nearLeft || nearRight || nearTop || nearBottom;
  }

  if (s.type === "ellipse") {
    const cx = (s.startX + s.endX) / 2;
    const cy = (s.startY + s.endY) / 2;
    const rx = Math.abs(s.endX - s.startX) / 2;
    const ry = Math.abs(s.endY - s.startY) / 2;
    if (rx < 1 || ry < 1) return false;
    const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
    return Math.abs(d - 1) < tolerance / Math.min(rx, ry);
  }

  // Line / arrow / dashed — distance to line segment
  const dx = s.endX - s.startX;
  const dy = s.endY - s.startY;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(x - s.startX, y - s.startY) < tolerance;
  let t = ((x - s.startX) * dx + (y - s.startY) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const px = s.startX + t * dx;
  const py = s.startY + t * dy;
  return Math.hypot(x - px, y - py) < tolerance;
}

export function drawCropOverlay(
  ctx: CanvasRenderingContext2D,
  imgW: number,
  imgH: number,
  crop: CropRect
) {
  // Dim outside area
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, imgW, crop.y);
  ctx.fillRect(0, crop.y, crop.x, crop.h);
  ctx.fillRect(crop.x + crop.w, crop.y, imgW - crop.x - crop.w, crop.h);
  ctx.fillRect(0, crop.y + crop.h, imgW, imgH - crop.y - crop.h);

  // Border
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);

  // Rule of thirds lines
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  for (let i = 1; i <= 2; i++) {
    const xLine = crop.x + (crop.w * i) / 3;
    const yLine = crop.y + (crop.h * i) / 3;
    ctx.beginPath();
    ctx.moveTo(xLine, crop.y);
    ctx.lineTo(xLine, crop.y + crop.h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(crop.x, yLine);
    ctx.lineTo(crop.x + crop.w, yLine);
    ctx.stroke();
  }

  // Corner handles
  ctx.fillStyle = "#3b82f6";
  const hs = HANDLE_SIZE;
  const handles: [number, number][] = [
    [crop.x, crop.y],
    [crop.x + crop.w, crop.y],
    [crop.x, crop.y + crop.h],
    [crop.x + crop.w, crop.y + crop.h],
    [crop.x + crop.w / 2, crop.y],
    [crop.x + crop.w / 2, crop.y + crop.h],
    [crop.x, crop.y + crop.h / 2],
    [crop.x + crop.w, crop.y + crop.h / 2],
  ];
  for (const [hx, hy] of handles) {
    ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
  }
}

export function getCropHandle(crop: CropRect, x: number, y: number, tolerance: number): CropHandle {
  const { x: cx, y: cy, w, h } = crop;
  const midX = cx + w / 2;
  const midY = cy + h / 2;
  const t = tolerance;

  if (Math.abs(x - cx) < t && Math.abs(y - cy) < t) return "nw";
  if (Math.abs(x - (cx + w)) < t && Math.abs(y - cy) < t) return "ne";
  if (Math.abs(x - cx) < t && Math.abs(y - (cy + h)) < t) return "sw";
  if (Math.abs(x - (cx + w)) < t && Math.abs(y - (cy + h)) < t) return "se";
  if (Math.abs(x - midX) < t && Math.abs(y - cy) < t) return "n";
  if (Math.abs(x - midX) < t && Math.abs(y - (cy + h)) < t) return "s";
  if (Math.abs(x - cx) < t && Math.abs(y - midY) < t) return "w";
  if (Math.abs(x - (cx + w)) < t && Math.abs(y - midY) < t) return "e";
  if (x >= cx && x <= cx + w && y >= cy && y <= cy + h) return "move";
  return null;
}

export function getCropCursor(handle: CropHandle): string {
  switch (handle) {
    case "nw":
    case "se":
      return "nwse-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    case "move":
      return "move";
    default:
      return "crosshair";
  }
}
