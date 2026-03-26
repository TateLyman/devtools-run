"use client";
import { useState } from "react";

function diffLines(a: string, b: string): { type: "same"|"add"|"remove"; text: string }[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const result: { type: "same"|"add"|"remove"; text: string }[] = [];
  const max = Math.max(linesA.length, linesB.length);
  
  let ia = 0, ib = 0;
  while (ia < linesA.length || ib < linesB.length) {
    if (ia < linesA.length && ib < linesB.length && linesA[ia] === linesB[ib]) {
      result.push({ type: "same", text: linesA[ia] });
      ia++; ib++;
    } else if (ib < linesB.length && (ia >= linesA.length || !linesA.slice(ia).includes(linesB[ib]))) {
      result.push({ type: "add", text: linesB[ib] });
      ib++;
    } else if (ia < linesA.length) {
      result.push({ type: "remove", text: linesA[ia] });
      ia++;
    }
  }
  return result;
}

export default function TextDiffChecker() {
  const [textA, setTextA] = useState("Hello World\nThis is a test\nLine three");
  const [textB, setTextB] = useState("Hello World\nThis is modified\nLine three\nNew line four");

  const diff = diffLines(textA, textB);
  const adds = diff.filter(d => d.type === "add").length;
  const removes = diff.filter(d => d.type === "remove").length;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Text Diff Checker</h1>
        <p className="text-[var(--text-secondary)]">Compare two texts and see the differences</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <label className="text-sm font-bold block mb-2">Original</label>
          <textarea value={textA} onChange={e => setTextA(e.target.value)} rows={8}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <label className="text-sm font-bold block mb-2">Modified</label>
          <textarea value={textB} onChange={e => setTextB(e.target.value)} rows={8}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
        </div>
      </div>

      <div className="flex justify-center gap-4 text-sm">
        <span className="text-emerald-400">+{adds} additions</span>
        <span className="text-red-400">-{removes} removals</span>
        <span className="text-[var(--text-secondary)]">{diff.filter(d => d.type === "same").length} unchanged</span>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-bold mb-2">Diff Output</h2>
        <div className="font-mono text-sm space-y-0">
          {diff.map((d, i) => (
            <div key={i} className={`px-3 py-0.5 ${d.type === "add" ? "bg-emerald-500/10 text-emerald-400" : d.type === "remove" ? "bg-red-500/10 text-red-400 line-through" : "text-[var(--text-secondary)]"}`}>
              <span className="inline-block w-4 opacity-50">{d.type === "add" ? "+" : d.type === "remove" ? "-" : " "}</span>
              {d.text || " "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
