"use client";
import { useState } from "react";

const categories: Record<string, { label: string; captions: string[] }> = {
  selfie: { label: "Selfie", captions: [
    "Be yourself, there's no one better ✨", "Confidence level: selfie with no filter 📸",
    "Life isn't perfect but my selfie game is 💅", "Sorry, I was too busy being fabulous",
    "Me, myself, and I 🤳", "Proof that I can look decent sometimes",
    "Current mood: unbothered 😌", "Plot twist: I actually like this photo of me",
  ]},
  travel: { label: "Travel", captions: [
    "Collect moments, not things ✈️", "Take only memories, leave only footprints 🌍",
    "Wanderlust and city dust 🏙️", "Let's find some beautiful place to get lost",
    "Adventure is out there 🗺️", "Not all who wander are lost... but I might be 😅",
    "Jet lag is my cardio ✈️", "Currently accepting travel buddy applications",
  ]},
  food: { label: "Food", captions: [
    "First, let me take a bite 🍕", "Life is short, eat the cake 🎂",
    "You can't make everyone happy, you're not pizza 🍕", "Eating my feelings and they taste great",
    "Food is my love language ❤️", "Sorry for what I said when I was hungry",
    "Diet starts Monday... for the 47th time", "This is what happiness looks like 🍳",
  ]},
  motivational: { label: "Motivational", captions: [
    "The only impossible journey is the one you never begin 🚀", "Your only limit is you 💪",
    "Dream bigger. Do bigger. Be bigger. ⭐", "Every expert was once a beginner",
    "Success is not final, failure is not fatal 🔥", "Be the energy you want to attract ✨",
    "Hard work beats talent when talent doesn't work hard", "Your future self will thank you",
  ]},
  business: { label: "Business", captions: [
    "Building something worth talking about 🏗️", "Hustle until your haters ask if you're hiring 💼",
    "Started from the bottom, still going 📈", "Vision without action is just a daydream",
    "Making moves, not excuses 🎯", "CEO of turning ideas into reality",
    "The grind doesn't stop because you're tired", "Building in public, failing in private",
  ]},
  funny: { label: "Funny", captions: [
    "I'm not lazy, I'm on energy-saving mode 🔋", "Running on caffeine and questionable decisions ☕",
    "My bed is a magical place where I remember everything I forgot to do",
    "Professional overthinker 🧠", "I need a six-month vacation twice a year",
    "If I was a pizza topping, I'd be extra cheese 🧀", "My wallet is like an onion — opening it makes me cry",
    "I put the 'pro' in procrastination",
  ]},
};

export default function CaptionGenerator() {
  const [category, setCategory] = useState("selfie");
  const [copied, setCopied] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Instagram Caption Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Find the perfect Instagram caption. 48 captions across 6 categories: selfie, travel, food, motivational, business, funny. One-tap copy.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {Object.entries(categories).map(([k, v]) => (
          <button key={k} onClick={() => setCategory(k)} className={`px-3 py-1.5 rounded text-xs ${category === k ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{v.label}</button>
        ))}
      </div>

      <div className="max-w-lg mx-auto grid gap-2">
        {categories[category].captions.map((caption, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 flex items-center justify-between gap-3 hover:border-purple-500/30 cursor-pointer" onClick={() => { navigator.clipboard.writeText(caption); setCopied(i); setTimeout(() => setCopied(null), 1500); }}>
            <p className="text-sm text-white">{caption}</p>
            <button className="text-xs text-purple-400 shrink-0">{copied === i ? "✓" : "Copy"}</button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center">Click any caption to copy it instantly</p>
    </div>
  );
}
