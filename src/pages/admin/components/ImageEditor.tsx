import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  X,
  Crop,
  Pencil,
  Undo2,
  Save,
  Loader2,
  Minus,
  Square,
  Circle,
  Type,
  ArrowRight,
  MoveRight,
  Move,
  ZoomIn,
  ZoomOut,
  Trash2,
} from "lucide-react";
import { uploadMedia } from "../../../services/storageService";
import {
  type AnnotateTool,
  type Mode,
  type Shape,
  type CropRect,
  type CropHandle,
  COLORS,
  STROKE_WIDTHS,
  ASPECTS,
  FONT_FAMILIES,
  FONT_SIZES,
  drawShape,
  getShapeBounds,
  hitTestShape,
  drawCropOverlay,
  getCropHandle,
  getCropCursor,
} from "../utils/canvasUtils";

interface ImageEditorProps {
  src: string;
  onSave: (newUrl: string, newPath: string) => void;
  onClose: () => void;
  uploadFolder: string;
}

export default function ImageEditor({
  src,
  onSave,
  onClose,
  uploadFolder,
}: ImageEditorProps) {
  const [mode, setMode] = useState<Mode>("crop");
  const [uploading, setUploading] = useState(false);

  // Zoom (for annotate view)
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 3;

  // Crop state
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [cropHandle, setCropHandle] = useState<CropHandle>(null);
  const [cropDragStart, setCropDragStart] = useState<{ x: number; y: number; rect: CropRect } | null>(null);
  const [croppedSrc, setCroppedSrc] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  // Annotate state
  const [tool, setTool] = useState<AnnotateTool>("arrow");
  const [color, setColor] = useState("#ef4444");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string } | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectDragStart, setSelectDragStart] = useState<{ x: number; y: number; shape: Shape } | null>(null);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].value);
  const [fontSize, setFontSize] = useState(32);

  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropImgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const activeSrc = croppedSrc || src;

  // Update a property on the currently selected shape
  const updateSelectedShape = useCallback(
    (patch: Partial<Shape>) => {
      if (selectedIdx === null) return;
      setShapes((prev) =>
        prev.map((s, i) => (i === selectedIdx ? { ...s, ...patch } : s))
      );
    },
    [selectedIdx]
  );

  // Wrappers that update both global state AND selected shape
  const changeColor = (c: string) => {
    setColor(c);
    if (selectedIdx !== null) updateSelectedShape({ color: c });
  };

  const changeStrokeWidth = (w: number) => {
    setStrokeWidth(w);
    if (selectedIdx !== null) updateSelectedShape({ width: w });
  };

  const changeFontFamily = (ff: string) => {
    setFontFamily(ff);
    if (selectedIdx !== null && shapes[selectedIdx]?.type === "text") {
      updateSelectedShape({ fontFamily: ff });
    }
  };

  const changeFontSize = (fs: number) => {
    setFontSize(fs);
    if (selectedIdx !== null && shapes[selectedIdx]?.type === "text") {
      updateSelectedShape({ fontSize: fs });
    }
  };

  // When selecting a shape, load its properties into the controls
  useEffect(() => {
    if (selectedIdx === null) return;
    const s = shapes[selectedIdx];
    if (!s) return;
    setColor(s.color);
    setStrokeWidth(s.width);
    if (s.type === "text") {
      if (s.fontFamily) setFontFamily(s.fontFamily);
      if (s.fontSize) setFontSize(s.fontSize);
    }
  }, [selectedIdx]);

  // --- CROP MODE ---

  // Init crop rect when entering crop mode or image loads
  const initCropRect = useCallback(() => {
    if (!naturalSize) return;
    const { w, h } = naturalSize;
    const margin = 0.1;
    let cw = w * (1 - margin * 2);
    let ch = h * (1 - margin * 2);
    if (aspect) {
      if (cw / ch > aspect) {
        cw = ch * aspect;
      } else {
        ch = cw / aspect;
      }
    }
    setCropRect({
      x: (w - cw) / 2,
      y: (h - ch) / 2,
      w: cw,
      h: ch,
    });
  }, [naturalSize, aspect]);

  useEffect(() => {
    if (mode === "crop") initCropRect();
  }, [mode, initCropRect]);

  // Load natural size
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);

  // Draw crop overlay
  const redrawCrop = useCallback(() => {
    const canvas = cropCanvasRef.current;
    const img = cropImgRef.current;
    if (!canvas || !img || !naturalSize) return;

    // Match canvas internal size to natural image
    canvas.width = naturalSize.w;
    canvas.height = naturalSize.h;
    // Match display size to the img element
    canvas.style.width = img.offsetWidth + "px";
    canvas.style.height = img.offsetHeight + "px";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (cropRect) {
      drawCropOverlay(ctx, naturalSize.w, naturalSize.h, cropRect);
    }
  }, [cropRect, naturalSize]);

  useEffect(() => {
    if (mode === "crop") redrawCrop();
  }, [mode, redrawCrop]);

  // Sync crop canvas display size on image load/resize
  useEffect(() => {
    if (mode !== "crop") return;
    const img = cropImgRef.current;
    if (!img) return;
    const sync = () => redrawCrop();
    if (img.complete) sync();
    img.addEventListener("load", sync);
    window.addEventListener("resize", sync);
    return () => {
      img.removeEventListener("load", sync);
      window.removeEventListener("resize", sync);
    };
  }, [mode, redrawCrop]);

  const toCropCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = cropCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleCropPointerDown = (e: React.PointerEvent) => {
    const pos = toCropCanvasCoords(e.clientX, e.clientY);
    if (!cropRect || !naturalSize) return;

    const tolerance = Math.max(15, naturalSize.w * 0.015);
    const handle = getCropHandle(cropRect, pos.x, pos.y, tolerance);

    if (handle) {
      setCropHandle(handle);
      setCropDragStart({ x: pos.x, y: pos.y, rect: { ...cropRect } });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      // Start drawing a new crop rectangle
      setCropHandle("se");
      const newRect = { x: pos.x, y: pos.y, w: 0, h: 0 };
      setCropRect(newRect);
      setCropDragStart({ x: pos.x, y: pos.y, rect: newRect });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handleCropPointerMove = (e: React.PointerEvent) => {
    if (!cropDragStart || !cropHandle || !naturalSize || !cropRect) {
      // Update cursor on hover
      if (cropRect && naturalSize) {
        const pos = toCropCanvasCoords(e.clientX, e.clientY);
        const tolerance = Math.max(15, naturalSize.w * 0.015);
        const hov = getCropHandle(cropRect, pos.x, pos.y, tolerance);
        const canvas = cropCanvasRef.current;
        if (canvas) canvas.style.cursor = getCropCursor(hov);
      }
      return;
    }

    const pos = toCropCanvasCoords(e.clientX, e.clientY);
    const dx = pos.x - cropDragStart.x;
    const dy = pos.y - cropDragStart.y;
    const orig = cropDragStart.rect;
    const imgW = naturalSize.w;
    const imgH = naturalSize.h;

    let newRect: CropRect = { ...cropRect };

    if (cropHandle === "move") {
      let nx = orig.x + dx;
      let ny = orig.y + dy;
      nx = Math.max(0, Math.min(imgW - orig.w, nx));
      ny = Math.max(0, Math.min(imgH - orig.h, ny));
      newRect = { x: nx, y: ny, w: orig.w, h: orig.h };
    } else {
      // Resize
      let left = orig.x;
      let top = orig.y;
      let right = orig.x + orig.w;
      let bottom = orig.y + orig.h;

      if (cropHandle.includes("w")) left = Math.max(0, Math.min(right - 20, orig.x + dx));
      if (cropHandle.includes("e")) right = Math.min(imgW, Math.max(left + 20, orig.x + orig.w + dx));
      if (cropHandle.includes("n")) top = Math.max(0, Math.min(bottom - 20, orig.y + dy));
      if (cropHandle.includes("s")) bottom = Math.min(imgH, Math.max(top + 20, orig.y + orig.h + dy));

      // If "Free" aspect with edge-only handles, restrict axis
      if (!aspect) {
        if (cropHandle === "n" || cropHandle === "s") {
          left = orig.x;
          right = orig.x + orig.w;
        }
        if (cropHandle === "e" || cropHandle === "w") {
          top = orig.y;
          bottom = orig.y + orig.h;
        }
      }

      let w = right - left;
      let h = bottom - top;

      // Enforce aspect ratio
      if (aspect) {
        if (cropHandle === "n" || cropHandle === "s") {
          w = h * aspect;
          const cx = (left + right) / 2;
          left = cx - w / 2;
          right = cx + w / 2;
        } else if (cropHandle === "e" || cropHandle === "w") {
          h = w / aspect;
          const cy = (top + bottom) / 2;
          top = cy - h / 2;
          bottom = cy + h / 2;
        } else {
          // Corner handles — adjust height to match width's aspect
          if (w / h > aspect) {
            w = h * aspect;
            if (cropHandle.includes("w")) left = right - w;
            else right = left + w;
          } else {
            h = w / aspect;
            if (cropHandle.includes("n")) top = bottom - h;
            else bottom = top + h;
          }
        }
      }

      // Clamp to image bounds
      left = Math.max(0, left);
      top = Math.max(0, top);
      right = Math.min(imgW, right);
      bottom = Math.min(imgH, bottom);

      newRect = { x: left, y: top, w: right - left, h: bottom - top };
    }

    setCropRect(newRect);
  };

  const handleCropPointerUp = () => {
    setCropHandle(null);
    setCropDragStart(null);
  };

  const applyCrop = () => {
    if (!cropRect || !naturalSize) return;
    const canvas = document.createElement("canvas");
    const r = cropRect;
    canvas.width = Math.max(1, Math.round(r.w));
    canvas.height = Math.max(1, Math.round(r.h));
    const ctx = canvas.getContext("2d")!;
    const img = cropImgRef.current;
    if (!img) return;
    ctx.drawImage(img, r.x, r.y, r.w, r.h, 0, 0, canvas.width, canvas.height);
    setCroppedSrc(canvas.toDataURL("image/png"));
    setShapes([]);
    setSelectedIdx(null);
    setMode("annotate");
  };

  // --- ANNOTATE MODE ---

  // Sync canvas size to displayed image
  useEffect(() => {
    if (mode !== "annotate") return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const syncSize = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.style.width = img.offsetWidth + "px";
      canvas.style.height = img.offsetHeight + "px";
      redrawAnnotateCanvas();
    };

    if (img.complete) syncSize();
    img.addEventListener("load", syncSize);
    window.addEventListener("resize", syncSize);
    return () => {
      img.removeEventListener("load", syncSize);
      window.removeEventListener("resize", syncSize);
    };
  }, [mode, activeSrc, shapes, zoom]);

  const redrawAnnotateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((s, i) => {
      drawShape(ctx, s);
      // Draw selection highlight
      if (i === selectedIdx) {
        const b = getShapeBounds(s);
        ctx.save();
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(b.minX - 4, b.minY - 4, b.maxX - b.minX + 8, b.maxY - b.minY + 8);
        ctx.restore();
      }
    });
    if (currentShape) drawShape(ctx, currentShape);
  }, [shapes, currentShape, selectedIdx]);

  useEffect(() => {
    redrawAnnotateCanvas();
  }, [redrawAnnotateCanvas]);

  const toCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const pos = toCanvasCoords(e.clientX, e.clientY);

    if (tool === "text") {
      setTextInput({ x: pos.x, y: pos.y, value: "" });
      setSelectedIdx(null);
      setTimeout(() => textInputRef.current?.focus(), 50);
      return;
    }

    // Select mode — try to pick a shape
    if (tool === "select") {
      const canvas = canvasRef.current;
      const tolerance = canvas ? Math.max(10, canvas.width * 0.01) : 10;
      // Reverse iterate to find topmost shape
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (hitTestShape(shapes[i], pos.x, pos.y, tolerance)) {
          setSelectedIdx(i);
          setSelectDragStart({ x: pos.x, y: pos.y, shape: { ...shapes[i] } });
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          return;
        }
      }
      setSelectedIdx(null);
      return;
    }

    // Drawing mode
    setSelectedIdx(null);
    setIsDrawing(true);
    setDrawStart(pos);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Moving selected shape
    if (tool === "select" && selectDragStart !== null && selectedIdx !== null) {
      const pos = toCanvasCoords(e.clientX, e.clientY);
      const dx = pos.x - selectDragStart.x;
      const dy = pos.y - selectDragStart.y;
      const orig = selectDragStart.shape;
      setShapes((prev) =>
        prev.map((s, i) =>
          i === selectedIdx
            ? { ...s, startX: orig.startX + dx, startY: orig.startY + dy, endX: orig.endX + dx, endY: orig.endY + dy }
            : s
        )
      );
      return;
    }

    if (!isDrawing || !drawStart) return;
    const pos = toCanvasCoords(e.clientX, e.clientY);
    setCurrentShape({
      type: tool === "select" ? "arrow" : tool,
      startX: drawStart.x,
      startY: drawStart.y,
      endX: pos.x,
      endY: pos.y,
      color,
      width: strokeWidth,
      dashed: tool === "dashed",
    });
  };

  const handlePointerUp = () => {
    if (selectDragStart) {
      setSelectDragStart(null);
      return;
    }
    if (!isDrawing || !currentShape) {
      setIsDrawing(false);
      return;
    }
    setShapes((prev) => [...prev, currentShape]);
    setCurrentShape(null);
    setIsDrawing(false);
    setDrawStart(null);
  };

  const commitText = () => {
    if (!textInput || !textInput.value.trim()) {
      setTextInput(null);
      return;
    }
    setShapes((prev) => [
      ...prev,
      {
        type: "text" as const,
        startX: textInput.x,
        startY: textInput.y,
        endX: textInput.x,
        endY: textInput.y,
        color,
        width: strokeWidth,
        dashed: false,
        text: textInput.value,
        fontFamily,
        fontSize,
      },
    ]);
    setTextInput(null);
  };

  const undo = () => {
    setShapes((prev) => prev.slice(0, -1));
    setSelectedIdx(null);
  };

  const deleteSelected = () => {
    if (selectedIdx === null) return;
    setShapes((prev) => prev.filter((_, i) => i !== selectedIdx));
    setSelectedIdx(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (mode === "annotate" && selectedIdx !== null && !textInput) {
          e.preventDefault();
          deleteSelected();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (mode === "annotate" && !textInput) {
          e.preventDefault();
          undo();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, selectedIdx, textInput]);

  // --- SAVE ---
  const handleSave = async () => {
    setUploading(true);
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = rej;
        img.src = activeSrc;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      for (const s of shapes) drawShape(ctx, s);

      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png")
      );
      const file = new File([blob], `edited-${Date.now()}.png`, { type: "image/png" });
      const result = await uploadMedia(file, uploadFolder);
      onSave(result.url, result.path);
    } catch (err) {
      console.error("Failed to save edited image:", err);
    } finally {
      setUploading(false);
    }
  };

  const zoomPercent = Math.round(zoom * 100);

  const annotateTools: { id: AnnotateTool; icon: React.ElementType; label: string }[] = [
    { id: "select", icon: Move, label: "Select / Move" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "dashed", icon: MoveRight, label: "Dashed" },
    { id: "rectangle", icon: Square, label: "Rect" },
    { id: "ellipse", icon: Circle, label: "Ellipse" },
    { id: "text", icon: Type, label: "Text" },
  ];

  return (
    <div data-overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("crop");
              setCroppedSrc(null);
              setShapes([]);
              setSelectedIdx(null);
              setZoom(1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              mode === "crop"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <Crop className="w-4 h-4" /> Crop
          </button>
          <button
            type="button"
            onClick={() => setMode("annotate")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              mode === "annotate"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <Pencil className="w-4 h-4" /> Annotate
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls (visible in both modes) */}
          <div className="flex items-center gap-1 bg-slate-800 rounded px-2 py-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.1))}
              className="p-0.5 text-slate-400 hover:text-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-300 w-10 text-center tabular-nums">{zoomPercent}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.1))}
              className="p-0.5 text-slate-400 hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-24 accent-blue-500 ml-1"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={uploading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {uploading ? "Uploading…" : "Save & Upload"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {mode === "crop" ? (
          <div className="flex-1 flex flex-col">
            {/* Crop canvas area */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
              <div
                className="relative inline-block"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              >
                <img
                  ref={cropImgRef}
                  src={src}
                  crossOrigin="anonymous"
                  alt="Crop preview"
                  className="max-w-full max-h-[calc(100vh-160px)] object-contain select-none"
                  draggable={false}
                  onLoad={redrawCrop}
                />
                <canvas
                  ref={cropCanvasRef}
                  className="absolute top-0 left-0"
                  style={{ cursor: "crosshair" }}
                  onPointerDown={handleCropPointerDown}
                  onPointerMove={handleCropPointerMove}
                  onPointerUp={handleCropPointerUp}
                />
              </div>
            </div>
            {/* Crop bottom bar */}
            <div className="flex items-center justify-center gap-6 px-4 py-3 bg-slate-900/90 border-t border-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Aspect:</span>
                {ASPECTS.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => setAspect(a.value)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      aspect === a.value
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              {cropRect && (
                <span className="text-xs text-slate-500">
                  {Math.round(cropRect.w)} × {Math.round(cropRect.h)} px
                </span>
              )}
              <button
                type="button"
                onClick={applyCrop}
                disabled={!cropRect || cropRect.w < 10 || cropRect.h < 10}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded text-sm font-medium transition-colors"
              >
                Apply Crop
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Annotate toolbar */}
            <div className="w-48 flex flex-col gap-1 py-3 px-2 bg-slate-900/90 border-r border-slate-700/50 overflow-y-auto">
              {/* Tool buttons */}
              <div className="flex flex-wrap gap-1">
                {annotateTools.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setTool(t.id); setSelectedIdx(null); }}
                    title={t.label}
                    className={`p-2 rounded transition-colors ${
                      tool === t.id
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <t.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-700 my-1" />

              {/* Colors */}
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Color</span>
              <div className="flex flex-wrap gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => changeColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      color === c ? "border-white scale-110" : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div className="border-t border-slate-700 my-1" />

              {/* Stroke width */}
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Stroke</span>
              <div className="flex gap-1">
                {STROKE_WIDTHS.map((sw) => (
                  <button
                    key={sw.value}
                    type="button"
                    onClick={() => changeStrokeWidth(sw.value)}
                    title={sw.label}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded text-xs transition-colors ${
                      strokeWidth === sw.value
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    <div className="rounded-full bg-current" style={{ width: sw.value * 3, height: sw.value }} />
                  </button>
                ))}
              </div>

              {/* Font controls — visible when text tool active or text shape selected */}
              {(tool === "text" || (selectedIdx !== null && shapes[selectedIdx]?.type === "text")) && (
                <>
                  <div className="border-t border-slate-700 my-1" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Font</span>
                  <select
                    value={fontFamily}
                    onChange={(e) => changeFontFamily(e.target.value)}
                    className="w-full bg-slate-800 text-slate-200 text-xs rounded px-2 py-1.5 border border-slate-700 outline-none focus:border-blue-500"
                  >
                    {FONT_FAMILIES.map((f) => (
                      <option key={f.label} value={f.value}>{f.label}</option>
                    ))}
                  </select>

                  <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Size</span>
                  <div className="flex flex-wrap gap-1">
                    {FONT_SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => changeFontSize(s)}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          fontSize === s
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="border-t border-slate-700 my-1" />

              {/* Undo + Delete */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={undo}
                  disabled={shapes.length === 0}
                  title="Undo (Ctrl+Z)"
                  className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 transition-colors text-xs"
                >
                  <Undo2 className="w-4 h-4" /> Undo
                </button>
                <button
                  type="button"
                  onClick={deleteSelected}
                  disabled={selectedIdx === null}
                  title="Delete selected (Del)"
                  className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded text-red-400 hover:bg-red-900/40 hover:text-red-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-xs"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>

              {/* Selected shape info */}
              {selectedIdx !== null && (
                <p className="text-[10px] text-slate-500 mt-1">
                  Selected: {shapes[selectedIdx]?.type} — drag to move, Del to remove
                </p>
              )}
            </div>

            {/* Canvas area */}
            <div
              ref={containerRef}
              className="flex-1 flex items-center justify-center p-4 overflow-auto"
            >
              <div
                className="relative inline-block"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              >
                <img
                  ref={imgRef}
                  src={activeSrc}
                  crossOrigin="anonymous"
                  alt="Edit preview"
                  className="max-w-full max-h-[calc(100vh-120px)] object-contain select-none"
                  draggable={false}
                />
                <canvas
                  ref={canvasRef}
                  className={`absolute top-0 left-0 ${
                    tool === "select" ? "cursor-default" : "cursor-crosshair"
                  }`}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                />
                {textInput && (
                  <input
                    ref={textInputRef}
                    type="text"
                    value={textInput.value}
                    onChange={(e) =>
                      setTextInput((prev) => (prev ? { ...prev, value: e.target.value } : null))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitText();
                      if (e.key === "Escape") setTextInput(null);
                    }}
                    onBlur={commitText}
                    className="absolute bg-slate-800/90 text-white border border-blue-500 rounded px-2 py-1 text-sm outline-none"
                    style={{
                      left:
                        (textInput.x / (canvasRef.current?.width || 1)) *
                          (imgRef.current?.offsetWidth || 0) +
                        "px",
                      top:
                        (textInput.y / (canvasRef.current?.height || 1)) *
                          (imgRef.current?.offsetHeight || 0) +
                        "px",
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
