import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Solana Development — Free 7-Day Email Course",
  description: "Learn Solana development in 7 days. Daily lessons covering Web3.js, token creation, DEX integration, bot building. Free email course for developers.",
  keywords: ["learn Solana", "Solana development course", "Solana tutorial", "Web3 development", "Solana for beginners", "blockchain development"],
};

export default function LearnSolana() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <section className="text-center">
        <div className="inline-block bg-purple-900/50 text-purple-400 text-xs font-bold px-3 py-1 rounded-full border border-purple-700/50 mb-4">
          FREE 7-DAY COURSE
        </div>
        <h1 className="text-4xl font-bold mb-4">Learn Solana Dev in 7 Days</h1>
        <p className="text-xl text-[var(--text-secondary)]">
          Go from zero to building on Solana. One lesson per day. Practical projects. No fluff.
        </p>
      </section>

      <section className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4 text-center">What You'll Learn</h2>
        <div className="space-y-3">
          {[
            { day: "Day 1", title: "Solana Fundamentals", desc: "Accounts, programs, transactions, SOL, lamports. How Solana is different from Ethereum." },
            { day: "Day 2", title: "Setting Up Your Dev Environment", desc: "Solana CLI, Web3.js, creating wallets, connecting to devnet." },
            { day: "Day 3", title: "Your First Transaction", desc: "Send SOL between wallets. Understand transaction anatomy and signatures." },
            { day: "Day 4", title: "Working with Tokens", desc: "SPL tokens, creating tokens, minting, transferring. Token metadata." },
            { day: "Day 5", title: "DEX Integration", desc: "Jupiter V6 API. Build a swap function. Price quotes and routing." },
            { day: "Day 6", title: "Building a Telegram Bot", desc: "Bot setup, inline keyboards, wallet management, executing trades." },
            { day: "Day 7", title: "Deploying & Monetizing", desc: "Deploy to production, add fees, set up premium tiers, go live." },
          ].map((lesson) => (
            <div key={lesson.day} className="flex gap-4 items-start">
              <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shrink-0">{lesson.day}</span>
              <div>
                <h3 className="font-bold text-white text-sm">{lesson.title}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{lesson.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Start Learning Free</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">Join via Telegram to get daily lessons delivered to your inbox.</p>
        <a href="https://t.me/solscanitbot" target="_blank" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold inline-block">
          Join Course via Telegram
        </a>
        <p className="text-xs text-gray-500 mt-2">DM @solscanitbot with "learn solana"</p>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Who Built This?</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          I'm the developer behind <a href="https://t.me/solscanitbot" className="text-purple-400">@solscanitbot</a> (44-command Solana trading bot) and <a href="/" className="text-purple-400">DevTools.run</a> (320+ free tools). I've been building on Solana for over a year and published 45+ technical articles. This course distills everything I've learned into 7 practical lessons.
        </p>
      </section>
    </div>
  );
}
