"use client";
import { useState } from "react";

const questions = [
  "Never have I ever stayed up all night coding", "Never have I ever sent a text to the wrong person",
  "Never have I ever pretended to understand something I didn't", "Never have I ever eaten food off the floor",
  "Never have I ever lied about my age", "Never have I ever cried during a movie",
  "Never have I ever been caught singing in the shower", "Never have I ever ghosted someone",
  "Never have I ever forgotten someone's name right after being introduced",
  "Never have I ever binged an entire TV series in one day", "Never have I ever talked to myself out loud",
  "Never have I ever used someone else's Netflix account", "Never have I ever pretended to be busy to avoid someone",
  "Never have I ever fallen asleep during a meeting", "Never have I ever broken a promise",
  "Never have I ever laughed at something that wasn't funny", "Never have I ever regifted a present",
  "Never have I ever faked being sick", "Never have I ever accidentally called a teacher 'Mom'",
  "Never have I ever cried happy tears", "Never have I ever procrastinated until the last minute",
  "Never have I ever been scared of the dark", "Never have I ever had a crush on a fictional character",
  "Never have I ever deleted a social media post because it didn't get enough likes",
  "Never have I ever gone to a party just for the food",
];

export default function NeverHaveIEver() {
  const [index, setIndex] = useState(0);
  const [used, setUsed] = useState<Set<number>>(new Set());

  const next = () => {
    const available = questions.map((_, i) => i).filter((i) => !used.has(i) && i !== index);
    if (available.length === 0) { setUsed(new Set()); setIndex(0); return; }
    const pick = available[Math.floor(Math.random() * available.length)];
    setUsed((u) => new Set([...u, index]));
    setIndex(pick);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Never Have I Ever</h1>
        <p className="text-[var(--text-secondary)]">Classic party game. 25 questions. Tap for next. Great for parties, sleepovers, road trips. Free online.</p>
      </div>
      <div className="max-w-md mx-auto space-y-6 text-center">
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/30 rounded-2xl p-10 min-h-[200px] flex items-center justify-center">
          <p className="text-xl font-bold text-white leading-relaxed">{questions[index]}</p>
        </div>
        <button onClick={next} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 rounded-full font-bold text-xl">Next</button>
        <p className="text-xs text-gray-400">{used.size + 1} / {questions.length} questions seen</p>
      </div>
    </div>
  );
}
