"use client";
import { useState } from "react";

export default function CSSVariables() {
  const [primary, setPrimary] = useState("#3b82f6");
  const [secondary, setSecondary] = useState("#8b5cf6");
  const [accent, setAccent] = useState("#22c55e");
  const [bg, setBg] = useState("#0f172a");
  const [surface, setSurface] = useState("#1e293b");
  const [text, setText] = useState("#f8fafc");
  const [muted, setMuted] = useState("#94a3b8");
  const [border, setBorder] = useState("#334155");
  const [radius, setRadius] = useState("8");
  const [fontBase, setFontBase] = useState("16");

  const css = `:root {
  /* Colors */
  --color-primary: ${primary};
  --color-secondary: ${secondary};
  --color-accent: ${accent};
  --color-bg: ${bg};
  --color-surface: ${surface};
  --color-text: ${text};
  --color-muted: ${muted};
  --color-border: ${border};

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Typography */
  --font-size-base: ${fontBase}px;
  --font-size-sm: ${Math.round(parseInt(fontBase) * 0.875)}px;
  --font-size-lg: ${Math.round(parseInt(fontBase) * 1.125)}px;
  --font-size-xl: ${Math.round(parseInt(fontBase) * 1.25)}px;
  --font-size-2xl: ${Math.round(parseInt(fontBase) * 1.5)}px;

  /* Border Radius */
  --radius-sm: ${Math.round(parseInt(radius) * 0.5)}px;
  --radius-md: ${radius}px;
  --radius-lg: ${Math.round(parseInt(radius) * 1.5)}px;
  --radius-full: 9999px;
}`;

  const copy = () => navigator.clipboard.writeText(css);

  const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
      <div className="flex-1">
        <div className="text-xs text-[var(--text-secondary)]">{label}</div>
        <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-0.5 font-mono text-xs" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Variables Generator</h1><p className="text-[var(--text-secondary)]">Build a design system with CSS custom properties</p></section>

      <div className="rounded-xl p-6 border" style={{ backgroundColor: bg, borderColor: border, color: text }}>
        <h2 className="text-xl font-bold mb-2" style={{ color: primary }}>Preview</h2>
        <p style={{ color: muted }}>This is how your design system looks.</p>
        <div className="flex gap-2 mt-3">
          <button style={{ backgroundColor: primary, borderRadius: `${radius}px` }} className="text-white px-4 py-2 font-bold text-sm">Primary</button>
          <button style={{ backgroundColor: secondary, borderRadius: `${radius}px` }} className="text-white px-4 py-2 font-bold text-sm">Secondary</button>
          <button style={{ backgroundColor: accent, borderRadius: `${radius}px` }} className="text-white px-4 py-2 font-bold text-sm">Accent</button>
        </div>
        <div className="mt-3 p-3" style={{ backgroundColor: surface, borderRadius: `${radius}px`, border: `1px solid ${border}` }}>
          <p style={{ fontSize: `${fontBase}px` }}>Surface card with base font size</p>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold mb-3">Colors</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <ColorInput label="Primary" value={primary} onChange={setPrimary} />
          <ColorInput label="Secondary" value={secondary} onChange={setSecondary} />
          <ColorInput label="Accent" value={accent} onChange={setAccent} />
          <ColorInput label="Background" value={bg} onChange={setBg} />
          <ColorInput label="Surface" value={surface} onChange={setSurface} />
          <ColorInput label="Text" value={text} onChange={setText} />
          <ColorInput label="Muted" value={muted} onChange={setMuted} />
          <ColorInput label="Border" value={border} onChange={setBorder} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div><label className="text-xs text-[var(--text-secondary)]">Border Radius: {radius}px</label><input type="range" min={0} max={24} value={radius} onChange={e => setRadius(e.target.value)} className="w-full" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Base Font: {fontBase}px</label><input type="range" min={12} max={24} value={fontBase} onChange={e => setFontBase(e.target.value)} className="w-full" /></div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div>
        <pre className="font-mono text-xs text-emerald-400 whitespace-pre max-h-64 overflow-y-auto">{css}</pre>
      </div>
    </div>
  );
}
