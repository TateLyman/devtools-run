"use client";

import { useState, useMemo } from "react";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState("");

  const matches = useMemo(() => {
    if (!pattern || !testString) return [];
    try {
      const regex = new RegExp(pattern, flags);
      setError("");
      const results: { start: number; end: number; match: string; groups?: Record<string, string> }[] = [];

      if (flags.includes("g")) {
        let m;
        let safety = 0;
        while ((m = regex.exec(testString)) !== null && safety < 10000) {
          results.push({
            start: m.index,
            end: m.index + m[0].length,
            match: m[0],
            groups: m.groups ? { ...m.groups } : undefined,
          });
          if (m[0].length === 0) regex.lastIndex++;
          safety++;
        }
      } else {
        const m = regex.exec(testString);
        if (m) {
          results.push({
            start: m.index,
            end: m.index + m[0].length,
            match: m[0],
            groups: m.groups ? { ...m.groups } : undefined,
          });
        }
      }
      return results;
    } catch (e) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, flags, testString]);

  const highlightedHtml = useMemo(() => {
    if (!pattern || !testString || matches.length === 0) return null;

    const parts: { text: string; highlighted: boolean }[] = [];
    let lastIndex = 0;

    for (const match of matches) {
      if (match.start > lastIndex) {
        parts.push({
          text: testString.slice(lastIndex, match.start),
          highlighted: false,
        });
      }
      parts.push({
        text: testString.slice(match.start, match.end),
        highlighted: true,
      });
      lastIndex = match.end;
    }
    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), highlighted: false });
    }
    return parts;
  }, [pattern, testString, matches]);

  function toggleFlag(flag: string) {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Regex Tester</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Test regular expression patterns against text with real-time match
          highlighting.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Regular Expression
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] overflow-hidden">
              <span className="px-3 text-[var(--text-secondary)] select-none">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="flex-1 border-0 bg-transparent px-0"
                spellCheck={false}
              />
              <span className="px-3 text-[var(--text-secondary)] select-none">
                /{flags}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {[
              { flag: "g", label: "global" },
              { flag: "i", label: "case-insensitive" },
              { flag: "m", label: "multiline" },
              { flag: "s", label: "dotAll" },
            ].map(({ flag, label }) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  flags.includes(flag)
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)]"
                }`}
                title={label}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Test String</label>
          <textarea
            rows={6}
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against..."
            spellCheck={false}
          />
        </div>

        {highlightedHtml && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Highlighted Matches
            </label>
            <pre className="min-h-[100px]">
              {highlightedHtml.map((part, i) =>
                part.highlighted ? (
                  <mark
                    key={i}
                    className="bg-[var(--accent)]/30 text-[var(--accent)] rounded px-0.5"
                  >
                    {part.text}
                  </mark>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </pre>
          </div>
        )}

        {matches.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Matches ({matches.length})
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matches.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-secondary)]">
                      Match {i + 1}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Index: {m.start}-{m.end}
                    </span>
                  </div>
                  <code className="text-[var(--accent)]">{m.match}</code>
                  {m.groups && Object.keys(m.groups).length > 0 && (
                    <div className="mt-1 text-xs text-[var(--text-secondary)]">
                      Groups:{" "}
                      {Object.entries(m.groups).map(([k, v]) => (
                        <span key={k} className="mr-2">
                          {k}=&quot;{v}&quot;
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Regular Expressions
        </h2>
        <p>
          Regular expressions (regex) are patterns used to match character
          combinations in strings. This tool tests your regex patterns in
          real-time with match highlighting and detailed match information.
        </p>
      </section>
    </>
  );
}
