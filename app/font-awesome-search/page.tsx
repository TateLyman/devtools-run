"use client";
import { useState } from "react";

const icons: Record<string, string[]> = {
  "arrows": ["←", "→", "↑", "↓", "↔", "↕", "⇐", "⇒", "⇑", "⇓", "⤴", "⤵", "↩", "↪", "⬆", "⬇", "⬅", "➡"],
  "symbols": ["✓", "✗", "✦", "✧", "★", "☆", "♥", "♦", "♣", "♠", "✿", "❀", "✾", "❁", "✽", "❃", "⚙", "⚡"],
  "math": ["±", "×", "÷", "≠", "≈", "≤", "≥", "∞", "π", "Σ", "√", "∫", "∂", "∆", "∇", "∈", "∉", "⊂"],
  "currency": ["$", "€", "£", "¥", "₩", "₹", "₽", "₿", "¢", "₡", "₦", "₪", "₫", "₭", "₮", "₯", "₱", "₲"],
  "music": ["♩", "♪", "♫", "♬", "♭", "♮", "♯", "🎵", "🎶", "🎼", "🎸", "🎹", "🎺", "🎻", "🥁", "🎤"],
  "weather": ["☀", "☁", "☂", "☃", "❄", "⚡", "🌈", "🌤", "⛅", "🌥", "🌦", "🌧", "🌨", "🌩", "🌪", "🌫"],
  "chess": ["♔", "♕", "♖", "♗", "♘", "♙", "♚", "♛", "♜", "♝", "♞", "♟"],
  "zodiac": ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
  "box drawing": ["┌", "┐", "└", "┘", "├", "┤", "┬", "┴", "┼", "─", "│", "═", "║", "╔", "╗", "╚", "╝", "╠", "╣", "╦", "╩"],
  "bullets": ["•", "◦", "▪", "▫", "►", "▻", "◆", "◇", "○", "●", "□", "■", "△", "▲", "▽", "▼", "◁", "◀"],
};

export default function SymbolSearch() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (s: string) => { navigator.clipboard.writeText(s); setCopied(s); setTimeout(() => setCopied(null), 1000); };

  const allSymbols = Object.entries(icons);
  const filtered = search ? allSymbols.map(([cat, syms]) => [cat, syms.filter(() => true)] as [string, string[]]) : allSymbols;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Symbol & Special Characters</h1>
        <p className="text-[var(--text-secondary)]">Browse and copy special characters, symbols, arrows, math symbols, currency, music notes, and more. Click to copy.</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        {filtered.map(([category, symbols]) => (
          <div key={category} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">{category}</h3>
            <div className="flex flex-wrap gap-1">
              {symbols.map((s, i) => (
                <button key={i} onClick={() => copy(s)} className={`w-10 h-10 rounded flex items-center justify-center text-xl hover:bg-purple-600/20 hover:scale-110 transition-all ${copied === s ? "bg-purple-600/30 ring-1 ring-purple-500" : "bg-[var(--bg-primary)]"}`} title={`U+${s.codePointAt(0)?.toString(16).toUpperCase()}`}>{s}</button>
              ))}
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-500 text-center">Click any symbol to copy. Works everywhere — documents, social media, code.</p>
      </div>
    </div>
  );
}
