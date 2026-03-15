"use client";

import { useState } from "react";
import Link from "next/link";

const WALLET = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const TELEGRAM = "@Krbva";

const services = [
  {
    title: "Custom Telegram Bot Development",
    price: "$500 - $2,000",
    solNote: "or equivalent in SOL",
    color: "blue",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    description: "Trading bots, community bots, notification bots, moderation bots -- any Telegram bot you need, built from scratch.",
    proof: "I built @solscanitbot -- 4,500+ lines, 44 commands, 12 background workers, 7 revenue streams. I can build yours.",
    bullets: [
      "Solana trading bots with Jupiter/Raydium integration",
      "Community management & moderation bots",
      "Price alerts & whale monitoring bots",
      "Custom commands, inline keyboards, webhook support",
      "Deployment docs & ongoing support included",
    ],
  },
  {
    title: "Solana Smart Contract & DeFi Development",
    price: "$300 - $1,500",
    solNote: "or equivalent in SOL",
    color: "purple",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    description: "Token launches, swap integrations, wallet monitoring, and on-chain automation on Solana.",
    proof: "Direct experience with Jupiter V6 aggregator, Pump.fun bonding curves, Jito MEV bundles, and Helius RPC.",
    bullets: [
      "Token launch & deployment (SPL tokens)",
      "Jupiter / Raydium / Pump.fun swap integrations",
      "Wallet monitoring & transaction parsing",
      "On-chain payment verification systems",
      "DeFi automation scripts & tooling",
    ],
  },
  {
    title: "Web Development",
    price: "$200 - $800",
    solNote: "or equivalent in SOL",
    color: "green",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558" />
      </svg>
    ),
    description: "Next.js sites, developer tools, dashboards, and landing pages. Fast, modern, deployed on Vercel.",
    proof: "Built devtools.run with 22+ tools, zero backend, auto-deployed via Vercel. You're looking at it.",
    bullets: [
      "Next.js / React / Tailwind CSS sites",
      "Developer tool dashboards",
      "Landing pages & product sites",
      "Solana wallet integration (payments, verification)",
      "SEO optimization & Vercel deployment",
    ],
  },
  {
    title: "Bot White-Labeling",
    price: "5 SOL",
    solNote: "flat rate",
    color: "yellow",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
      </svg>
    ),
    description: "Get your own branded version of @solscanitbot. Your fee wallet, your branding, your users.",
    proof: "Deploy in 30 minutes. All 7 revenue streams included. Start earning from day one.",
    bullets: [
      "Full @solscanitbot codebase, rebranded for you",
      "Your Solana fee wallet receives all revenue",
      "Custom bot name, welcome messages, branding",
      "All 44 commands & 12 workers pre-configured",
      "Deployment walkthrough & VPS setup assistance",
    ],
  },
  {
    title: "Solana Trading Consultation",
    price: "0.5 SOL / hour",
    solNote: "live session",
    color: "cyan",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    description: "1-on-1 consultation on grid trading strategy, bot setup, DeFi optimization, and Solana tooling.",
    proof: "Hands-on experience building and running trading infrastructure. Practical advice, not theory.",
    bullets: [
      "Grid trading strategy & parameter tuning",
      "Bot deployment & configuration",
      "DeFi yield optimization",
      "Risk management & position sizing",
      "Custom automation planning",
    ],
  },
];

const colorMap: Record<string, { border: string; text: string; bg: string; badge: string }> = {
  blue: { border: "border-blue-800/50", text: "text-blue-400", bg: "bg-blue-600", badge: "bg-blue-900/40 text-blue-300" },
  purple: { border: "border-purple-800/50", text: "text-purple-400", bg: "bg-purple-600", badge: "bg-purple-900/40 text-purple-300" },
  green: { border: "border-green-800/50", text: "text-green-400", bg: "bg-green-600", badge: "bg-green-900/40 text-green-300" },
  yellow: { border: "border-yellow-800/50", text: "text-yellow-400", bg: "bg-yellow-600", badge: "bg-yellow-900/40 text-yellow-300" },
  cyan: { border: "border-cyan-800/50", text: "text-cyan-400", bg: "bg-cyan-600", badge: "bg-cyan-900/40 text-cyan-300" },
};

