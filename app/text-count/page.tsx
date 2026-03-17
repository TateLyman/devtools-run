"use client";

import { useState, useMemo } from "react";

import AdSlot from "../components/AdSlot";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeMin: number;
}

function analyzeText(text: string): TextStats {
  if (!text.trim()) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTimeMin: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const sentences = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0).length;

  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;

  const lines = text.split("\n").length;

  // Average reading speed: 200-250 words per minute
  const readingTimeMin = words / 225;

  return { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTimeMin };
}

function getCommonWords(text: string, limit: number = 10): { word: string; count: number }[] {
  if (!text.trim()) return [];

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    const seconds = Math.ceil(minutes * 60);
    return `${seconds} sec`;
  }
  if (minutes < 60) {
    return `${Math.ceil(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.ceil(minutes % 60);
  return `${hours}h ${mins}m`;
}

export default function TextCountPage() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => analyzeText(input), [input]);
  const commonWords = useMemo(() => getCommonWords(input), [input]);

  const statCards = [
    { label: "Characters", value: stats.characters.toLocaleString() },
    { label: "Chars (no spaces)", value: stats.charactersNoSpaces.toLocaleString() },
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Lines", value: stats.lines.toLocaleString() },
    { label: "Reading Time", value: formatReadingTime(stats.readingTimeMin) },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Text Character / Word Counter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Get real-time character, word, sentence, and paragraph counts. Plus reading time and most common words.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Enter Text</label>
        <textarea
          rows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here..."
          spellCheck={false}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-3 text-center"
          >
            <div className="text-lg font-mono font-bold text-white">{stat.value}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {commonWords.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium mb-3">Most Common Words</label>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left px-4 py-2 text-[var(--text-secondary)] font-medium">#</th>
                  <th className="text-left px-4 py-2 text-[var(--text-secondary)] font-medium">Word</th>
                  <th className="text-right px-4 py-2 text-[var(--text-secondary)] font-medium">Count</th>
                  <th className="text-right px-4 py-2 text-[var(--text-secondary)] font-medium">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {commonWords.map((item, i) => (
                  <tr key={item.word} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-2 text-[var(--text-secondary)]">{i + 1}</td>
                    <td className="px-4 py-2 font-mono text-white">{item.word}</td>
                    <td className="px-4 py-2 text-right font-mono">{item.count}</td>
                    <td className="px-4 py-2 text-right text-[var(--text-secondary)]">
                      {stats.words > 0 ? ((item.count / stats.words) * 100).toFixed(1) + "%" : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Text Counter
        </h2>
        <p>
          This tool counts characters, words, sentences, paragraphs, and lines in your text in
          real time. It also estimates reading time based on an average reading speed of 225 words
          per minute and shows the most frequently used words with their percentage frequency.
        </p>
      </section>
    </>
  );
}
