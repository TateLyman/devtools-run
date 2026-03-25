"use client";
import { useState } from "react";

export default function CSSTextShadow() {
  const [shadows, setShadows] = useState([
    { x: 2, y: 2, blur: 4, color: "#000000", opacity: 0.5 },
  ]);
  const [text, setText] = useState("Hello World");
  const [fontSize, setFontSize] = useState(64);
  const [textColor, setTextColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [copied, setCopied] = useState(false);

  const addShadow = () => setShadows([...shadows, { x: 4, y: 4, blur: 8, color: "#6366f1", opacity: 0.6 }]);
  const removeShadow = (i: number) => setShadows(shadows.filter((_, idx) => idx !== i));
  const updateShadow = (i: number, field: string, value: number | string) => {
    const copy = [...shadows];
    (copy[i] as any)[field] = value;
    setShadows(copy);
  };

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const shadowCSS = shadows.map((s) => `${s.x}px ${s.y}px ${s.blur}px ${hexToRgba(s.color, s.opacity)}`).join(",\n    ");
  const fullCSS = `.text-shadow {\n  text-shadow: ${shadowCSS};\n  color: ${textColor};\n  font-size: ${fontSize}px;\n}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { name: "Neon Glow", shadows: [{ x: 0, y: 0, blur: 10, color: "#ff00ff", opacity: 1 }, { x: 0, y: 0, blur: 40, color: "#ff00ff", opacity: 0.5 }] },
    { name: "3D", shadows: [{ x: 1, y: 1, blur: 0, color: "#333333", opacity: 1 }, { x: 2, y: 2, blur: 0, color: "#444444", opacity: 1 }, { x: 3, y: 3, blur: 0, color: "#555555", opacity: 1 }] },
    { name: "Fire", shadows: [{ x: 0, y: -2, blur: 4, color: "#ff6600", opacity: 0.8 }, { x: 0, y: -4, blur: 10, color: "#ff0000", opacity: 0.5 }] },
    { name: "Retro", shadows: [{ x: 3, y: 3, blur: 0, color: "#00ffff", opacity: 1 }] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSS Text Shadow Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Create beautiful text shadow effects. Multiple layers, live preview, preset effects. Copy the CSS code.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {presets.map((p) => (
              <button key={p.name} onClick={() => setShadows(p.shadows)} className="px-3 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{p.name}</button>
            ))}
          </div>

          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Preview text" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Font Size</label>
              <input type="range" min={16} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div className="flex items-end gap-1">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
              <span className="text-xs text-gray-400">Text</span>
            </div>
            <div className="flex items-end gap-1">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
              <span className="text-xs text-gray-400">BG</span>
            </div>
          </div>

          {shadows.map((s, i) => (
            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">Shadow {i + 1}</span>
                {shadows.length > 1 && <button onClick={() => removeShadow(i)} className="text-xs text-red-400">Remove</button>}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div><label className="text-[10px] text-gray-500">X: {s.x}px</label><input type="range" min={-50} max={50} value={s.x} onChange={(e) => updateShadow(i, "x", Number(e.target.value))} className="w-full accent-purple-500" /></div>
                <div><label className="text-[10px] text-gray-500">Y: {s.y}px</label><input type="range" min={-50} max={50} value={s.y} onChange={(e) => updateShadow(i, "y", Number(e.target.value))} className="w-full accent-purple-500" /></div>
                <div><label className="text-[10px] text-gray-500">Blur: {s.blur}px</label><input type="range" min={0} max={50} value={s.blur} onChange={(e) => updateShadow(i, "blur", Number(e.target.value))} className="w-full accent-purple-500" /></div>
                <div className="flex items-end gap-1"><input type="color" value={s.color} onChange={(e) => updateShadow(i, "color", e.target.value)} className="w-full h-6 rounded cursor-pointer" /></div>
              </div>
              <div><label className="text-[10px] text-gray-500">Opacity: {(s.opacity * 100).toFixed(0)}%</label><input type="range" min={0} max={1} step={0.05} value={s.opacity} onChange={(e) => updateShadow(i, "opacity", Number(e.target.value))} className="w-full accent-purple-500" /></div>
            </div>
          ))}
          <button onClick={addShadow} className="text-sm text-purple-400 hover:text-purple-300">+ Add Shadow Layer</button>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">CSS</label>
              <button onClick={handleCopy} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-emerald-400">{fullCSS}</pre>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-lg min-h-[300px]" style={{ backgroundColor: bgColor }}>
          <p style={{ fontSize: `${fontSize}px`, color: textColor, textShadow: shadows.map((s) => `${s.x}px ${s.y}px ${s.blur}px ${hexToRgba(s.color, s.opacity)}`).join(", "), fontWeight: "bold" }}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
