"use client";

const ENTRIES = [
  { date: "March 24, 2026", items: [
    "Added 510+ unit converter pages (programmatic SEO)",
    "Added 8 language cheat sheets (JS, Python, Git, React, CSS, TS, SQL, Bash)",
    "Added 8 tech comparison pages (React vs Vue, etc.)",
    "Added 18 how-to guides with code examples",
    "Added 8 error fix pages (TypeError, CORS, etc.)",
    "Added 5 code snippet collections",
    "Added 4 interview prep pages",
    "Added 7 'best tools' list pages",
    "Added CSS animations library",
    "Added keyboard shortcuts reference",
    "Added ASCII art generator",
    "Added Notion templates store",
    "Added startup toolkit",
    "Added developer deals page",
    "Added crypto dev job board",
    "Added privacy tools page",
    "Added daily dev tip page",
    "Added API documentation hub",
    "Added Adsterra ads to all pages",
    "Deployed floating CTA bar site-wide",
  ]},
  { date: "March 23, 2026", items: [
    "Built Telegram Mini App with 5-screen trading UI",
    "Added API server (16 endpoints) for Mini App",
    "Boosted referral program to 50% for 14 days",
    "Added /send command (P2P transfers with 5% fee)",
    "Added /earn command (referral earnings calculator)",
    "Upgraded to Helius RPC for faster trades",
    "Created Sol Pay button generator",
    "Created Sniper-as-a-Service page",
    "Created Whale Tracker landing page",
    "Created bot template marketplace",
    "Created token launch service",
    "Created uptime monitor",
    "Published 10+ articles on Dev.to and Hashnode",
    "Created X account @solscanitbot",
    "Fixed content engine (was broken)",
    "Sent free premium trial to 26 users",
  ]},
  { date: "Earlier", items: [
    "44-command Telegram trading bot",
    "27+ original developer tools",
    "SOL payment verification system",
    "Product download system with HMAC tokens",
    "Automated content publishing engine",
    "Reddit auto-poster",
    "Bounty monitoring system",
  ]},
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Changelog</h1>
        <p className="text-gray-400 text-center mb-8">Everything we ship, in chronological order.</p>
        <div className="space-y-8">
          {ENTRIES.map((e, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-purple-400 mb-3">{e.date}</h2>
              <ul className="space-y-2">
                {e.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">+</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>{" | "}
          <a href="/store" className="text-purple-400 hover:underline">Store</a>{" | "}
          <a href="/telegram" className="text-purple-400 hover:underline">Telegram</a>
        </div>
      </div>
    </div>
  );
}
