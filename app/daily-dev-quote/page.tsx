"use client";
import { useState, useEffect } from "react";

const quotes = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", category: "motivation" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", category: "coding" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "coding" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", category: "coding" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "design" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck", category: "coding" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "coding" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
  { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupery", category: "design" },
  { text: "It's not a bug; it's an undocumented feature.", author: "Anonymous", category: "humor" },
  { text: "One of my most productive days was throwing away 1,000 lines of code.", author: "Ken Thompson", category: "coding" },
  { text: "The function of good software is to make the complex appear simple.", author: "Grady Booch", category: "design" },
  { text: "There are only two hard things in CS: cache invalidation and naming things.", author: "Phil Karlton", category: "humor" },
  { text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.", author: "Mark Zuckerberg", category: "startup" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "motivation" },
  { text: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay", category: "coding" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson", category: "coding" },
  { text: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", author: "Bill Gates", category: "coding" },
  { text: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard", category: "humor" },
  { text: "If debugging is the process of removing bugs, then programming must be the process of putting them in.", author: "Edsger Dijkstra", category: "humor" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs", category: "design" },
  { text: "A good programmer is someone who always looks both ways before crossing a one-way street.", author: "Doug Linder", category: "humor" },
  { text: "Deleted code is debugged code.", author: "Jeff Sickel", category: "coding" },
  { text: "Java is to JavaScript what car is to carpet.", author: "Chris Heilmann", category: "humor" },
  { text: "Before software can be reusable, it first has to be usable.", author: "Ralph Johnson", category: "design" },
  { text: "Software is like sex: it's better when it's free.", author: "Linus Torvalds", category: "humor" },
  { text: "In theory, theory and practice are the same. In practice, they're not.", author: "Yogi Berra", category: "humor" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "motivation" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates", category: "startup" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg", category: "startup" },
];

export default function DailyDevQuote() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Daily quote based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setQuoteIndex(dayOfYear % quotes.length);
  }, []);

  const filteredQuotes = filter === "all" ? quotes : quotes.filter((q) => q.category === filter);
  const todaysQuote = quotes[quoteIndex];

  const shareText = (q: typeof todaysQuote) => `"${q.text}" — ${q.author}\n\nvia DevTools.run`;

  const copy = (q: typeof todaysQuote) => {
    navigator.clipboard.writeText(shareText(q));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const random = () => {
    const pool = filter === "all" ? quotes : filteredQuotes;
    setQuoteIndex(quotes.indexOf(pool[Math.floor(Math.random() * pool.length)]));
  };

  const categories = ["all", ...new Set(quotes.map((q) => q.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Daily Developer Quote</h1>
        <p className="text-[var(--text-secondary)]">
          A curated developer quote every day. 30 quotes from legends like Linus Torvalds, Steve Jobs, Martin Fowler. Share or save your favorites.
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-8 text-center">
        <blockquote className="text-2xl sm:text-3xl font-bold text-white leading-relaxed mb-4">
          "{todaysQuote.text}"
        </blockquote>
        <p className="text-purple-400 text-lg">— {todaysQuote.author}</p>
        <div className="mt-4 flex gap-2 justify-center">
          <button onClick={() => copy(todaysQuote)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-bold">{copied ? "Copied!" : "Copy"}</button>
          <button onClick={random} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">Random</button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1 rounded text-xs capitalize ${filter === c ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>{c}</button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filteredQuotes.map((q, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 hover:border-purple-500/30 transition-colors cursor-pointer" onClick={() => copy(q)}>
            <p className="text-sm text-white mb-2">"{q.text}"</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-400">— {q.author}</span>
              <span className="text-xs text-gray-500 capitalize">{q.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
