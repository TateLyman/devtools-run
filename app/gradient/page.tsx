"use client";
import { useState } from "react";

export default function GradientPage() {
  const [c1, setC1] = useState("#6c5ce7");
  const [c2, setC2] = useState("#00d68f");
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const css = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;

  function copy() {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">CSS Gradient Generator</h1>
        <p className="text-gray-400 text-center mb-8">Create beautiful CSS gradients and copy the code.</p>
        <div className="rounded-2xl h-48 mb-8" style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }} />
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Color 1</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={c1} onChange={e => setC1(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent" />
                <input type="text" value={c1} onChange={e => setC1(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono w-24" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Color 2</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={c2} onChange={e => setC2(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent" />
                <input type="text" value={c2} onChange={e => setC2(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono w-24" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Angle: {angle}°</label>
              <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))}
                className="w-full mt-2" />
            </div>
          </div>
          <div className="flex gap-2">
            <code className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-sm text-green-400 font-mono">{css}</code>
            <button onClick={copy} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold text-sm">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            ["#667eea","#764ba2"],["#f093fb","#f5576c"],["#4facfe","#00f2fe"],["#43e97b","#38f9d7"],
            ["#fa709a","#fee140"],["#a18cd1","#fbc2eb"],["#ffecd2","#fcb69f"],["#ff9a9e","#fecfef"],
          ].map(([a,b],i) => (
            <button key={i} onClick={() => {setC1(a);setC2(b);}}
              className="h-12 rounded-lg cursor-pointer hover:ring-2 ring-white/30 transition-all"
              style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} />
          ))}
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/color" className="text-purple-400 hover:underline">Color Picker</a>{" | "}
          <a href="/css-minify" className="text-purple-400 hover:underline">CSS Minifier</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON Formatter</a>{" | "}
          <a href="/regex" className="text-purple-400 hover:underline">Regex Tester</a>{" | "}
          <a href="/qr" className="text-purple-400 hover:underline">QR Generator</a>
        </div>
      </div>
    </div>
  );
}
