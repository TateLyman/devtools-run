"use client";
import { useState } from "react";

export default function ReadingTime() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(238);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter(s => s.trim()).length;
  const readMins = words / wpm;
  const speakMins = words / 150;
  const pages = words / 250;

  const fmt = (mins: number) => {
    if (mins < 1) return "< 1 min";
    const h = Math.floor(mins / 60);
    const m = Math.ceil(mins % 60);
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Reading Time Calculator</h1>
        <p className="text-[var(--text-secondary)]">Paste text to calculate reading and speaking time</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <textarea value={text} onChange={e => setText(e.target.value)} rows={8} placeholder="Paste your text here..."
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-sm resize-none" />
        <div className="flex justify-between items-center mt-2 text-xs text-[var(--text-secondary)]">
          <span>Reading speed: {wpm} WPM</span>
          <input type="range" min={100} max={400} value={wpm} onChange={e => setWpm(Number(e.target.value))} className="w-32" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: "Reading Time", value: fmt(readMins), sub: `at ${wpm} WPM` },
          { label: "Speaking Time", value: fmt(speakMins), sub: "at 150 WPM" },
          { label: "Words", value: words.toLocaleString(), sub: "" },
          { label: "Pages", value: pages.toFixed(1), sub: "at 250 words/page" },
        ].map(c => (
          <div key={c.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
            <div className="text-xs text-[var(--text-secondary)]">{c.label}</div>
            <div className="text-2xl font-bold">{c.value}</div>
            {c.sub && <div className="text-xs text-[var(--text-secondary)]">{c.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: "Characters", value: chars.toLocaleString() },
          { label: "No Spaces", value: charsNoSpace.toLocaleString() },
          { label: "Sentences", value: sentences.toLocaleString() },
          { label: "Paragraphs", value: paragraphs.toLocaleString() },
        ].map(c => (
          <div key={c.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 text-center">
            <div className="text-xs text-[var(--text-secondary)]">{c.label}</div>
            <div className="text-lg font-bold">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
