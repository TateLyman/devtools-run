"use client";
import { useState } from "react";
export default function RegexViz() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact us at hello@example.com or support@test.org. Visit our site at www.example.com for info@company.co.uk details.");
  let matches: { start: number; end: number; match: string }[] = [];
  let error = "";
  try {
    const re = new RegExp(pattern, flags);
    let m;
    while ((m = re.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, match: m[0] });
      if (!flags.includes("g")) break;
    }
  } catch (e) { error = (e as Error).message; }

  const highlighted = () => {
    if (matches.length === 0) return <span>{text}</span>;
    const parts: React.ReactNode[] = [];
    let last = 0;
    matches.forEach((m, i) => {
      if (m.start > last) parts.push(<span key={`t${i}`}>{text.slice(last, m.start)}</span>);
      parts.push(<mark key={`m${i}`} className="bg-blue-500/30 text-blue-400 rounded px-0.5">{m.match}</mark>);
      last = m.end;
    });
    if (last < text.length) parts.push(<span key="end">{text.slice(last)}</span>);
    return <>{parts}</>;
  };

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Regex Visualizer</h1><p className="text-[var(--text-secondary)]">See matches highlighted in real-time</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex gap-2 mb-3">
          <span className="text-[var(--text-secondary)] py-2">/</span>
          <input value={pattern} onChange={e => setPattern(e.target.value)} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-blue-400" />
          <span className="text-[var(--text-secondary)] py-2">/</span>
          <input value={flags} onChange={e => setFlags(e.target.value)} className="w-16 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-2 py-2 font-mono text-center" />
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-sm resize-none" />
      </div>
      {error && <div className="text-red-400 text-sm text-center">{error}</div>}
      <div className="flex justify-center gap-4 text-sm">
        <span className="text-blue-400 font-bold">{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
        {matches.length > 0 && <button onClick={() => navigator.clipboard.writeText(matches.map(m => m.match).join("\n"))} className="text-xs text-blue-400 hover:underline">Copy all matches</button>}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 font-mono text-sm leading-relaxed">{highlighted()}</div>
      {matches.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-bold mb-2">Matches</h2>
          <div className="flex flex-wrap gap-2">{matches.map((m, i) => (<code key={i} className="bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1 text-xs text-blue-400 cursor-pointer" onClick={() => navigator.clipboard.writeText(m.match)}>{m.match}</code>))}</div>
        </div>
      )}
    </div>
  );
}
