"use client";
import { useState, useMemo } from "react";

export default function CharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter((p) => p.trim()).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    // Character frequency
    const freq: Record<string, number> = {};
    for (const c of text.toLowerCase()) {
      if (/[a-z]/.test(c)) freq[c] = (freq[c] || 0) + 1;
    }
    const topChars = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Word frequency
    const wordFreq: Record<string, number> = {};
    const wordsArr = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    for (const w of wordsArr) {
      if (w.length > 2) wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
    const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Density
    const density = chars > 0 ? ((charsNoSpaces / chars) * 100).toFixed(1) : "0";

    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, readingTime, speakingTime, topChars, topWords, density };
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Character Counter & Word Counter</h1>
        <p className="text-[var(--text-secondary)]">
          Count characters, words, sentences, paragraphs, and lines in real-time. Reading time estimate. Top word frequency analysis.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-48 resize-none text-sm"
        autoFocus
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Characters", value: stats.chars.toLocaleString() },
          { label: "Without Spaces", value: stats.charsNoSpaces.toLocaleString() },
          { label: "Words", value: stats.words.toLocaleString() },
          { label: "Sentences", value: stats.sentences.toLocaleString() },
          { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
          { label: "Lines", value: stats.lines.toLocaleString() },
          { label: "Reading Time", value: `${stats.readingTime} min` },
          { label: "Speaking Time", value: `${stats.speakingTime} min` },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-purple-400">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {stats.words > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-sm mb-2">Top Words</h3>
            <div className="space-y-1">
              {stats.topWords.map(([word, count]) => (
                <div key={word} className="flex items-center gap-2 text-sm">
                  <span className="text-white w-20 font-mono">{word}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${(count / (stats.topWords[0]?.[1] || 1)) * 100}%` }} />
                  </div>
                  <span className="text-gray-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-sm mb-2">Letter Frequency</h3>
            <div className="space-y-1">
              {stats.topChars.map(([char, count]) => (
                <div key={char} className="flex items-center gap-2 text-sm">
                  <span className="text-white w-6 font-mono text-center">{char}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(count / (stats.topChars[0]?.[1] || 1)) * 100}%` }} />
                  </div>
                  <span className="text-gray-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-1">Platform Limits</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <span>Twitter/X: 280 chars ({stats.chars <= 280 ? "OK" : `${stats.chars - 280} over`})</span>
          <span>Instagram: 2,200 chars ({stats.chars <= 2200 ? "OK" : "over"})</span>
          <span>LinkedIn: 3,000 chars ({stats.chars <= 3000 ? "OK" : "over"})</span>
          <span>Meta title: 60 chars ({stats.chars <= 60 ? "OK" : "over"})</span>
        </div>
      </div>
    </div>
  );
}
