"use client";
import { useState } from "react";

export default function CSSGlassmorphism() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.25);
  const [saturation, setSaturation] = useState(180);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [borderRadius, setBorderRadius] = useState(16);
  const [color, setColor] = useState("#ffffff");
  const [bgGradient, setBgGradient] = useState("linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
  const [copied, setCopied] = useState(false);

  const cssCode = `.glass {
  background: ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")};
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  border-radius: ${borderRadius}px;
  border: 1px solid rgba(255, 255, 255, ${borderOpacity.toFixed(2)});
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSS Glassmorphism Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Create beautiful glass-effect UI components. Adjust blur, opacity, saturation, and border. Copy the CSS code.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Blur: {blur}px</label>
              <input type="range" min={0} max={30} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Opacity: {(opacity * 100).toFixed(0)}%</label>
              <input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Saturation: {saturation}%</label>
              <input type="range" min={100} max={300} value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Border Opacity: {(borderOpacity * 100).toFixed(0)}%</label>
              <input type="range" min={0} max={1} step={0.05} value={borderOpacity} onChange={(e) => setBorderOpacity(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Border Radius: {borderRadius}px</label>
              <input type="range" min={0} max={50} value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400">Glass Color:</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <label className="block text-xs text-gray-400 mb-2">Background</label>
            <div className="flex gap-2 flex-wrap">
              {gradients.map((g, i) => (
                <button key={i} onClick={() => setBgGradient(g)} className={`w-10 h-10 rounded-lg border-2 ${bgGradient === g ? "border-white" : "border-transparent"}`} style={{ background: g }} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">CSS Code</label>
              <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-emerald-400">{cssCode}</pre>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-lg p-8 min-h-[400px]" style={{ background: bgGradient }}>
          <div
            className="w-80 p-8 text-white text-center"
            style={{
              background: `${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`,
              backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
              WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
              borderRadius: `${borderRadius}px`,
              border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
            }}
          >
            <h3 className="text-xl font-bold mb-2">Glass Card</h3>
            <p className="text-sm text-white/80">This is a glassmorphism effect. Adjust the controls to customize the look.</p>
            <button className="mt-4 px-4 py-2 bg-white/20 rounded-lg text-sm font-bold hover:bg-white/30 transition-colors">Action Button</button>
          </div>
        </div>
      </div>
    </div>
  );
}
