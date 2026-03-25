"use client";
import { useState } from "react";

export default function Flashcard() {
  const [cards, setCards] = useState<{ front: string; back: string }[]>([
    { front: "What is HTML?", back: "HyperText Markup Language — the standard markup language for web pages" },
    { front: "What is CSS?", back: "Cascading Style Sheets — used to style and layout web pages" },
    { front: "What is JavaScript?", back: "A programming language that enables interactive web pages" },
  ]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

  const addCard = () => {
    if (newFront.trim() && newBack.trim()) {
      setCards([...cards, { front: newFront.trim(), back: newBack.trim() }]);
      setNewFront(""); setNewBack("");
    }
  };

  const next = () => { setIndex((i) => (i + 1) % cards.length); setFlipped(false); };
  const prev = () => { setIndex((i) => (i - 1 + cards.length) % cards.length); setFlipped(false); };
  const shuffle = () => { setCards([...cards].sort(() => Math.random() - 0.5)); setIndex(0); setFlipped(false); };

  if (cards.length === 0) return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold mb-4">Flashcard Maker</h1>
      <p className="text-gray-400 mb-4">Add your first flashcard below</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Flashcard Maker & Study Tool</h1>
        <p className="text-[var(--text-secondary)]">Create and study flashcards. Add your own questions. Flip to reveal answers. Shuffle for random order. Free study tool.</p>
      </div>
      <div className="max-w-md mx-auto space-y-4 text-center">
        <p className="text-xs text-gray-400">{index + 1} / {cards.length}</p>
        <div onClick={() => setFlipped(!flipped)} className="bg-[var(--bg-secondary)] border-2 border-[var(--border)] rounded-2xl p-10 min-h-[200px] flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all" style={{ perspective: "1000px" }}>
          <div className={`text-center transition-all duration-300 ${flipped ? "scale-y-[-1]" : ""}`} style={{ transformStyle: "preserve-3d" }}>
            <p className="text-xs text-gray-500 mb-2">{flipped ? "Answer" : "Question"}</p>
            <p className="text-xl font-bold text-white">{flipped ? cards[index].back : cards[index].front}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">Click card to flip</p>
        <div className="flex gap-3 justify-center">
          <button onClick={prev} className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg">← Prev</button>
          <button onClick={() => setFlipped(!flipped)} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold">Flip</button>
          <button onClick={next} className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg">Next →</button>
        </div>
        <button onClick={shuffle} className="text-xs text-purple-400 hover:text-purple-300">Shuffle Cards</button>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-left space-y-2">
          <h3 className="text-sm font-bold">Add Card</h3>
          <input value={newFront} onChange={(e) => setNewFront(e.target.value)} placeholder="Question / Front" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          <input value={newBack} onChange={(e) => setNewBack(e.target.value)} placeholder="Answer / Back" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" onKeyDown={(e) => e.key === "Enter" && addCard()} />
          <button onClick={addCard} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-sm font-bold w-full">Add Card</button>
        </div>
      </div>
    </div>
  );
}
