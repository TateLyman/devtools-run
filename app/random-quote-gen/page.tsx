"use client";
import { useState } from "react";
const QUOTES = [
  ["The only way to do great work is to love what you do.", "Steve Jobs"],
  ["Innovation distinguishes between a leader and a follower.", "Steve Jobs"],
  ["Stay hungry, stay foolish.", "Steve Jobs"],
  ["Life is what happens when you're busy making other plans.", "John Lennon"],
  ["The future belongs to those who believe in the beauty of their dreams.", "Eleanor Roosevelt"],
  ["It is during our darkest moments that we must focus to see the light.", "Aristotle"],
  ["The only impossible journey is the one you never begin.", "Tony Robbins"],
  ["Success is not final, failure is not fatal: it is the courage to continue that counts.", "Winston Churchill"],
  ["Believe you can and you're halfway there.", "Theodore Roosevelt"],
  ["In the middle of difficulty lies opportunity.", "Albert Einstein"],
  ["The best time to plant a tree was 20 years ago. The second best time is now.", "Chinese Proverb"],
  ["Your time is limited, don't waste it living someone else's life.", "Steve Jobs"],
  ["The only limit to our realization of tomorrow is our doubts of today.", "Franklin D. Roosevelt"],
  ["Do what you can, with what you have, where you are.", "Theodore Roosevelt"],
  ["Everything you've ever wanted is on the other side of fear.", "George Addair"],
  ["Strive not to be a success, but rather to be of value.", "Albert Einstein"],
  ["The mind is everything. What you think you become.", "Buddha"],
  ["An unexamined life is not worth living.", "Socrates"],
  ["Turn your wounds into wisdom.", "Oprah Winfrey"],
  ["The way to get started is to quit talking and begin doing.", "Walt Disney"],
];
export default function RandomQuote() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx(Math.floor(Math.random() * QUOTES.length));
  const [quote, author] = QUOTES[idx];
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Random Quote</h1></section>
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-12 text-center">
        <blockquote className="text-2xl md:text-3xl font-bold italic leading-relaxed">"{quote}"</blockquote>
        <p className="text-[var(--text-secondary)] mt-4 text-lg">— {author}</p>
      </div>
      <div className="flex justify-center gap-3">
        <button onClick={next} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold">New Quote</button>
        <button onClick={() => navigator.clipboard.writeText(`"${quote}" — ${author}`)} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-6 py-3 rounded-lg font-bold">Copy</button>
      </div>
    </div>
  );
}
