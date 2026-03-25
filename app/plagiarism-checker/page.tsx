"use client";
import { useState } from "react";

function checkPlagiarism(text: string): { score: number; sentences: { text: string; unique: boolean }[] } {
  if (!text.trim()) return { score: 100, sentences: [] };

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const results = sentences.map((s) => {
    const trimmed = s.trim();
    const words = trimmed.split(/\s+/);

    // Check for common copied patterns
    const genericPhrases = [
      "according to", "it is important to note", "in conclusion",
      "furthermore", "in addition to", "on the other hand",
      "as a result", "in order to", "due to the fact",
      "it should be noted", "it is worth mentioning",
    ];

    const hasGeneric = genericPhrases.some((p) => trimmed.toLowerCase().includes(p));
    const avgWordLen = words.reduce((s, w) => s + w.length, 0) / words.length;
    const hasLongWords = avgWordLen > 6;
    const isShort = words.length < 5;

    // Heuristic uniqueness score
    const unique = !hasGeneric || isShort || !hasLongWords;

    return { text: trimmed, unique };
  });

  const uniqueCount = results.filter((r) => r.unique).length;
  const score = Math.round((uniqueCount / results.length) * 100);

  return { score, sentences: results };
}

export default function PlagiarismChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof checkPlagiarism> | null>(null);
  const [checking, setChecking] = useState(false);

  const check = () => {
    setChecking(true);
    setTimeout(() => {
      setResult(checkPlagiarism(text));
      setChecking(false);
    }, 1500);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const scoreColor = (s: number) => s >= 80 ? "text-emerald-400" : s >= 50 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Plagiarism Checker</h1>
        <p className="text-[var(--text-secondary)]">
          Check your text for originality. Sentence-by-sentence analysis with uniqueness score. Free plagiarism detection tool.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here to check for plagiarism..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white h-48 resize-none text-sm" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{wordCount} words</span>
          <button onClick={check} disabled={checking || !text.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded font-bold">{checking ? "Checking..." : "Check Plagiarism"}</button>
        </div>

        {result && (
          <>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
              <p className="text-xs text-gray-400 mb-1">Uniqueness Score</p>
              <p className={`text-5xl font-bold ${scoreColor(result.score)}`}>{result.score}%</p>
              <p className={`text-sm ${scoreColor(result.score)}`}>
                {result.score >= 80 ? "Looks original!" : result.score >= 50 ? "Some common phrases detected" : "High similarity to common patterns"}
              </p>
            </div>

            <div className="space-y-1">
              {result.sentences.map((s, i) => (
                <div key={i} className={`text-sm p-2 rounded ${s.unique ? "bg-emerald-500/5 border-l-2 border-emerald-500" : "bg-red-500/5 border-l-2 border-red-500"}`}>
                  <span className={s.unique ? "text-white" : "text-red-300"}>{s.text}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center">
              Note: This is a basic heuristic check. For comprehensive plagiarism detection, use Turnitin or Grammarly.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
