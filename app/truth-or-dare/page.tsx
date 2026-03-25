"use client";
import { useState } from "react";

const truths = [
  "What's the most embarrassing thing you've done?", "What's your biggest fear?", "What's the last lie you told?",
  "What's your guilty pleasure?", "Who was your first crush?", "What's the worst advice you've ever given?",
  "What's the most childish thing you still do?", "Have you ever pretended to be sick to skip something?",
  "What's a secret you've never told anyone?", "What's the most awkward text you've sent to the wrong person?",
  "What's the weirdest thing you've Googled?", "What's the longest you've gone without showering?",
  "What's your most unpopular opinion?", "Have you ever cheated on a test?",
  "What's the most expensive thing you've broken?", "What's the worst gift you've ever received?",
  "Who do you secretly find annoying?", "What's the most embarrassing song on your playlist?",
  "Have you ever blamed someone else for something you did?", "What's your biggest regret?",
];

const dares = [
  "Text your crush right now", "Do 20 push-ups", "Speak in an accent for the next 3 rounds",
  "Let someone post on your social media", "Eat a spoonful of something spicy",
  "Do your best impression of someone in the room", "Call a random number and sing happy birthday",
  "Let someone go through your phone for 30 seconds", "Do a TikTok dance",
  "Post an embarrassing selfie to your story", "Talk in a baby voice for 2 minutes",
  "Let someone draw on your face", "Do the worm across the room",
  "Send a heart emoji to your 5th most recent contact", "Wear your shirt inside out for the rest of the game",
  "Let someone style your hair however they want", "Do a dramatic reading of your last text",
  "Hold a plank for 1 minute", "Speak only in questions for the next 3 rounds",
  "Let the group make your profile picture for 24 hours",
];

export default function TruthOrDare() {
  const [mode, setMode] = useState<"truth" | "dare" | null>(null);
  const [current, setCurrent] = useState("");
  const [used, setUsed] = useState<Set<string>>(new Set());

  const pick = (type: "truth" | "dare") => {
    setMode(type);
    const pool = (type === "truth" ? truths : dares).filter((q) => !used.has(q));
    if (pool.length === 0) { setUsed(new Set()); setCurrent((type === "truth" ? truths : dares)[Math.floor(Math.random() * (type === "truth" ? truths : dares).length)]); return; }
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(picked);
    setUsed((u) => new Set([...u, picked]));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Truth or Dare</h1>
        <p className="text-[var(--text-secondary)]">Classic party game. 20 truths and 20 dares. Perfect for parties, sleepovers, and game nights. Free online.</p>
      </div>
      <div className="max-w-md mx-auto space-y-6 text-center">
        {current && (
          <div className={`rounded-xl p-8 ${mode === "truth" ? "bg-blue-600/10 border-2 border-blue-500" : "bg-red-600/10 border-2 border-red-500"}`}>
            <p className={`text-xs font-bold uppercase ${mode === "truth" ? "text-blue-400" : "text-red-400"}`}>{mode}</p>
            <p className="text-xl font-bold text-white mt-3">{current}</p>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <button onClick={() => pick("truth")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-xl font-bold text-xl">Truth</button>
          <button onClick={() => pick("dare")} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-5 rounded-xl font-bold text-xl">Dare</button>
        </div>
        <p className="text-xs text-gray-400">{used.size} / {truths.length + dares.length} used</p>
        {used.size > 0 && <button onClick={() => { setUsed(new Set()); setCurrent(""); setMode(null); }} className="text-xs text-gray-500 hover:text-white">Reset Game</button>}
      </div>
    </div>
  );
}
