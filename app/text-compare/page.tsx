"use client";
import { useState } from "react";

function diffLines(a: string, b: string): { type: "same" | "add" | "remove"; text: string }[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const result: { type: "same" | "add" | "remove"; text: string }[] = [];

  // Simple LCS-based diff
  const m = linesA.length, n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = linesA[i - 1] === linesB[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  let i = m, j = n;
  const ops: { type: "same" | "add" | "remove"; text: string }[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      ops.unshift({ type: "same", text: linesA[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: "add", text: linesB[j - 1] });
      j--;
    } else {
      ops.unshift({ type: "remove", text: linesA[i - 1] });
      i--;
    }
  }

  return ops;
}

export default function TextCompare() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const preprocess = (t: string) => {
    let s = t;
    if (ignoreCase) s = s.toLowerCase();
    if (ignoreWhitespace) s = s.replace(/\s+/g, " ").replace(/^\s+|\s+$/gm, "");
    return s;
  };

  const diff = textA || textB ? diffLines(preprocess(textA), preprocess(textB)) : [];
  const additions = diff.filter((d) => d.type === "add").length;
  const removals = diff.filter((d) => d.type === "remove").length;
  const identical = diff.length > 0 && additions === 0 && removals === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text Compare / Diff Checker</h1>
        <p className="text-[var(--text-secondary)]">
          Compare two texts side by side. See additions, removals, and unchanged lines highlighted. Free online diff tool.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} className="accent-purple-500" />
          Ignore case
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={ignoreWhitespace} onChange={(e) => setIgnoreWhitespace(e.target.checked)} className="accent-purple-500" />
          Ignore whitespace
        </label>
        {diff.length > 0 && (
          <span className="text-xs text-[var(--text-secondary)] ml-auto">
            <span className="text-emerald-400">+{additions}</span> / <span className="text-red-400">-{removals}</span>
            {identical && <span className="text-emerald-400 ml-2 font-bold">Texts are identical</span>}
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Original</label>
          <textarea value={textA} onChange={(e) => setTextA(e.target.value)} placeholder="Paste original text..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-48 resize-none font-mono text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Modified</label>
          <textarea value={textB} onChange={(e) => setTextB(e.target.value)} placeholder="Paste modified text..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-48 resize-none font-mono text-sm" />
        </div>
      </div>

      {diff.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="p-2 border-b border-[var(--border)] text-sm font-medium">Diff Result</div>
          <div className="p-0 font-mono text-sm max-h-[500px] overflow-auto">
            {diff.map((d, i) => (
              <div
                key={i}
                className={`px-4 py-0.5 border-l-4 ${
                  d.type === "add" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" :
                  d.type === "remove" ? "bg-red-500/10 border-red-500 text-red-400" :
                  "border-transparent text-gray-400"
                }`}
              >
                <span className="select-none mr-2 text-gray-600">{d.type === "add" ? "+" : d.type === "remove" ? "-" : " "}</span>
                {d.text || " "}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
