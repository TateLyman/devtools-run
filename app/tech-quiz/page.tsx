"use client";
import { useState } from "react";

const QUESTIONS = [
  { q: "Pick a drink", a: ["Coffee (Node.js)", "Tea (Python)", "Energy drink (Rust)", "Water (Go)"] },
  { q: "Pick a color scheme", a: ["Dark mode only (VS Code)", "Light mode (weird but ok)", "Solarized (Neovim user)", "Whatever IDE picks (JetBrains)"] },
  { q: "How do you deploy?", a: ["git push (Vercel)", "Docker (AWS/GCP)", "FTP (...)", "It works on my machine"] },
  { q: "Tabs or spaces?", a: ["Tabs (rebel)", "2 spaces (React dev)", "4 spaces (Python dev)", "Let prettier decide"] },
  { q: "Weekend project?", a: ["Another todo app", "Trading bot", "CLI tool nobody asked for", "Contributing to open source"] },
];

const RESULTS: Record<number, { title: string; desc: string; stack: string }> = {
  0: { title: "The Speedrunner", desc: "You ship fast and break things. MVP in a weekend.", stack: "Next.js + Tailwind + Supabase + Vercel" },
  1: { title: "The Architect", desc: "You plan everything before writing a line of code.", stack: "TypeScript + PostgreSQL + Docker + AWS" },
  2: { title: "The Minimalist", desc: "Less is more. You write code that lasts.", stack: "Go + SQLite + HTML + Cloudflare" },
  3: { title: "The Full-Stack Warrior", desc: "You do it all and complain about none of it.", stack: "React + Node.js + MongoDB + Railway" },
};

export default function TechQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = step >= QUESTIONS.length;
  const resultIdx = done ? (answers.reduce((a,b)=>a+b,0) % 4) : 0;
  const result = RESULTS[resultIdx];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold mb-2">What Developer Are You?</h1>
        <p className="text-gray-400 mb-8">Take the quiz. Share your result.</p>
        {!done ? (
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="text-xs text-gray-400 mb-2">{step+1}/{QUESTIONS.length}</div>
            <h2 className="text-xl font-bold mb-6">{QUESTIONS[step].q}</h2>
            <div className="space-y-3">
              {QUESTIONS[step].a.map((a, i) => (
                <button key={i} onClick={()=>{setAnswers([...answers,i]);setStep(step+1);}} className="w-full bg-gray-800 hover:bg-purple-600 py-3 rounded-xl font-bold text-sm transition-colors">{a}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="text-5xl mb-4">🧑‍💻</div>
            <h2 className="text-2xl font-extrabold mb-2">{result.title}</h2>
            <p className="text-gray-400 mb-4">{result.desc}</p>
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-400 mb-1">Your ideal stack:</div>
              <div className="text-sm text-purple-400 font-bold">{result.stack}</div>
            </div>
            <button onClick={()=>{setStep(0);setAnswers([]);}} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold">Retake</button>
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/stack-picker" className="text-purple-400 hover:underline">Stack Picker</a>{" | "}
          <a href="/project-ideas" className="text-purple-400 hover:underline">Project Ideas</a>{" | "}
          <a href="/typing-test" className="text-purple-400 hover:underline">Typing Test</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
