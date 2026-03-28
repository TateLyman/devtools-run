"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpen: number;
  hue: number;
  sepia: number;
  grayscale: number;
}

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const defaultAdj: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sharpen: 0,
  hue: 0,
  sepia: 0,
  grayscale: 0,
};

export default function PhotoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [adj, setAdj] = useState<Adjustments>({ ...defaultAdj });
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [mode, setMode] = useState<"adjust" | "crop" | "transform">("adjust");
  const [cropping, setCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [imgW, setImgW] = useState(800);
  const [imgH, setImgH] = useState(600);

  const sliders: { key: keyof Adjustments; label: string; min: number; max: number; step: number; unit: string }[] = [
    { key: "brightness", label: "Brightness", min: 0, max: 200, step: 1, unit: "%" },
    { key: "contrast", label: "Contrast", min: 0, max: 200, step: 1, unit: "%" },
    { key: "saturation", label: "Saturation", min: 0, max: 200, step: 1, unit: "%" },
    { key: "hue", label: "Hue Rotate", min: 0, max: 360, step: 1, unit: "deg" },
    { key: "blur", label: "Blur", min: 0, max: 20, step: 0.5, unit: "px" },
    { key: "sepia", label: "Sepia", min: 0, max: 100, step: 1, unit: "%" },
    { key: "grayscale", label: "Grayscale", min: 0, max: 100, step: 1, unit: "%" },
  ];

  const applyFilters = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas || !image) return;

    const maxW = 800;
    const scale = image.width > maxW ? maxW / image.width : 1;
    const w = Math.round(image.width * scale);
    const h = Math.round(image.height * scale);

    // Handle rotation dimensions
    const isRotated = rotation === 90 || rotation === 270;
    canvas.width = isRotated ? h : w;
    canvas.height = isRotated ? w : h;

    const ctx = canvas.getContext("2d")!;

    // Build CSS filter string
    let filter = "";
    filter += `brightness(${adj.brightness}%) `;
    filter += `contrast(${adj.contrast}%) `;
    filter += `saturate(${adj.saturation}%) `;
    filter += `hue-rotate(${adj.hue}deg) `;
    filter += `sepia(${adj.sepia}%) `;
    filter += `grayscale(${adj.grayscale}%) `;
    if (adj.blur > 0) filter += `blur(${adj.blur}px) `;
    ctx.filter = filter.trim();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotation) ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);
    if (flipV) ctx.scale(1, -1);
    ctx.drawImage(image, -w / 2, -h / 2, w, h);
    ctx.restore();

    // Sharpen after filters
    if (adj.sharpen > 0) {
      ctx.filter = "none";
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const sharpened = sharpenImageData(imageData, adj.sharpen / 100);
      ctx.putImageData(sharpened, 0, 0);
    }

    // Draw crop overlay
    if (mode === "crop" && cropRect) {
      ctx.filter = "none";
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      // Redraw image in crop area
      ctx.save();
      ctx.beginPath();
      ctx.rect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      ctx.clip();
      ctx.filter = filter.trim();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (rotation) ctx.rotate((rotation * Math.PI) / 180);
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);
      ctx.drawImage(image, -w / 2, -h / 2, w, h);
      ctx.restore();
      // Crop border
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      ctx.setLineDash([]);
      // Corner handles
      const corners = [
        [cropRect.x, cropRect.y],
        [cropRect.x + cropRect.w, cropRect.y],
        [cropRect.x, cropRect.y + cropRect.h],
        [cropRect.x + cropRect.w, cropRect.y + cropRect.h],
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle = "#6366f1";
        ctx.fillRect(cx - 4, cy - 4, 8, 8);
      });
    }
  }, [image, adj, rotation, flipH, flipV, mode, cropRect]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  function sharpenImageData(imageData: ImageData, amount: number): ImageData {
    const w = imageData.width;
    const h = imageData.height;
    const src = imageData.data;
    const output = new ImageData(new Uint8ClampedArray(src), w, h);
    const dst = output.data;
    const k = amount;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          const val =
            src[idx + c] * (1 + 4 * k) -
            src[((y - 1) * w + x) * 4 + c] * k -
            src[((y + 1) * w + x) * 4 + c] * k -
            src[(y * w + x - 1) * 4 + c] * k -
            src[(y * w + x + 1) * 4 + c] * k;
          dst[idx + c] = Math.max(0, Math.min(255, val));
        }
      }
    }
    return output;
  }

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImgW(img.width);
        setImgH(img.height);
        setAdj({ ...defaultAdj });
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setCropRect(null);
        setHistory([]);
        setHistoryIdx(-1);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = previewRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handleCropMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "crop") return;
    const pos = getCanvasCoords(e);
    setCropping(true);
    setCropStart(pos);
    setCropRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const handleCropMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropping || mode !== "crop") return;
    const pos = getCanvasCoords(e);
    setCropRect({
      x: Math.min(cropStart.x, pos.x),
      y: Math.min(cropStart.y, pos.y),
      w: Math.abs(pos.x - cropStart.x),
      h: Math.abs(pos.y - cropStart.y),
    });
  };

  const handleCropMouseUp = () => {
    setCropping(false);
  };

  const applyCrop = () => {
    if (!cropRect || !previewRef.current) return;
    const canvas = previewRef.current;
    const ctx = canvas.getContext("2d")!;
    const cropped = ctx.getImageData(cropRect.x, cropRect.y, cropRect.w, cropRect.h);

    // Create new image from cropped data
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = cropRect.w;
    tempCanvas.height = cropRect.h;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.putImageData(cropped, 0, 0);

    const img = new Image();
    img.onload = () => {
      setImage(img);
      setImgW(img.width);
      setImgH(img.height);
      setCropRect(null);
      setMode("adjust");
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setAdj({ ...defaultAdj });
    };
    img.src = tempCanvas.toDataURL();
  };

  const download = () => {
    if (!image) return;
    // Render at full resolution
    const canvas = document.createElement("canvas");
    const isRotated = rotation === 90 || rotation === 270;
    canvas.width = isRotated ? imgH : imgW;
    canvas.height = isRotated ? imgW : imgH;
    const ctx = canvas.getContext("2d")!;

    let filter = "";
    filter += `brightness(${adj.brightness}%) `;
    filter += `contrast(${adj.contrast}%) `;
    filter += `saturate(${adj.saturation}%) `;
    filter += `hue-rotate(${adj.hue}deg) `;
    filter += `sepia(${adj.sepia}%) `;
    filter += `grayscale(${adj.grayscale}%) `;
    if (adj.blur > 0) filter += `blur(${adj.blur}px) `;
    ctx.filter = filter.trim();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotation) ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);
    if (flipV) ctx.scale(1, -1);
    ctx.drawImage(image, -imgW / 2, -imgH / 2, imgW, imgH);
    ctx.restore();

    if (adj.sharpen > 0) {
      ctx.filter = "none";
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const sharpened = sharpenImageData(imageData, adj.sharpen / 100);
      ctx.putImageData(sharpened, 0, 0);
    }

    const a = document.createElement("a");
    a.download = "edited-photo.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const resetAll = () => {
    setAdj({ ...defaultAdj });
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setCropRect(null);
  };

  const presets = [
    { name: "Vivid", adj: { ...defaultAdj, saturation: 140, contrast: 115 } },
    { name: "Warm", adj: { ...defaultAdj, hue: 15, saturation: 120, brightness: 105 } },
    { name: "Cool", adj: { ...defaultAdj, hue: 200, saturation: 110 } },
    { name: "B&W", adj: { ...defaultAdj, grayscale: 100, contrast: 120 } },
    { name: "Vintage", adj: { ...defaultAdj, sepia: 40, contrast: 90, brightness: 110 } },
    { name: "Dramatic", adj: { ...defaultAdj, contrast: 150, saturation: 80, brightness: 90 } },
    { name: "Fade", adj: { ...defaultAdj, contrast: 80, brightness: 110, saturation: 80 } },
    { name: "Bright", adj: { ...defaultAdj, brightness: 130, contrast: 105 } },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Photo Editor</h1>
        <p className="text-[var(--text-secondary)]">
          Edit photos in your browser. Adjust brightness, contrast, saturation, blur, sharpen, and more. Crop, rotate, flip. Download as PNG. No uploads to any server.
        </p>
      </div>

      {!image ? (
        <div
          className="border-2 border-dashed border-[var(--border)] rounded-lg p-16 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-4 opacity-40">+</div>
          <p className="text-lg text-gray-400 mb-2">Drop an image here or click to upload</p>
          <p className="text-sm text-gray-500">Supports PNG, JPG, WebP, GIF</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
          {/* Canvas */}
          <div className="space-y-3">
            <div
              className="rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center"
              style={{ minHeight: 400 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <canvas
                ref={previewRef}
                className="max-w-full max-h-[600px]"
                style={{ cursor: mode === "crop" ? "crosshair" : "default" }}
                onMouseDown={handleCropMouseDown}
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
              />
            </div>

            {/* Presets */}
            <div className="flex gap-2 flex-wrap">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setAdj(p.adj)}
                  className="px-3 py-1.5 rounded text-xs bg-[var(--bg-secondary)] border border-[var(--border)] text-gray-400 hover:text-white hover:border-purple-500/30 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => fileRef.current?.click()} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-gray-400 hover:text-white">
                Change Image
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              <button onClick={resetAll} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-gray-400 hover:text-white">
                Reset All
              </button>
              <button onClick={download} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded text-sm font-bold ml-auto">
                Download PNG
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Mode tabs */}
            <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
              {(["adjust", "crop", "transform"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); if (m !== "crop") setCropRect(null); }}
                  className={`flex-1 px-3 py-2 text-sm capitalize ${mode === m ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400 hover:text-white"}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {mode === "adjust" && (
              <div className="space-y-3">
                {sliders.map((s) => (
                  <div key={s.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{s.label}</span>
                      <span className="text-gray-500">{adj[s.key]}{s.unit}</span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={adj[s.key]}
                      onChange={(e) => setAdj((prev) => ({ ...prev, [s.key]: Number(e.target.value) }))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                ))}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Sharpen</span>
                    <span className="text-gray-500">{adj.sharpen}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={adj.sharpen}
                    onChange={(e) => setAdj((prev) => ({ ...prev, sharpen: Number(e.target.value) }))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            )}

            {mode === "crop" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Click and drag on the image to select a crop region.</p>
                {cropRect && cropRect.w > 5 && (
                  <>
                    <div className="text-xs text-gray-500">
                      Selection: {Math.round(cropRect.w)} x {Math.round(cropRect.h)} px
                    </div>
                    <button onClick={applyCrop} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded font-bold text-sm">
                      Apply Crop
                    </button>
                    <button onClick={() => setCropRect(null)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] text-gray-400 hover:text-white px-4 py-2 rounded text-sm">
                      Cancel
                    </button>
                  </>
                )}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "1:1", r: 1 },
                    { label: "4:3", r: 4 / 3 },
                    { label: "16:9", r: 16 / 9 },
                    { label: "3:2", r: 3 / 2 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        const canvas = previewRef.current;
                        if (!canvas) return;
                        const cw = canvas.width;
                        const ch = canvas.height;
                        let w = cw * 0.7;
                        let h = w / preset.r;
                        if (h > ch * 0.7) {
                          h = ch * 0.7;
                          w = h * preset.r;
                        }
                        setCropRect({
                          x: (cw - w) / 2,
                          y: (ch - h) / 2,
                          w,
                          h,
                        });
                      }}
                      className="px-3 py-1.5 rounded text-xs bg-[var(--bg-secondary)] border border-[var(--border)] text-gray-400 hover:text-white"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === "transform" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Rotate</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setRotation(deg)}
                        className={`px-2 py-2 rounded text-sm ${rotation === deg ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)] text-gray-400 hover:text-white"}`}
                      >
                        {deg}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Flip</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFlipH((p) => !p)}
                      className={`px-3 py-2 rounded text-sm ${flipH ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)] text-gray-400 hover:text-white"}`}
                    >
                      Flip Horizontal
                    </button>
                    <button
                      onClick={() => setFlipV((p) => !p)}
                      className={`px-3 py-2 rounded text-sm ${flipV ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)] text-gray-400 hover:text-white"}`}
                    >
                      Flip Vertical
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>Original: {imgW} x {imgH}</div>
                <div>Rotation: {rotation}</div>
                <div>Flip H: {flipH ? "Yes" : "No"}</div>
                <div>Flip V: {flipV ? "Yes" : "No"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
