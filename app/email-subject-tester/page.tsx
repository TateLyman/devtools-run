"use client";
import { useState, useMemo } from "react";

function analyzeSubject(subject: string): { score: number; tips: string[]; checks: { name: string; pass: boolean; detail: string }[] } {
  const checks: { name: string; pass: boolean; detail: string }[] = [];
  const tips: string[] = [];
  let score = 50;

  // Length
  const len = subject.length;
  const goodLength = len >= 30 && len <= 60;
  checks.push({ name: "Length", pass: goodLength, detail: `${len} chars (${goodLength ? "optimal 30-60" : len < 30 ? "too short" : "too long"})` });
  if (goodLength) score += 10; else if (len < 20 || len > 80) score -= 10;

  // Word count
  const words = subject.trim().split(/\s+/).length;
  const goodWords = words >= 4 && words <= 10;
  checks.push({ name: "Word Count", pass: goodWords, detail: `${words} words (${goodWords ? "good" : words < 4 ? "add more detail" : "simplify"})` });
  if (goodWords) score += 5;

  // Emoji
  const hasEmoji = /[\p{Emoji_Presentation}]/u.test(subject);
  checks.push({ name: "Emoji", pass: hasEmoji, detail: hasEmoji ? "Yes — increases open rate by 15%" : "None — consider adding one" });
  if (hasEmoji) score += 5;

  // Numbers
  const hasNumbers = /\d/.test(subject);
  checks.push({ name: "Numbers", pass: hasNumbers, detail: hasNumbers ? "Yes — numbers boost clicks" : "None — adding a number can increase opens" });
  if (hasNumbers) score += 8;

  // Power words
  const powerWords = ["free", "new", "exclusive", "limited", "urgent", "breaking", "secret", "proven", "instant", "easy", "best", "top", "hack", "mistake", "warning", "last chance", "don't miss", "you", "your"];
  const found = powerWords.filter((w) => subject.toLowerCase().includes(w));
  checks.push({ name: "Power Words", pass: found.length > 0, detail: found.length > 0 ? `Found: ${found.join(", ")}` : "None — add urgency or curiosity words" });
  if (found.length > 0) score += 10;

  // Personalization
  const hasPersonal = /\byou\b|\byour\b/i.test(subject);
  checks.push({ name: "Personalization", pass: hasPersonal, detail: hasPersonal ? '"You/Your" found — personal touch' : 'Consider adding "you" or "your"' });
  if (hasPersonal) score += 5;

  // ALL CAPS
  const hasAllCaps = /[A-Z]{4,}/.test(subject);
  checks.push({ name: "No ALL CAPS", pass: !hasAllCaps, detail: hasAllCaps ? "ALL CAPS detected — looks spammy" : "Clean — no spam triggers" });
  if (hasAllCaps) score -= 15;

  // Spam words
  const spamWords = ["buy now", "click here", "act now", "limited time", "100% free", "no cost", "winner", "congratulations", "earn money", "make money fast"];
  const spamFound = spamWords.filter((w) => subject.toLowerCase().includes(w));
  checks.push({ name: "Spam Check", pass: spamFound.length === 0, detail: spamFound.length > 0 ? `Spam triggers: ${spamFound.join(", ")}` : "Clean — no spam triggers" });
  if (spamFound.length > 0) score -= 20;

  // Question
  const isQuestion = subject.includes("?");
  checks.push({ name: "Question Format", pass: isQuestion, detail: isQuestion ? "Questions increase curiosity" : "Try asking a question for higher opens" });
  if (isQuestion) score += 5;

  score = Math.max(0, Math.min(100, score));

  return { score, tips, checks };
}

export default function EmailSubjectTester() {
  const [subject, setSubject] = useState("");

  const analysis = useMemo(() => subject.trim() ? analyzeSubject(subject) : null, [subject]);
  const scoreColor = (s: number) => s >= 70 ? "text-emerald-400" : s >= 40 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Email Subject Line Tester</h1>
        <p className="text-[var(--text-secondary)]">
          Test your email subject line before sending. Get a score with length, power words, spam check, personalization, and more.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Type your email subject line..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white text-lg" autoFocus />

        {analysis && (
          <>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
              <p className="text-xs text-gray-400 mb-1">Subject Line Score</p>
              <p className={`text-5xl font-bold ${scoreColor(analysis.score)}`}>{analysis.score}</p>
              <p className={`text-sm ${scoreColor(analysis.score)}`}>{analysis.score >= 70 ? "Great subject line!" : analysis.score >= 40 ? "Room for improvement" : "Needs work"}</p>
            </div>

            <div className="space-y-1">
              {analysis.checks.map((c, i) => (
                <div key={i} className={`flex items-center justify-between text-sm p-2 rounded ${c.pass ? "bg-emerald-500/5" : "bg-red-500/5"}`}>
                  <div className="flex items-center gap-2">
                    <span className={c.pass ? "text-emerald-400" : "text-red-400"}>{c.pass ? "✓" : "✗"}</span>
                    <span className="text-white">{c.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{c.detail}</span>
                </div>
              ))}
            </div>

            {/* Inbox preview */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Y</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">Your Brand</span>
                    <span className="text-xs text-gray-400">Now</span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium truncate">{subject}</p>
                  <p className="text-xs text-gray-500 truncate">Preview text of your email goes here...</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
