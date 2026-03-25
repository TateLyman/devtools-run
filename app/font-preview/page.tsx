"use client";
import { useState } from "react";

const fonts = [
  "Arial", "Helvetica", "Georgia", "Times New Roman", "Verdana", "Trebuchet MS",
  "Courier New", "Lucida Console", "Impact", "Comic Sans MS", "Palatino",
  "Garamond", "Bookman", "Tahoma", "Geneva", "Optima", "Futura",
  "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace",
];

export default function FontPreview() {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
  const [size, setSize] = useState(32);
  const [weight, setWeight] = useState("400");
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#0f0f1a");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Font Preview & Tester</h1>
        <p className="text-[var(--text-secondary)]">
          Preview text in 21 system fonts. Adjust size, weight, color, spacing, line height. Compare fonts side by side. Free font tester.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2 text-white text-sm h-16 resize-none" placeholder="Type your text here..." />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Size: {size}px</label>
            <input type="range" min={8} max={96} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Weight</label>
            <select value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
              {["100", "200", "300", "400", "500", "600", "700", "800", "900"].map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Spacing: {letterSpacing}px</label>
            <input type="range" min={-5} max={20} value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Line Height: {lineHeight}</label>
            <input type="range" min={0.8} max={3} step={0.1} value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer" /><span className="text-xs text-gray-400">Text</span></div>
          <div className="flex items-center gap-1"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-6 h-6 rounded cursor-pointer" /><span className="text-xs text-gray-400">Background</span></div>
        </div>

        <div className="space-y-3">
          {fonts.map((font) => (
            <div key={font} className="border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="bg-[var(--bg-secondary)] px-3 py-1.5 flex items-center justify-between">
                <span className="text-xs font-mono text-purple-400">{font}</span>
                <button onClick={() => navigator.clipboard.writeText(`font-family: "${font}", sans-serif;`)} className="text-[10px] text-gray-500 hover:text-white">Copy CSS</button>
              </div>
              <div className="p-4" style={{ backgroundColor: bg, color, fontFamily: `"${font}", sans-serif`, fontSize: `${size}px`, fontWeight: weight, letterSpacing: `${letterSpacing}px`, lineHeight }}>
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
