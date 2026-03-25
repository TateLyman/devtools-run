"use client";
import { useState, useMemo } from "react";

const presets: Record<string, { pattern: string; flags: string; label: string }> = {
  email: { pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g", label: "Email" },
  url: { pattern: "https?://[\\w-]+(\\.[\\w-]+)+[\\w.,@?^=%&:/~+#-]*", flags: "g", label: "URL" },
  ip: { pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b", flags: "g", label: "IPv4" },
  phone: { pattern: "\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,3}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}", flags: "g", label: "Phone" },
  hex: { pattern: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b", flags: "g", label: "Hex Color" },
  date: { pattern: "\\d{4}[-/]\\d{2}[-/]\\d{2}", flags: "g", label: "Date YYYY-MM-DD" },
  html: { pattern: "<[^>]+>", flags: "g", label: "HTML Tags" },
  digits: { pattern: "\\b\\d+\\b", flags: "g", label: "Numbers" },
};

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState("");

  const { matches, highlighted } = useMemo(() => {
    if (!pattern || !testString) return { matches: [], highlighted: "" };
    try {
      const regex = new RegExp(pattern, flags);
      const matchArr: { match: string; index: number; groups: string[] }[] = [];
      let m;
      if (flags.includes("g")) {
        while ((m = regex.exec(testString)) !== null) {
          matchArr.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (!m[0]) break; // prevent infinite loop on empty match
        }
      } else {
        m = regex.exec(testString);
        if (m) matchArr.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }

      // Build highlighted HTML
      let hl = "";
      let lastIdx = 0;
      for (const { match, index } of matchArr) {
        hl += testString.slice(lastIdx, index).replace(/</g, "&lt;").replace(/>/g, "&gt;");
        hl += `<mark class="bg-purple-500/40 text-white rounded px-0.5">${match.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</mark>`;
        lastIdx = index + match.length;
      }
      hl += testString.slice(lastIdx).replace(/</g, "&lt;").replace(/>/g, "&gt;");

      if (error) setError("");
      return { matches: matchArr, highlighted: hl };
    } catch (e: any) {
      if (!error) setError(e.message);
      return { matches: [], highlighted: "" };
    }
  }, [pattern, flags, testString]);

  const toggleFlag = (f: string) => {
    setFlags((prev) => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Regex Tester</h1>
        <p className="text-[var(--text-secondary)]">
          Test regular expressions with real-time match highlighting. Common presets included. Free online regex tester.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
        <div className="flex gap-2 items-center">
          <span className="text-gray-400 font-mono">/</span>
          <input value={pattern} onChange={(e) => { setPattern(e.target.value); setError(""); }} placeholder="Enter regex pattern..." className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white font-mono text-sm" />
          <span className="text-gray-400 font-mono">/</span>
          <input value={flags} onChange={(e) => setFlags(e.target.value)} className="w-16 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-2 text-white font-mono text-sm text-center" />
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-gray-400">Flags:</span>
          {[{ f: "g", l: "global" }, { f: "i", l: "case-insensitive" }, { f: "m", l: "multiline" }, { f: "s", l: "dotAll" }].map(({ f, l }) => (
            <button key={f} onClick={() => toggleFlag(f)} className={`px-2 py-0.5 rounded text-xs ${flags.includes(f) ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>
              {f} <span className="text-gray-400">({l})</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-gray-400">Presets:</span>
          {Object.entries(presets).map(([k, v]) => (
            <button key={k} onClick={() => { setPattern(v.pattern); setFlags(v.flags); setError(""); }} className="px-2 py-0.5 rounded text-xs bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white">{v.label}</button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-red-400 text-sm font-mono">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Test String</label>
          <textarea value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Enter text to test against..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-64 resize-none font-mono text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Highlighted Matches ({matches.length})</label>
          <div className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 h-64 overflow-auto font-mono text-sm text-white whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlighted || '<span class="text-gray-500">Matches will be highlighted here...</span>' }} />
        </div>
      </div>

      {matches.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2">Match Details ({matches.length} matches)</h3>
          <div className="max-h-48 overflow-auto space-y-1">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-mono py-1 border-b border-[var(--border)] last:border-0">
                <span className="text-gray-500 w-8">#{i + 1}</span>
                <span className="text-purple-400">{`"${m.match}"`}</span>
                <span className="text-gray-500">index {m.index}</span>
                {m.groups.length > 0 && <span className="text-emerald-400">groups: [{m.groups.join(", ")}]</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
