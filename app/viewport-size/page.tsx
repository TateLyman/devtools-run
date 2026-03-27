"use client";
import { useState, useEffect } from "react";
export default function ViewportSize() {
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  useEffect(() => {
    const update = () => { setW(window.innerWidth); setH(window.innerHeight); };
    update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update);
  }, []);
  const bp = w < 640 ? "Mobile (<640)" : w < 768 ? "Mobile/Tablet (640-767)" : w < 1024 ? "Tablet (768-1023)" : w < 1280 ? "Laptop (1024-1279)" : "Desktop (1280+)";
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Viewport Size</h1><p className="text-[var(--text-secondary)]">Live browser dimensions — resize to update</p></section>
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-12 text-center">
        <div className="text-6xl font-bold text-blue-400 font-mono">{w} × {h}</div>
        <div className="text-lg text-[var(--text-secondary)] mt-2">{bp}</div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center"><div className="text-xs text-[var(--text-secondary)]">Width</div><div className="text-2xl font-bold">{w}px</div></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center"><div className="text-xs text-[var(--text-secondary)]">Height</div><div className="text-2xl font-bold">{h}px</div></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center"><div className="text-xs text-[var(--text-secondary)]">Ratio</div><div className="text-2xl font-bold">{(w/h).toFixed(2)}</div></div>
      </div>
    </div>
  );
}
