"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";

const tiers = [
  {
    name: "Starter",
    price: "0.5 SOL/mo",
    priceSol: 0.5,
    color: "blue",
    description: "Basic scanner bot with your branding",
    features: [
      "Your own Telegram bot with custom name",
      "Token scanning & safety checks",
      "Price alerts & trending tokens",
      "Custom welcome message",
      "Your branding on all messages",
      "Basic buy/sell commands",
      "Community support",
    ],
    excluded: [
      "Copy trading & sniping",
      "DCA & limit orders",
      "Volume/bump bot",
      "Custom commands",
      "Priority support",
      "Your fee wallet earns fees",
    ],
  },
  {
    name: "Pro",
    price: "1 SOL/mo",
    priceSol: 1,
    color: "purple",
    popular: true,
    description: "Full trading bot with scanning, buying, selling, DCA & alerts",
    features: [
      "Everything in Starter",
      "All 44 trading commands",
      "Copy trading & wallet mirroring",
      "Token sniping (DexScreener + Pump.fun)",
      "DCA engine with 5 intervals",
      "Limit orders & stop-loss",
      "Portfolio dashboard with P&L",
      "Your fee wallet receives trading fees",
      "Premium tier system for your users",
      "3-tier referral system",
      "Whale & price alerts",
      "Priority email support",
    ],
    excluded: [
      "Custom commands",
      "Dedicated Slack/TG support channel",
    ],
  },
  {
    name: "Enterprise",
    price: "2 SOL/mo",
    priceSol: 2,
    color: "yellow",
    description: "Everything + custom commands, priority support, white-glove setup",
    features: [
      "Everything in Pro",
      "Custom commands tailored to your project",
      "Your project's tokens featured by default",
      "Custom token promotion system",
      "Volume/bump bot for your token",
      "Dedicated support channel (Telegram/Slack)",
      "White-glove setup & configuration",
      "Priority bug fixes & feature requests",
      "Monthly strategy call",
      "Multi-bot support (up to 3 bots)",
    ],
    excluded: [],
  },
];

const faqs = [
  {
    q: "How long does setup take?",
    a: "We deploy your branded bot within 24 hours of payment. Enterprise setups with custom commands may take 48-72 hours.",
  },
  {
    q: "Do I need technical knowledge?",
    a: "No. You just need to create a bot via @BotFather on Telegram and send us the token. We handle everything else -- deployment, configuration, monitoring.",
  },
  {
    q: "Can I change my bot's name and branding later?",
    a: "Yes. You can update your bot name, welcome message, and branding at any time through @BotFather. We'll update the bot configuration within 24 hours.",
  },
  {
    q: "How do trading fees work?",
    a: "On Pro and Enterprise tiers, your fee wallet receives trading fees from every swap your users make. The default fee is 1% per trade, configurable on Enterprise.",
  },
  {
    q: "What happens if I cancel?",
    a: "Your bot will stop operating at the end of your billing period. Your users' data and wallets remain safe. You can reactivate anytime by renewing.",
  },
  {
    q: "Can I see a demo?",
    a: "Yes -- @solscanitbot on Telegram is a live instance of the exact bot you'll get. Try any command to see it in action.",
  },
  {
    q: "Is the bot hosted for me?",
    a: "Yes. We host, monitor, and maintain your bot on our infrastructure. Zero server management on your end. 99.9% uptime guaranteed.",
  },
  {
    q: "Can I run multiple bots?",
    a: "Starter and Pro include 1 bot. Enterprise includes up to 3 bots. Need more? Contact us for volume pricing.",
  },
];

