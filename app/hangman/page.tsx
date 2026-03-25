"use client";
import { useState } from "react";

const words = ["javascript","typescript","python","react","nextjs","vercel","github","docker","kubernetes","algorithm","database","frontend","backend","fullstack","developer","function","variable","component","interface","deployment","framework","library","terminal","compiler","debugging","recursion","middleware","bootstrap","tailwind","webpack","mongodb","postgres","graphql","restapi","serverless"];

export default function Hangman() {
  const [word, setWord] = useState(() => words[Math.floor(Math.random() * words.length)]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const maxWrong = 6;

  const display = word.split("").map((c) => guessed.has(c) ? c : "_").join(" ");
  const won = word.split("").every((c) => guessed.has(c));
  const lost = wrong >= maxWrong;
  const gameOver = won || lost;

  const guess = (letter: string) => {
    if (gameOver || guessed.has(letter)) return;
    const ng = new Set(guessed);
    ng.add(letter);
    setGuessed(ng);
    if (!word.includes(letter)) setWrong((w) => w + 1);
  };

  const reset = () => { setWord(words[Math.floor(Math.random() * words.length)]); setGuessed(new Set()); setWrong(0); };

  const hangmanParts = ["O", "/", "|", "\\", "/", "\\"];
  const body = hangmanParts.slice(0, wrong);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Hangman</h1>
        <p className="text-[var(--text-secondary)]">Guess the programming word. 6 wrong guesses allowed. Developer-themed words. Free online hangman.</p>
      </div>
      <div className="max-w-md mx-auto space-y-4 text-center">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 font-mono">
          <pre className="text-white text-sm leading-relaxed">{`
  ┌───┐
  │   ${wrong > 0 ? body[0] : " "}
  │  ${wrong > 1 ? body[1] : " "}${wrong > 2 ? body[2] : " "}${wrong > 3 ? body[3] : " "}
  │  ${wrong > 4 ? body[4] : " "} ${wrong > 5 ? body[5] : " "}
  │
──┴──`}</pre>
        </div>
        <p className="text-3xl font-mono font-bold tracking-[0.3em] text-white">{display}</p>
        <p className="text-xs text-gray-400">{word.length} letters · {maxWrong - wrong} guesses left</p>
        {won && <p className="text-xl font-bold text-emerald-400">You won! The word was "{word}" 🎉</p>}
        {lost && <p className="text-xl font-bold text-red-400">Game over! The word was "{word}" 💀</p>}
        <div className="flex flex-wrap gap-1 justify-center">
          {"abcdefghijklmnopqrstuvwxyz".split("").map((l) => (
            <button key={l} onClick={() => guess(l)} disabled={gameOver || guessed.has(l)} className={`w-9 h-9 rounded font-bold text-sm ${guessed.has(l) ? (word.includes(l) ? "bg-emerald-600 text-white" : "bg-red-600/30 text-red-400") : "bg-[var(--bg-secondary)] border border-[var(--border)] text-white hover:border-purple-500"} disabled:opacity-50`}>{l}</button>
          ))}
        </div>
        {gameOver && <button onClick={reset} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold">New Game</button>}
      </div>
    </div>
  );
}
