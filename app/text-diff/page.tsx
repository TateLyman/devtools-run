"use client";
import { useState } from "react";

export default function TextDiffPage() {
  const [a, setA] = useState("Hello World\nThis is the original text.\nLine three.");
  const [b, setB] = useState("Hello World\nThis is the modified text.\nLine three.\nNew line four.");

  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const maxLen = Math.max(aLines.length, bLines.length);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Text Compare / Diff</h1>
        <p className="text-gray-400 text-center mb-8">Paste two texts to see differences highlighted line by line.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Original</label>
            <textarea value={a} onChange={e=>setA(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm font-mono h-40 resize-none text-red-300" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Modified</label>
            <textarea value={b} onChange={e=>setB(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm font-mono h-40 resize-none text-green-300" />
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <h2 className="font-bold mb-3 text-sm">Diff</h2>
          <div className="font-mono text-xs space-y-0.5">
            {Array.from({length: maxLen}).map((_, i) => {
              const lineA = aLines[i] || "";
              const lineB = bLines[i] || "";
              if (lineA === lineB) return <div key={i} className="text-gray-400 px-2">  {lineA}</div>;
              return (
                <div key={i}>
                  {lineA && <div className="bg-red-900/20 text-red-400 px-2">- {lineA}</div>}
                  {lineB && <div className="bg-green-900/20 text-green-400 px-2">+ {lineB}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/diff" className="text-purple-400 hover:underline">Full Diff Tool</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/word-counter" className="text-purple-400 hover:underline">Word Counter</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
