"use client";

import { useState, useMemo } from "react";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
  leftNum: number | null;
  rightNum: number | null;
}

function computeDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split("\n");
  const linesB = textB.split("\n");
  const m = linesA.length;
  const n = linesB.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to produce diff
  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({
        type: "unchanged",
        text: linesA[i - 1],
        leftNum: i,
        rightNum: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: "added",
        text: linesB[j - 1],
        leftNum: null,
        rightNum: j,
      });
      j--;
    } else if (i > 0) {
      result.unshift({
        type: "removed",
        text: linesA[i - 1],
        leftNum: i,
        rightNum: null,
      });
      i--;
    }
  }

  return result;
}

export default function DiffPage() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");

  const diffLines = useMemo(() => {
    if (!textA && !textB) return [];
    return computeDiff(textA, textB);
  }, [textA, textB]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const line of diffLines) {
      if (line.type === "added") added++;
      if (line.type === "removed") removed++;
    }
    return { added, removed };
  }, [diffLines]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Text Diff Tool</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Compare two pieces of text side by side with line-by-line diff
          highlighting. Runs entirely in your browser.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            Original Text
          </label>
          <textarea
            rows={10}
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Paste the original text here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Modified Text
          </label>
          <textarea
            rows={10}
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Paste the modified text here..."
            spellCheck={false}
          />
        </div>
      </div>

      {diffLines.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-3">
            <label className="block text-sm font-medium">Diff Result</label>
            <span className="text-xs text-[var(--success)]">
              +{stats.added} added
            </span>
            <span className="text-xs text-[var(--error)]">
              -{stats.removed} removed
            </span>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] overflow-x-auto">
            <table className="w-full text-sm font-mono" style={{ borderCollapse: "collapse" }}>
              <tbody>
                {diffLines.map((line, idx) => {
                  let bgColor = "transparent";
                  let textColor = "var(--text-primary)";
                  let prefix = " ";

                  if (line.type === "added") {
                    bgColor = "rgba(34, 197, 94, 0.1)";
                    textColor = "var(--success)";
                    prefix = "+";
                  } else if (line.type === "removed") {
                    bgColor = "rgba(239, 68, 68, 0.1)";
                    textColor = "var(--error)";
                    prefix = "-";
                  }

                  return (
                    <tr key={idx} style={{ backgroundColor: bgColor }}>
                      <td
                        className="select-none text-right px-2 py-0.5"
                        style={{
                          color: "var(--text-secondary)",
                          minWidth: "3rem",
                          fontSize: "0.75rem",
                          borderRight: "1px solid var(--border)",
                        }}
                      >
                        {line.leftNum ?? ""}
                      </td>
                      <td
                        className="select-none text-right px-2 py-0.5"
                        style={{
                          color: "var(--text-secondary)",
                          minWidth: "3rem",
                          fontSize: "0.75rem",
                          borderRight: "1px solid var(--border)",
                        }}
                      >
                        {line.rightNum ?? ""}
                      </td>
                      <td
                        className="select-none px-2 py-0.5"
                        style={{
                          color: textColor,
                          width: "1rem",
                          fontWeight: 600,
                        }}
                      >
                        {prefix}
                      </td>
                      <td
                        className="px-2 py-0.5 whitespace-pre-wrap"
                        style={{ color: textColor }}
                      >
                        {line.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">About Text Diff</h2>
        <p>
          This text diff tool compares two pieces of text and highlights the
          differences line by line. Added lines are shown in green and removed
          lines in red, similar to a Git diff. The comparison uses a longest
          common subsequence algorithm for accurate results.
        </p>
      </section>
    </>
  );
}
