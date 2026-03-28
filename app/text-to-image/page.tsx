"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface GradientPreset {
  name: string;
  colors: string[];
  angle: number;
}

const gradientPresets: GradientPreset[] = [
  { name: "Indigo", colors: ["#6366f1", "#8b5cf6"], angle: 135 },
  { name: "Sunset", colors: ["#f97316", "#ec4899"], angle: 135 },
  { name: "Ocean", colors: ["#0ea5e9", "#6366f1"], angle: 135 },
  { name: "Forest", colors: ["#10b981", "#059669"], angle: 135 },
  { name: "Fire", colors: ["#ef4444", "#f59e0b"], angle: 135 },
  { name: "Rose", colors: ["#ec4899", "#f43f5e"], angle: 135 },
  { name: "Midnight", colors: ["#1e1b4b", "#312e81"], angle: 135 },
  { name: "Aurora", colors: ["#06b6d4", "#8b5cf6", "#ec4899"], angle: 135 },
  { name: "Peach", colors: ["#fdba74", "#f472b6"], angle: 135 },
  { name: "Slate", colors: ["#334155", "#1e293b"], angle: 135 },
  { name: "Neon", colors: ["#22d3ee", "#a855f7"], angle: 135 },
  { name: "Gold", colors: ["#f59e0b", "#d97706"], angle: 135 },
];

const fontOptions = [
  "Georgia", "Arial", "Verdana", "Courier New", "Times New Roman", "Impact",
  "Comic Sans MS", "Trebuchet MS", "Palatino", "Garamond",
];

const sizePresets = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Instagram Story", w: 1080, h: 1920 },
  { label: "Twitter Post", w: 1200, h: 675 },
  { label: "Facebook Post", w: 1200, h: 630 },
  { label: "YouTube Thumb", w: 1280, h: 720 },
  { label: "Pinterest Pin", w: 1000, h: 1500 },
  { label: "LinkedIn Post", w: 1200, h: 627 },
  { label: "OG Image", w: 1200, h: 630 },
];