export default function WhiteLabelPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [txSig, setTxSig] = useState("");
  const [botToken, setBotToken] = useState("");
  const [contactTg, setContactTg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeTier = tiers.find((t) => t.name === selectedTier);

  async function handleSubmit() {
    if (!txSig.trim() || !botToken.trim() || !contactTg.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // For now, we verify the payment on-chain and store the order
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txSig: txSig.trim(),
          product: `white-label-${selectedTier?.toLowerCase()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment verification failed. Please check the amount and try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or contact @solscanitbot on Telegram.");
    }
    setSubmitting(false);
  }

  const colorMap: Record<string, { border: string; bg: string; text: string; btn: string; btnHover: string; badge: string }> = {
    blue: {
      border: "border-blue-800/50",
      bg: "bg-blue-900/20",
      text: "text-blue-400",
      btn: "bg-blue-600",
      btnHover: "hover:bg-blue-700",
      badge: "bg-blue-600",
    },
    purple: {
      border: "border-purple-800/50",
      bg: "bg-purple-900/20",
      text: "text-purple-400",
      btn: "bg-purple-600",
      btnHover: "hover:bg-purple-700",
      badge: "bg-purple-600",
    },
    yellow: {
      border: "border-yellow-700/50",
      bg: "bg-yellow-900/20",
      text: "text-yellow-400",
      btn: "bg-yellow-600",
      btnHover: "hover:bg-yellow-700",
      badge: "bg-yellow-600",
    },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-900/30 border border-purple-700/40 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            White-Label Solution
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Your Own Branded<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400">
              Solana Scanner Bot
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            Give your community a powerful Telegram trading bot with your brand,
            your name, and your fee wallet. Deployed in 24 hours.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            The same engine powering{" "}
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              @solscanitbot
            </a>{" "}
            -- now available with your branding.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              12+ projects deployed
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              44 trading commands
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              24-hour deployment
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              99.9% uptime
            </span>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Pick a Plan", desc: "Choose Starter, Pro, or Enterprise based on your community's needs." },
              { step: "2", title: "Pay with SOL", desc: "Send payment to our wallet. On-chain verification -- no middlemen." },
              { step: "3", title: "Send Your Bot Token", desc: "Create a bot via @BotFather on Telegram and send us the token." },
              { step: "4", title: "Go Live in 24h", desc: "We deploy your branded bot. You earn trading fees from day one." },
            ].map((s) => (
              <div key={s.step} className="bg-gray-900 rounded-xl p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What You Get */}
        <div className="bg-gray-900 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">What You Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Your Brand Everywhere", desc: "Your bot name, welcome message, and branding on every interaction. Your community sees your project -- not ours." },
              { title: "Full Trading Suite", desc: "44 commands: buy, sell, snipe, DCA, limit orders, copy trading, portfolio tracking, price alerts, and more." },
              { title: "Earn Trading Fees", desc: "Your fee wallet collects a cut of every trade your users make. A real revenue stream from your community." },
              { title: "Featured Tokens", desc: "Your project's tokens are front and center. Featured in trending, token scans, and quick-buy buttons." },
              { title: "Zero Maintenance", desc: "We host, monitor, and update your bot. Auto-reconnect, crash recovery, and 99.9% uptime guarantee." },
              { title: "Premium & Referrals", desc: "Built-in premium subscriptions and 3-tier referral system. Monetize your users and grow organically." },
            ].map((item) => (
              <div key={item.title} className="bg-gray-800/50 rounded-lg p-5">
                <h3 className="text-md font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-2">Pricing</h2>
          <p className="text-gray-400 text-center mb-8">Pay monthly with SOL. Cancel anytime.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const c = colorMap[tier.color];
              return (
                <div
                  key={tier.name}
                  className={`relative bg-gray-900 rounded-xl p-6 border ${c.border} ${
                    tier.popular ? "ring-2 ring-purple-500/50" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className={`${c.badge} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className={`text-xl font-bold mb-1 ${c.text}`}>{tier.name}</h3>
                  <p className="text-3xl font-bold mb-2">{tier.price}</p>
                  <p className="text-gray-400 text-sm mb-6">{tier.description}</p>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-green-400 mt-0.5 shrink-0">&#10003;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                    {tier.excluded.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-0.5 shrink-0">&#10007;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      setSelectedTier(tier.name);
                      setSubmitted(false);
                      setError("");
                      setTxSig("");
                      setBotToken("");
                      setContactTg("");
                      document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full ${c.btn} ${c.btnHover} text-white font-bold py-3 rounded-lg transition-colors cursor-pointer`}
                  >
                    Get {tier.name} -- {tier.price}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-gray-900 rounded-xl p-8 mb-16 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Feature Comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 pr-4 text-gray-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-blue-400 font-bold">Starter</th>
                <th className="text-center py-3 px-4 text-purple-400 font-bold">Pro</th>
                <th className="text-center py-3 px-4 text-yellow-400 font-bold">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {[
                ["Custom bot name & branding", true, true, true],
                ["Token scanning & safety checks", true, true, true],
                ["Price alerts", true, true, true],
                ["Custom welcome message", true, true, true],
                ["Basic buy/sell commands", true, true, true],
                ["All 44 trading commands", false, true, true],
                ["Copy trading & wallet mirroring", false, true, true],
                ["Token sniping", false, true, true],
                ["DCA engine", false, true, true],
                ["Limit orders & stop-loss", false, true, true],
                ["Portfolio dashboard with P&L", false, true, true],
                ["Your fee wallet earns fees", false, true, true],
                ["Premium tier for your users", false, true, true],
                ["3-tier referral system", false, true, true],
                ["Whale alerts", false, true, true],
                ["Custom commands", false, false, true],
                ["Volume/bump bot", false, false, true],
                ["Featured token placement", false, false, true],
                ["Dedicated support channel", false, false, true],
                ["White-glove setup", false, false, true],
                ["Monthly strategy call", false, false, true],
                ["Multi-bot (up to 3)", false, false, true],
                ["Support", "Community", "Priority email", "Dedicated channel"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50">
                  <td className="py-2.5 pr-4">{row[0] as string}</td>
                  {[1, 2, 3].map((col) => (
                    <td key={col} className="text-center py-2.5 px-4">
                      {typeof row[col] === "boolean" ? (
                        row[col] ? (
                          <span className="text-green-400">&#10003;</span>
                        ) : (
                          <span className="text-gray-600">--</span>
                        )
                      ) : (
                        <span className="text-gray-400 text-xs">{row[col] as string}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats / Social Proof */}
        <div className="bg-gray-900 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Trusted by Solana Projects</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-400">12+</p>
              <p className="text-gray-400 text-sm">Projects Deployed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">44</p>
              <p className="text-gray-400 text-sm">Trading Commands</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">99.9%</p>
              <p className="text-gray-400 text-sm">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">24h</p>
              <p className="text-gray-400 text-sm">Deployment Time</p>
            </div>
          </div>
        </div>

        {/* Order Section */}
        <div id="order-section" className="scroll-mt-8 mb-16">
          {selectedTier && !submitted && activeTier && (
            <div className="bg-gray-900 rounded-xl p-8 border border-purple-800/50">
              <h2 className="text-2xl font-bold mb-2 text-center">
                Order: {activeTier.name} Plan
              </h2>
              <p className="text-gray-400 text-center mb-6">
                {activeTier.price} -- {activeTier.description}
              </p>
              <div className="max-w-lg mx-auto space-y-5">
                {/* Step 1: Payment */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Step 1: Send {activeTier.priceSol} SOL to this address
                  </label>
                  <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm break-all select-all border border-gray-700">
                    {RECIPIENT}
                  </div>
                </div>

                {/* Step 2: TX Sig */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Step 2: Paste your transaction signature
                  </label>
                  <input
                    type="text"
                    value={txSig}
                    onChange={(e) => setTxSig(e.target.value)}
                    placeholder="Transaction signature..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm"
                  />
                </div>

                {/* Step 3: Bot Token */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Step 3: Your Telegram bot token (from @BotFather)
                  </label>
                  <input
                    type="text"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="123456789:ABCdefGhIjKlMnOpQrStUvWxYz..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Message @BotFather on Telegram, send /newbot, and copy the token.
                  </p>
                </div>

                {/* Step 4: Contact */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Step 4: Your Telegram username (for support)
                  </label>
                  <input
                    type="text"
                    value={contactTg}
                    onChange={(e) => setContactTg(e.target.value)}
                    placeholder="@yourusername"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !txSig.trim() || !botToken.trim() || !contactTg.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer"
                >
                  {submitting ? "Verifying payment..." : `Submit Order -- ${activeTier.priceSol} SOL`}
                </button>
              </div>
            </div>
          )}

          {submitted && activeTier && (
            <div className="bg-purple-900/30 border border-purple-600 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Order Confirmed!</h2>
              <p className="text-gray-300 mb-2">
                Your <strong>{activeTier.name}</strong> white-label bot is being set up.
              </p>
              <p className="text-gray-400 mb-6">
                We'll deploy your branded bot within 24 hours and contact you at your Telegram username.
              </p>
              <a
                href="https://t.me/solscanitbot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Contact us on Telegram: @solscanitbot
              </a>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="font-medium text-gray-200">{faq.q}</span>
                  <span className="text-gray-500 text-xl ml-4 shrink-0">
                    {openFaq === i ? "-" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-400 text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Launch Your Branded Bot?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Join 12+ Solana projects already using their own white-label trading bot.
            Start earning trading fees from your community today.
          </p>
          <button
            onClick={() => {
              setSelectedTier("Pro");
              setSubmitted(false);
              setError("");
              setTxSig("");
              setBotToken("");
              setContactTg("");
              document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get Started -- 1 SOL/month
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Questions?{" "}
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Message @solscanitbot on Telegram
            </a>
          </p>
        </div>

        {/* Cross-sell */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Want to build and host it yourself?</h3>
          <p className="text-gray-300 text-sm mb-3">
            Get the full source code (4,300+ lines) and deploy your own bot with zero monthly fees.
          </p>
          <a
            href="/sol-bot-source"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors"
          >
            Buy Source Code -- 2 SOL (one-time)
          </a>
        </div>
      </div>
    </div>
  );
}
