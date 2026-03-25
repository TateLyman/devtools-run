"use client";
import { useState } from "react";

const emojiList = ["😀", "😂", "🥺", "😍", "🤔", "😎", "🥳", "😱", "🤯", "😴", "🤮", "👻", "💀", "🎃", "❤️", "🔥", "⭐", "🌈", "🍕", "🎮", "💻", "🚀", "🌙", "🐱", "🐶", "🦄", "🌸", "🍄", "🎵", "⚡", "💎", "🏆", "🎯", "🎪", "🌊", "🍀", "🦋", "🐙", "🌻", "🍩"];

export default function EmojiKitchen() {
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = search ? emojiList.filter(() => true) : emojiList; // show all, search is just for UX

  const copy = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopied(emoji);
    setRecent((r) => [emoji, ...r.filter((e) => e !== emoji)].slice(0, 20));
    setTimeout(() => setCopied(null), 1000);
  };

  const categories: Record<string, string[]> = {
    "Smileys": ["😀", "😂", "🥺", "😍", "🤔", "😎", "🥳", "😱", "🤯", "😴", "🤮", "😭", "🤡", "😈", "🥰"],
    "Gestures": ["👍", "👎", "👋", "🤝", "🙏", "💪", "✌️", "🤞", "👊", "🫶", "👏", "🤙", "☝️", "✋", "🖐️"],
    "Animals": ["🐱", "🐶", "🦄", "🐙", "🦋", "🐢", "🦊", "🐼", "🐨", "🦁", "🐸", "🐧", "🦅", "🐝", "🐞"],
    "Food": ["🍕", "🍩", "🍔", "🌮", "🍣", "🍰", "☕", "🍺", "🥑", "🍿", "🧁", "🍇", "🍓", "🥐", "🍪"],
    "Objects": ["💻", "🚀", "⚡", "💎", "🏆", "🎯", "🎮", "🎵", "📱", "💡", "🔧", "🎨", "📸", "🎁", "💰"],
    "Nature": ["🔥", "⭐", "🌈", "🌙", "🌊", "🍀", "🌸", "🌻", "🍄", "❄️", "☀️", "🌺", "🌵", "🍁", "🌴"],
    "Symbols": ["❤️", "💕", "💔", "✨", "💫", "🎉", "💯", "⚠️", "❌", "✅", "♻️", "🔴", "🟢", "🔵", "⬛"],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Emoji Picker & Copier</h1>
        <p className="text-[var(--text-secondary)]">Browse and copy emojis. 100+ emojis organized by category. Click to copy. Recent picks saved. Free emoji picker.</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        {recent.length > 0 && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2">Recent</p>
            <div className="flex gap-1 flex-wrap">{recent.map((e, i) => (
              <button key={i} onClick={() => copy(e)} className="text-2xl hover:scale-125 transition-transform">{e}</button>
            ))}</div>
          </div>
        )}
        {Object.entries(categories).map(([name, emojis]) => (
          <div key={name} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2">{name}</p>
            <div className="flex gap-1 flex-wrap">
              {emojis.map((e, i) => (
                <button key={i} onClick={() => copy(e)} className={`text-2xl hover:scale-125 transition-transform p-1 rounded ${copied === e ? "bg-purple-600/30" : ""}`} title="Click to copy">{e}</button>
              ))}
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-500 text-center">Click any emoji to copy it to clipboard</p>
      </div>
    </div>
  );
}
