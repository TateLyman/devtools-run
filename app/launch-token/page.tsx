"use client";

const PLANS = [
  {
    name: "Basic Launch",
    price: "0.2 SOL",
    desc: "Launch your token on pump.fun via Telegram",
    features: ["Token creation on pump.fun", "Custom name + symbol + description", "Instant trading enabled", "Telegram command: /create"],
    cta: "https://t.me/solscanitbot",
    ctaText: "Launch via Bot",
  },
  {
    name: "Growth Launch",
    price: "1 SOL",
    popular: true,
    desc: "Launch + promotion + volume to get noticed",
    features: [
      "Everything in Basic",
      "24h promoted listing in /trending",
      "10 volume bump cycles (real on-chain trades)",
      "Safety score optimization guidance",
      "Listed in our new token alerts (sent to 26+ users)",
    ],
    cta: "https://t.me/solscanitbot",
    ctaText: "Launch + Promote",
  },
  {
    name: "Full Service",
    price: "3 SOL",
    desc: "Complete launch with marketing and community building",
    features: [
      "Everything in Growth",
      "48h promoted listing",
      "50 volume bump cycles",
      "Dev.to article about your token",
      "Reddit post in r/SolanaMemeCoins",
      "Bluesky announcement",
      "Token featured in daily digest to all bot users",
      "Custom Telegram group setup assistance",
    ],
    cta: "https://t.me/solscanitbot",
    ctaText: "Full Service Launch",
  },
];

export default function LaunchTokenPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-yellow-400 mb-3 tracking-widest uppercase">Token Launch Service</div>
          <h1 className="text-5xl font-extrabold mb-4">Launch Your Solana Token</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From creation to promotion. We handle the technical side — you focus on community.
            Launch on pump.fun with real volume, promotion, and marketing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((p, i) => (
            <div key={i} className={`bg-gray-900 rounded-2xl p-6 border ${p.popular ? "border-yellow-500 ring-2 ring-yellow-500/20" : "border-gray-800"}`}>
              {p.popular && <div className="text-xs font-bold text-yellow-400 uppercase mb-2">Most Popular</div>}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <div className="text-3xl font-extrabold mt-2 mb-2">{p.price}</div>
              <p className="text-gray-400 text-sm mb-4">{p.desc}</p>
              <ul className="space-y-2 mb-6">
                {p.features.map((f, j) => (
                  <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">&#x2713;</span>{f}
                  </li>
                ))}
              </ul>
              <a href={p.cta} target="_blank"
                className={`block text-center py-3 rounded-xl font-bold ${p.popular ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-700 hover:bg-gray-600"}`}>
                {p.ctaText}
              </a>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Launch With Us</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">{"<"}60s</div>
              <div className="text-sm text-gray-400 mt-1">Token live on pump.fun</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">26+</div>
              <div className="text-sm text-gray-400 mt-1">Active traders see your token</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">Real</div>
              <div className="text-sm text-gray-400 mt-1">On-chain volume from bump bot</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href="https://t.me/solscanitbot" target="_blank"
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-10 rounded-xl text-lg">
            Start Your Launch
          </a>
          <p className="text-gray-500 mt-4 text-sm">DM @solscanitbot on X for custom packages</p>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/sol-bot" className="text-yellow-400 hover:underline">Trading Bot</a>{" | "}
          <a href="/sniper" className="text-yellow-400 hover:underline">Sniper</a>{" | "}
          <a href="/whale-tracker" className="text-yellow-400 hover:underline">Whale Tracker</a>{" | "}
          <a href="/is-safe" className="text-yellow-400 hover:underline">Token Scanner</a>{" | "}
          <a href="/templates" className="text-yellow-400 hover:underline">Dev Templates</a>
        </div>
      </div>
    </div>
  );
}
