"use client";
import { useState } from "react";

export default function PxConverter() {
  const [px, setPx] = useState("16");
  const [base, setBase] = useState("16");
  const pxVal = parseFloat(px) || 0;
  const baseVal = parseFloat(base) || 16;
  const rem = pxVal / baseVal;
  const em = rem;
  const pt = pxVal * 0.75;
  const vw = (pxVal / 1920) * 100;
  const vh = (pxVal / 1080) * 100;
  const pct = (pxVal / baseVal) * 100;
  const copy = (t: string) => navigator.clipboard.writeText(t);

  const common = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">PX to REM Converter</h1>
        <p className="text-[var(--text-secondary)]">Convert pixels to rem, em, pt, vw, vh and more</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Pixels (px)</label>
            <input value={px} onChange={e => setPx(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-2xl" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Base Font Size (px)</label>
            <input value={base} onChange={e => setBase(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: "REM", value: rem.toFixed(4) + "rem", raw: rem.toFixed(4) },
          { label: "EM", value: em.toFixed(4) + "em", raw: em.toFixed(4) },
          { label: "PT", value: pt.toFixed(2) + "pt", raw: pt.toFixed(2) },
          { label: "VW (1920px)", value: vw.toFixed(4) + "vw", raw: vw.toFixed(4) },
          { label: "VH (1080px)", value: vh.toFixed(4) + "vh", raw: vh.toFixed(4) },
          { label: "%", value: pct.toFixed(2) + "%", raw: pct.toFixed(2) },
        ].map(c => (
          <div key={c.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-blue-500/50" onClick={() => copy(c.value)}>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">{c.label}</div>
              <div className="text-lg font-bold font-mono">{c.value}</div>
            </div>
            <span className="text-xs text-blue-400">Copy</span>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Common Sizes (base: {baseVal}px)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
              <th className="py-2 pr-4">PX</th><th className="py-2 pr-4">REM</th><th className="py-2 pr-4">PT</th><th className="py-2">Use</th>
            </tr></thead>
            <tbody>
              {common.map(p => (
                <tr key={p} className={`border-b border-[var(--border)] ${p === pxVal ? "bg-blue-500/10 text-blue-400" : ""}`}>
                  <td className="py-1.5 pr-4 font-mono">{p}px</td>
                  <td className="py-1.5 pr-4 font-mono">{(p / baseVal).toFixed(3)}rem</td>
                  <td className="py-1.5 pr-4 font-mono">{(p * 0.75).toFixed(1)}pt</td>
                  <td className="py-1.5 text-[var(--text-secondary)]">
                    {p <= 10 ? "Caption" : p <= 14 ? "Small text" : p === 16 ? "Body (default)" : p <= 20 ? "Large text" : p <= 32 ? "Heading" : "Display"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