export default function ServicesPage() {
  const [copied, setCopied] = useState(false);

  function copyWallet() {
    navigator.clipboard.writeText(WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Development Services
          </h1>
          <p className="text-xl text-gray-400 mb-3 max-w-2xl mx-auto">
            Solana bots, DeFi integrations, web apps -- built by the developer behind{" "}
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              @solscanitbot
            </a>{" "}
            and{" "}
            <Link href="/" className="text-blue-400 hover:underline">
              devtools.run
            </Link>
            .
          </p>
          <p className="text-gray-500">
            Pay in SOL or USD. Fast turnaround. Production-quality code.
          </p>
        </div>

        {/* Services */}
        <div className="space-y-8 mb-16">
          {services.map((svc, i) => {
            const c = colorMap[svc.color];
            return (
              <div
                key={i}
                className={`bg-gray-900 rounded-xl border ${c.border} overflow-hidden`}
              >
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${c.text} flex-shrink-0 mt-1`}>{svc.icon}</div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h2 className="text-2xl font-bold">{svc.title}</h2>
                        <span className={`${c.badge} px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap w-fit`}>
                          {svc.price}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-3">
                        {svc.solNote}
                      </p>
                      <p className="text-gray-300 mb-3">{svc.description}</p>
                      <p className={`${c.text} text-sm italic mb-4`}>
                        &quot;{svc.proof}&quot;
                      </p>
                      <ul className="space-y-1.5">
                        {svc.bullets.map((b, j) => (
                          <li key={j} className="text-gray-400 text-sm flex items-start gap-2">
                            <span className={`${c.text} mt-0.5 flex-shrink-0`}>&#10003;</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold mb-1">Reach Out</h3>
              <p className="text-gray-400 text-sm">
                Message me on Telegram with your project details and requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold mb-1">Get a Quote</h3>
              <p className="text-gray-400 text-sm">
                I&apos;ll scope the work and give you a fixed price. No surprises.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold mb-1">Ship It</h3>
              <p className="text-gray-400 text-sm">
                Pay 50% upfront, 50% on delivery. SOL or USD. Code delivered with docs.
              </p>
            </div>
          </div>
        </div>

        {/* Contact / CTA */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 mb-12 border border-blue-800/30">
          <h2 className="text-2xl font-bold mb-6 text-center">Get in Touch</h2>
          <div className="flex flex-col items-center gap-4">
            <a
              href={`https://t.me/${TELEGRAM.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Message {TELEGRAM} on Telegram
            </a>
            <p className="text-gray-400 text-sm text-center">
              Describe your project and I&apos;ll respond within 24 hours.
            </p>

            <div className="w-full max-w-lg mt-4">
              <p className="text-gray-500 text-xs uppercase tracking-wide text-center mb-2">
                SOL Payment Address
              </p>
              <div
                onClick={copyWallet}
                className="bg-gray-800 rounded-lg p-3 font-mono text-sm text-center break-all select-all border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors"
              >
                {WALLET}
              </div>
              <p className="text-gray-600 text-xs text-center mt-1">
                {copied ? "Copied!" : "Click to copy"}
              </p>
            </div>
          </div>
        </div>

        {/* Cross-links to products */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-400">
            Or grab a ready-made product
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/sol-bot-source"
              className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-blue-800/50 transition-colors block"
            >
              <h3 className="font-bold text-blue-400 mb-1">Solana Bot Source Code</h3>
              <p className="text-gray-400 text-sm mb-2">
                Full source of @solscanitbot. 4,500+ lines, 44 commands, 7 revenue streams.
              </p>
              <span className="text-blue-400 text-sm font-semibold">2 SOL &rarr;</span>
            </Link>
            <Link
              href="/sol-grid-bot"
              className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-green-800/50 transition-colors block"
            >
              <h3 className="font-bold text-green-400 mb-1">SOL Grid Trading Bot</h3>
              <p className="text-gray-400 text-sm mb-2">
                Automated grid trading on Jupiter DEX. Python. Backtested +11.7%.
              </p>
              <span className="text-green-400 text-sm font-semibold">0.5 SOL &rarr;</span>
            </Link>
            <Link
              href="/sol-defi-toolkit"
              className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-purple-800/50 transition-colors block"
            >
              <h3 className="font-bold text-purple-400 mb-1">Solana DeFi Toolkit</h3>
              <p className="text-gray-400 text-sm mb-2">
                10 Node.js scripts for swaps, sniping, monitoring, and more.
              </p>
              <span className="text-purple-400 text-sm font-semibold">0.3 SOL &rarr;</span>
            </Link>
            <Link
              href="/prompt-pack"
              className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-yellow-800/50 transition-colors block"
            >
              <h3 className="font-bold text-yellow-400 mb-1">AI Prompt Pack</h3>
              <p className="text-gray-400 text-sm mb-2">
                50+ battle-tested prompts for coding, trading, and automation.
              </p>
              <span className="text-yellow-400 text-sm font-semibold">0.1 SOL &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Want something not listed? Message me. If I can build it, I will.
          </p>
        </div>
      </div>
    </div>
  );
}
