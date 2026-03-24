"use client";

import { useState, useEffect } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";

const PLANS = [
  {
    name: "Starter",
    price: "0.2 SOL/month",
    priceSol: 0.2,
    features: [
      "Auto-snipe new pump.fun launches",
      "Safety score filter (min 40/100)",
      "3 snipes per hour",
      "0.1 SOL per snipe",
      "Telegram alerts on every buy",
    ],
  },
  {
    name: "Pro",
    price: "1 SOL/month",
    priceSol: 1,
    popular: true,
    features: [
      "Unlimited snipes per hour",
      "Configurable safety threshold",
      "Configurable buy amount (0.01-5 SOL)",
      "Jito MEV protection on every trade",
      "Auto-sell on 2x (configurable)",
      "Copy trading (follow any wallet)",
      "Priority execution",
      "Telegram + webhook alerts",
    ],
  },
  {
    name: "Whale",
    price: "5 SOL/month",
    priceSol: 5,
    features: [
      "Everything in Pro",
      "Up to 50 SOL per snipe",
      "Multi-wallet support (3 wallets)",
      "Custom token filters (MC, liquidity, age)",
      "Dedicated Helius RPC endpoint",
      "Direct support channel",
      "Early access to new features",
    ],
  },
];

export default function SniperPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-sm font-semibold text-purple-400 mb-3 tracking-widest uppercase">
            Solana Sniper Service
          </div>
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Auto-Snipe New Tokens 24/7
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We run the sniper for you. Set your criteria, fund your wallet, and
            the service automatically buys qualifying new launches with MEV
            protection. You sleep, it trades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 border ${
                plan.popular
                  ? "border-purple-500 bg-gray-900 ring-2 ring-purple-500/20"
                  : "border-gray-800 bg-gray-900"
              }`}
            >
              {plan.popular && (
                <div className="text-xs font-bold text-purple-400 uppercase mb-2">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="text-3xl font-extrabold mt-2 mb-4">
                {plan.price}
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">&#x2713;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={`https://t.me/solscanitbot?start=sniper_${plan.name.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-center py-3 rounded-xl font-bold transition-colors ${
                  plan.popular
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                Subscribe on Telegram
              </a>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Subscribe",
                desc: "Choose a plan and pay with SOL through our Telegram bot",
              },
              {
                step: "2",
                title: "Configure",
                desc: "Set your safety threshold, buy amount, and auto-sell targets",
              },
              {
                step: "3",
                title: "Fund",
                desc: "Deposit SOL to your bot-managed wallet for trading capital",
              },
              {
                step: "4",
                title: "Earn",
                desc: "The sniper runs 24/7 catching launches. You get Telegram alerts on every trade.",
              },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <div className="font-bold mb-1">{s.title}</div>
                <div className="text-sm text-gray-400">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Performance</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-extrabold text-green-400">{"<"}500ms</div>
              <div className="text-sm text-gray-400 mt-1">Execution speed (Jito bundles)</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-purple-400">200+</div>
              <div className="text-sm text-gray-400 mt-1">Tokens sniped this month</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-400">0-100</div>
              <div className="text-sm text-gray-400 mt-1">Safety score on every token</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-4">
            <Faq q="How does the safety filter work?" a="Every new token is scored 0-100 based on mint authority, freeze authority, top holder concentration, and Jupiter verification. Your sniper only buys tokens above your configured threshold." />
            <Faq q="What is MEV protection?" a="All trades are sent through Jito bundles, which means searcher bots can't front-run or sandwich your trades. You get the price you expect." />
            <Faq q="Can I lose money?" a="Yes — sniping new tokens is inherently risky. The safety filter reduces rug pull exposure but doesn't eliminate it. Only fund your wallet with money you can afford to lose." />
            <Faq q="How do I cancel?" a="Just stop renewing. No lock-in, no contracts. Your remaining wallet funds are always yours to withdraw." />
            <Faq q="Do you take custody of my funds?" a="Your wallet is managed by the bot with a keypair generated for your account. You can withdraw anytime with /withdraw." />
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition-colors"
          >
            Start Sniping on Telegram
          </a>
          <p className="text-gray-500 mt-4 text-sm">
            Powered by Jupiter V6 + Jito MEV Protection + Helius RPC
          </p>
        </div>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gray-800 rounded-xl p-4 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold">{q}</div>
        <div className="text-gray-500">{open ? "-" : "+"}</div>
      </div>
      {open && <div className="text-gray-400 text-sm mt-2">{a}</div>}
    </div>
  );
}