export default function TextToImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("The best way to predict\nthe future is to create it.");
  const [author, setAuthor] = useState("Peter Drucker");
  const [fontSize, setFontSize] = useState(48);
  const [authorSize, setAuthorSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Georgia");
  const [textColor, setTextColor] = useState("#ffffff");
  const [authorColor, setAuthorColor] = useState("#ffffffcc");
  const [bgType, setBgType] = useState<"gradient" | "solid" | "image">("gradient");
  const [bgColor, setBgColor] = useState("#6366f1");
  const [gradientPreset, setGradientPreset] = useState(0);
  const [gradientAngle, setGradientAngle] = useState(135);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [padding, setPadding] = useState(80);
  const [textAlign, setTextAlign] = useState<CanvasTextAlign>("center");
  const [vAlign, setVAlign] = useState<"top" | "center" | "bottom">("center");
  const [showQuotes, setShowQuotes] = useState(true);
  const [quoteStyle, setQuoteStyle] = useState<"curly" | "angle" | "none">("curly");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [shadow, setShadow] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [overlay, setOverlay] = useState(0.4);
  const [overlayColor, setOverlayColor] = useState("#000000");
  const [watermark, setWatermark] = useState("");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const drawGradient = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const cx = w / 2, cy = h / 2;
    const len = Math.sqrt(w * w + h * h) / 2;
    const x1 = cx - Math.cos(rad) * len;
    const y1 = cy - Math.sin(rad) * len;
    const x2 = cx + Math.cos(rad) * len;
    const y2 = cy + Math.sin(rad) * len;
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }, []);

  const drawWithLetterSpacing = useCallback((ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) => {
    if (spacing === 0) {
      ctx.fillText(text, x, y);
      return;
    }
    const chars = text.split("");
    let totalWidth = 0;
    chars.forEach((c) => { totalWidth += ctx.measureText(c).width + spacing; });
    totalWidth -= spacing;

    let startX = x;
    if (ctx.textAlign === "center") startX = x - totalWidth / 2;
    else if (ctx.textAlign === "right") startX = x - totalWidth;

    const savedAlign = ctx.textAlign;
    ctx.textAlign = "left";
    let cx = startX;
    chars.forEach((c) => {
      ctx.fillText(c, cx, y);
      cx += ctx.measureText(c).width + spacing;
    });
    ctx.textAlign = savedAlign;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    // Background
    const drawContent = () => {
      // Overlay for bg image
      if (bgType === "image" && bgImage) {
        ctx.fillStyle = overlayColor;
        ctx.globalAlpha = overlay;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
      }

      const maxWidth = width - padding * 2;
      const font = `${italic ? "italic " : ""}${bold ? "bold " : ""}${fontSize}px ${fontFamily}`;
      ctx.font = font;
      ctx.textAlign = textAlign;
      ctx.textBaseline = "top";

      // Split text into lines (preserving manual newlines)
      const rawLines = text.split("\n");
      const wrappedLines: string[] = [];
      rawLines.forEach((rawLine) => {
        const words = rawLine.split(" ");
        let currentLine = "";
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (ctx.measureText(testLine).width > maxWidth && currentLine) {
            wrappedLines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        wrappedLines.push(currentLine);
      });

      const lh = fontSize * lineHeight;
      const totalTextHeight = wrappedLines.length * lh;
      const authorHeight = author ? authorSize * 2.5 : 0;
      const quoteHeight = showQuotes && quoteStyle !== "none" ? fontSize * 0.8 : 0;
      const totalHeight = quoteHeight + totalTextHeight + authorHeight;

      let startY: number;
      if (vAlign === "top") startY = padding;
      else if (vAlign === "bottom") startY = height - padding - totalHeight;
      else startY = (height - totalHeight) / 2;

      const alignX = textAlign === "center" ? width / 2 : textAlign === "right" ? width - padding : padding;

      if (shadow) {
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      // Opening quote
      let quoteY = startY;
      if (showQuotes && quoteStyle !== "none") {
        ctx.font = `${bold ? "bold " : ""}${fontSize * 1.5}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.globalAlpha = 0.3;
        const qChar = quoteStyle === "curly" ? "\u201C" : "\u00AB";
        ctx.fillText(qChar, alignX, quoteY);
        ctx.globalAlpha = 1;
        quoteY += fontSize * 0.8;
      }

      // Text
      ctx.font = font;
      ctx.fillStyle = textColor;
      wrappedLines.forEach((line, i) => {
        const y = quoteY + i * lh;
        if (letterSpacing > 0) {
          drawWithLetterSpacing(ctx, line, alignX, y, letterSpacing);
        } else {
          ctx.fillText(line, alignX, y);
        }
      });

      // Author
      if (author) {
        ctx.font = `${authorSize}px ${fontFamily}`;
        ctx.fillStyle = authorColor;
        const authorY = quoteY + wrappedLines.length * lh + authorSize;
        ctx.fillText(`\u2014 ${author}`, alignX, authorY);
      }

      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Watermark
      if (watermark) {
        ctx.font = `14px ${fontFamily}`;
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.textAlign = "right";
        ctx.fillText(watermark, width - 20, height - 20);
      }
    };

    if (bgType === "image" && bgImage) {
      const img = new Image();
      img.onload = () => {
        // Cover the canvas
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let sw: number, sh: number, sx: number, sy: number;
        if (imgRatio > canvasRatio) {
          sh = img.height;
          sw = sh * canvasRatio;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = sw / canvasRatio;
          sx = 0;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        drawContent();
      };
      img.src = bgImage;
    } else if (bgType === "gradient") {
      const preset = gradientPresets[gradientPreset];
      drawGradient(ctx, width, height, preset.colors, gradientAngle);
      drawContent();
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      drawContent();
    }
  }, [text, author, fontSize, authorSize, fontFamily, textColor, authorColor, bgType, bgColor, gradientPreset, gradientAngle, width, height, padding, textAlign, vAlign, showQuotes, quoteStyle, letterSpacing, lineHeight, shadow, bgImage, overlay, overlayColor, watermark, bold, italic, drawGradient, drawWithLetterSpacing]);

  useEffect(() => { draw(); }, [draw]);

  const handleBgUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setBgImage(e.target?.result as string);
      setBgType("image");
    };
    reader.readAsDataURL(file);
  };

  const download = () => {
    draw();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const a = document.createElement("a");
      a.download = "quote-image.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text to Image / Quote Maker</h1>
        <p className="text-[var(--text-secondary)]">
          Create beautiful quote images for social media. Choose gradient backgrounds, customize fonts, add authors, and download as PNG. Perfect for Instagram, Twitter, LinkedIn.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Preview */}
        <div className="space-y-3">
          <canvas ref={canvasRef} className="w-full rounded-lg border border-[var(--border)]" style={{ maxHeight: 600, objectFit: "contain" }} />

          {/* Size presets */}
          <div className="flex gap-2 flex-wrap">
            {sizePresets.map((p) => (
              <button
                key={p.label}
                onClick={() => { setWidth(p.w); setHeight(p.h); }}
                className={`px-2 py-1 rounded text-xs ${
                  width === p.w && height === p.h
                    ? "bg-purple-600 text-white"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button onClick={download} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded font-bold">
            Download PNG
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-1">
          {/* Text input */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold">Text</h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your quote..."
              className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm h-24 resize-none"
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name (optional)"
              className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm"
            />
          </div>

          {/* Typography */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold">Typography</h3>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Font</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Quote Size</span><span className="text-gray-500">{fontSize}px</span></div>
                <input type="range" min={16} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Author Size</span><span className="text-gray-500">{authorSize}px</span></div>
                <input type="range" min={12} max={60} value={authorSize} onChange={(e) => setAuthorSize(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Line Height</span><span className="text-gray-500">{lineHeight.toFixed(1)}</span></div>
                <input type="range" min={1} max={3} step={0.1} value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Letter Space</span><span className="text-gray-500">{letterSpacing}px</span></div>
                <input type="range" min={0} max={10} step={0.5} value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setBold(!bold)} className={`px-3 py-1.5 rounded text-xs font-bold ${bold ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}>B</button>
              <button onClick={() => setItalic(!italic)} className={`px-3 py-1.5 rounded text-xs italic ${italic ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}>I</button>
              <button onClick={() => setShadow(!shadow)} className={`px-3 py-1.5 rounded text-xs ${shadow ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}>Shadow</button>
              <div className="flex rounded overflow-hidden border border-[var(--border)] ml-auto">
                {(["left", "center", "right"] as const).map((a) => (
                  <button key={a} onClick={() => setTextAlign(a)} className={`px-2 py-1.5 text-xs ${textAlign === a ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}>
                    {a[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Vertical Align</label>
              <div className="flex rounded overflow-hidden border border-[var(--border)]">
                {(["top", "center", "bottom"] as const).map((v) => (
                  <button key={v} onClick={() => setVAlign(v)} className={`flex-1 px-2 py-1.5 text-xs capitalize ${vAlign === v ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold">Colors</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Text</label>
                <div className="flex gap-2"><input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" /><input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1 bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" /></div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Author</label>
                <div className="flex gap-2"><input type="color" value={authorColor.slice(0, 7)} onChange={(e) => setAuthorColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" /><input value={authorColor} onChange={(e) => setAuthorColor(e.target.value)} className="flex-1 bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" /></div>
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold">Background</h3>
            <div className="flex rounded overflow-hidden border border-[var(--border)]">
              {(["gradient", "solid", "image"] as const).map((t) => (
                <button key={t} onClick={() => setBgType(t)} className={`flex-1 px-2 py-1.5 text-xs capitalize ${bgType === t ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}>
                  {t}
                </button>
              ))}
            </div>

            {bgType === "gradient" && (
              <>
                <div className="grid grid-cols-4 gap-1.5">
                  {gradientPresets.map((preset, i) => (
                    <button
                      key={preset.name}
                      onClick={() => setGradientPreset(i)}
                      className={`h-8 rounded text-[10px] text-white font-medium ${gradientPreset === i ? "ring-2 ring-white" : ""}`}
                      style={{ background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})` }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Angle</span><span className="text-gray-500">{gradientAngle}deg</span></div>
                  <input type="range" min={0} max={360} value={gradientAngle} onChange={(e) => setGradientAngle(Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
              </>
            )}

            {bgType === "solid" && (
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                <input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-2 py-1 text-white text-sm font-mono" />
              </div>
            )}

            {bgType === "image" && (
              <div className="space-y-2">
                <button onClick={() => fileRef.current?.click()} className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-3 py-2 text-sm text-gray-400 hover:text-white">
                  {bgImage ? "Change Background Image" : "Upload Background Image"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleBgUpload(e.target.files[0])} />
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Overlay</span><span className="text-gray-500">{Math.round(overlay * 100)}%</span></div>
                  <input type="range" min={0} max={0.9} step={0.05} value={overlay} onChange={(e) => setOverlay(Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400">Overlay Color</span>
                  <input type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} className="w-8 h-6 rounded cursor-pointer" />
                </div>
              </div>
            )}
          </div>

          {/* Extras */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold">Extras</h3>
            <div className="flex gap-2 items-center">
              <label className="text-xs text-gray-400">Quote marks</label>
              <div className="flex rounded overflow-hidden border border-[var(--border)] ml-auto">
                {(["none", "curly", "angle"] as const).map((q) => (
                  <button key={q} onClick={() => { setQuoteStyle(q); setShowQuotes(q !== "none"); }} className={`px-2 py-1 text-xs capitalize ${quoteStyle === q ? "bg-purple-600 text-white" : "bg-[var(--bg-primary,#0d0d1a)] text-gray-400"}`}>
                    {q === "curly" ? '\u201C\u201D' : q === "angle" ? "\u00AB\u00BB" : "None"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Padding</span><span className="text-gray-500">{padding}px</span></div>
              <input type="range" min={20} max={200} value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Width</label>
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm text-center" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Height</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm text-center" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Watermark (optional)</label>
              <input value={watermark} onChange={(e) => setWatermark(e.target.value)} placeholder="@yourbrand" className="w-full bg-[var(--bg-primary,#0d0d1a)] border border-[var(--border)] rounded px-3 py-1.5 text-white text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
