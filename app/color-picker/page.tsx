"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface ColorEntry {
  hex: string;
  rgb: string;
  hsl: string;
  x: number;
  y: number;
}

export default function ColorPicker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("#6366f1");
  const [pickedColors, setPickedColors] = useState<ColorEntry[]>([]);
  const [hovering, setHovering] = useState(false);
  const [hoverColor, setHoverColor] = useState("#000000");
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState<string | null>(null);
  const [manualColor, setManualColor] = useState("#6366f1");
  const [zoom, setZoom] = useState(false);
  const zoomCanvasRef = useRef<HTMLCanvasElement>(null);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b, str: `rgb(${r}, ${g}, ${b})` };
  };

  const hexToHsl = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      str: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const maxW = 900;
    const scale = image.width > maxW ? maxW / image.width : 1;
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [image]);

  useEffect(() => { drawImage(); }, [drawImage]);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setPickedColors([]);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(((e.clientX - rect.left) / rect.width) * canvas.width),
      y: Math.round(((e.clientY - rect.top) / rect.height) * canvas.height),
    };
  };

  const getPixelColor = (x: number, y: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d")!;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return rgbToHex(pixel[0], pixel[1], pixel[2]);
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image) return;
    const pos = getCanvasCoords(e);
    const color = getPixelColor(pos.x, pos.y);
    if (color) {
      setHoverColor(color);
      setHoverPos(pos);
      setHovering(true);

      // Draw zoom magnifier
      if (zoomCanvasRef.current && canvasRef.current) {
        const zoomCtx = zoomCanvasRef.current.getContext("2d")!;
        const srcCanvas = canvasRef.current;
        zoomCanvasRef.current.width = 120;
        zoomCanvasRef.current.height = 120;
        const zoomLevel = 8;
        const srcSize = 120 / zoomLevel;
        zoomCtx.imageSmoothingEnabled = false;
        zoomCtx.drawImage(
          srcCanvas,
          pos.x - srcSize / 2, pos.y - srcSize / 2, srcSize, srcSize,
          0, 0, 120, 120
        );
        // Crosshair
        zoomCtx.strokeStyle = "#fff";
        zoomCtx.lineWidth = 1;
        zoomCtx.strokeRect(52, 52, 16, 16);
        zoomCtx.strokeStyle = "#000";
        zoomCtx.lineWidth = 0.5;
        zoomCtx.strokeRect(53, 53, 14, 14);
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image) return;
    const pos = getCanvasCoords(e);
    const hex = getPixelColor(pos.x, pos.y);
    if (hex) {
      const rgb = hexToRgb(hex);
      const hsl = hexToHsl(hex);
      const entry: ColorEntry = {
        hex: hex.toUpperCase(),
        rgb: rgb.str,
        hsl: hsl.str,
        x: pos.x,
        y: pos.y,
      };
      setCurrentColor(hex.toUpperCase());
      setPickedColors((prev) => [entry, ...prev.slice(0, 19)]);
    }
  };

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  };

  const rgb = hexToRgb(currentColor);
  const hsl = hexToHsl(currentColor);

  const formats = [
    { label: "HEX", value: currentColor.toUpperCase() },
    { label: "RGB", value: rgb.str },
    { label: "HSL", value: hsl.str },
    { label: "RGBA", value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { label: "CSS", value: `color: ${currentColor};` },
    { label: "Tailwind", value: `bg-[${currentColor.toLowerCase()}]` },
  ];

  // Generate shades
  const shades = Array.from({ length: 11 }, (_, i) => {
    const lightness = 95 - i * 8.5;
    return { l: lightness, hex: hslToHex(hsl.h, hsl.s, Math.round(lightness)) };
  });

  function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  // Complementary colors
  const complementary = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  const triadic1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const triadic2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);
  const analogous1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const analogous2 = hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Image Color Picker</h1>
        <p className="text-[var(--text-secondary)]">
          Upload any image and click to extract colors. Get HEX, RGB, HSL values instantly. Zoom magnifier, color history, shades, and harmonies.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Left: Image area */}
        <div className="space-y-4">
          {!image ? (
            <div
              className="border-2 border-dashed border-[var(--border)] rounded-lg p-16 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="text-4xl mb-4 opacity-40">+</div>
              <p className="text-lg text-gray-400 mb-2">Drop an image here or click to upload</p>
              <p className="text-sm text-gray-500">Click anywhere on the image to pick a color</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <canvas
                  ref={canvasRef}
                  className="w-full cursor-crosshair"
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMove}
                  onMouseLeave={() => setHovering(false)}
                />
                {/* Zoom magnifier */}
                {hovering && (
                  <div className="absolute top-4 right-4 rounded-lg border-2 overflow-hidden shadow-xl" style={{ borderColor: hoverColor }}>
                    <canvas ref={zoomCanvasRef} width={120} height={120} className="block" />
                    <div className="px-2 py-1 text-center text-xs font-mono text-white" style={{ backgroundColor: hoverColor }}>
                      {hoverColor.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => fileRef.current?.click()} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-gray-400 hover:text-white">
                  Change Image
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              </div>
            </div>
          )}

          {/* Manual color input */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="text-sm font-bold mb-3">Or pick manually</h3>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={currentColor.toLowerCase()}
                onChange={(e) => setCurrentColor(e.target.value.toUpperCase())}
                className="w-16 h-10 rounded cursor-pointer border-0"
              />
              <input
                value={currentColor}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) setCurrentColor(v.toUpperCase());
                  setManualColor(v);
                }}
                placeholder="#6366F1"
                className="flex-1 bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-3 py-2 text-white font-mono text-sm"
              />
              <div className="w-10 h-10 rounded border border-[var(--border)]" style={{ backgroundColor: currentColor }} />
            </div>
          </div>
        </div>

        {/* Right: Color info */}
        <div className="space-y-4">
          {/* Current color */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="h-20 w-full" style={{ backgroundColor: currentColor }} />
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold">Current Color</h3>
              <div className="space-y-1.5">
                {formats.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center justify-between bg-[var(--bg-primary,#0d0d1a)] rounded px-3 py-1.5 cursor-pointer hover:ring-1 hover:ring-purple-500/30"
                    onClick={() => copy(f.value, f.label)}
                  >
                    <span className="text-xs text-gray-400 w-14">{f.label}</span>
                    <span className="text-xs font-mono text-white">{f.value}</span>
                    <span className="text-[10px] text-purple-400 w-12 text-right">{copied === f.label ? "Copied!" : "Copy"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shades */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="text-sm font-bold mb-2">Shades</h3>
            <div className="flex rounded-lg overflow-hidden h-8">
              {shades.map((shade, i) => (
                <div
                  key={i}
                  className="flex-1 cursor-pointer hover:scale-y-125 transition-transform"
                  style={{ backgroundColor: shade.hex }}
                  onClick={() => { setCurrentColor(shade.hex.toUpperCase()); copy(shade.hex.toUpperCase(), `shade-${i}`); }}
                  title={shade.hex}
                />
              ))}
            </div>
          </div>

          {/* Color harmonies */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="text-sm font-bold mb-2">Color Harmonies</h3>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Complementary</p>
                <div className="flex gap-1">
                  {[currentColor, complementary].map((c, i) => (
                    <div key={i} className="flex-1 h-8 rounded cursor-pointer hover:ring-1 hover:ring-white/30" style={{ backgroundColor: c }} onClick={() => { setCurrentColor(c.toUpperCase()); copy(c.toUpperCase(), `comp-${i}`); }} title={c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Triadic</p>
                <div className="flex gap-1">
                  {[currentColor, triadic1, triadic2].map((c, i) => (
                    <div key={i} className="flex-1 h-8 rounded cursor-pointer hover:ring-1 hover:ring-white/30" style={{ backgroundColor: c }} onClick={() => { setCurrentColor(c.toUpperCase()); copy(c.toUpperCase(), `tri-${i}`); }} title={c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Analogous</p>
                <div className="flex gap-1">
                  {[analogous2, currentColor, analogous1].map((c, i) => (
                    <div key={i} className="flex-1 h-8 rounded cursor-pointer hover:ring-1 hover:ring-white/30" style={{ backgroundColor: c }} onClick={() => { setCurrentColor(c.toUpperCase()); copy(c.toUpperCase(), `ana-${i}`); }} title={c} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Color history */}
          {pickedColors.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold">Picked Colors ({pickedColors.length})</h3>
                <button onClick={() => setPickedColors([])} className="text-xs text-red-400 hover:text-red-300">Clear</button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {pickedColors.map((entry, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
                    style={{ backgroundColor: entry.hex }}
                    onClick={() => { setCurrentColor(entry.hex); copy(entry.hex, `history-${i}`); }}
                    title={`${entry.hex}\n${entry.rgb}\n${entry.hsl}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Export palette */}
          {pickedColors.length >= 2 && (
            <button
              onClick={() => {
                const palette = pickedColors.map((c) => c.hex).join(", ");
                copy(palette, "palette");
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded font-bold text-sm"
            >
              {copied === "palette" ? "Palette Copied!" : "Copy All as Palette"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
