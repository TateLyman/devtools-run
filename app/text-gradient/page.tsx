"use client";
import { useState } from "react";

export default function TextGradient() {
  const [text, setText] = useState("Gradient Text");
  const [color1, setColor1] = useState("#667eea");
  const [color2, setColor2] = useState("#764ba2");
  const [angle, setAngle] = useState(90);
  const [fontSize, setFontSize] = useState(64);

  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  const css = `background: ${gradient};\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;\nbackground-clip: text;`;

  const copy = () => navigator.clipboard.writeText(css);

  const presets = [
    ["#667eea", "#764ba2"], ["#f093fb", "#f5576c"], ["#4facfe", "#00f2fe"],
    ["#43e97b", "#38f9d7"], ["#fa709a", "#fee140"], ["#ff9a9e", "#fad0c4"],
    ["#a18cd1", "#fbc2eb"], ["#ff0844", "#ffb199"],
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Text Gradient</h1>
        <p className="text-[var(--text-secondary)]">Create beautiful gradient text effects</p>
      </section>

      <div className="flex justify-center p-8">
        <div className="font-bold text-center" style={{ fontSize: `${fontSize}px`, background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {text || "Type something"}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
        <input value={text} onChange={e => setText(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-center text-lg" placeholder="Your text here" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2"><input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-10 h-10 rounded cursor-pointer" /><input value={color1} onChange={e => setColor1(e.target.value)} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-sm" /></div>
          <div className="flex items-center gap-2"><input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-10 h-10 rounded cursor-pointer" /><input value={color2} onChange={e => setColor2(e.target.value)} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-sm" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Angle: {angle}°</label><input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full" /></div>
        </div>
        <div><label className="text-xs text-[var(--text-secondary)]">Font Size: {fontSize}px</label><input type="range" min={16} max={128} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full" /></div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map(([c1, c2], i) => (
          <button key={i} onClick={() => { setColor1(c1); setColor2(c2); }} className="w-12 h-8 rounded border border-[var(--border)] hover:scale-110 transition-transform"
            style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }} />
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold">CSS</label>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <pre className="font-mono text-sm text-emerald-400 whitespace-pre">{css}</pre>
      </div>
    </div>
  );
}
