"use client";

const SECTIONS = [
  { name: "Accept Payments", tools: [
    { name: "Sol Pay Buttons", desc: "Embed payment buttons anywhere. 2% fee.", link: "/sol-pay", ours: true },
    { name: "Invoice Generator", desc: "Create and send invoices with SOL payment.", link: "/invoice", ours: true },
    { name: "Stripe", desc: "Traditional card payments.", link: "https://stripe.com" },
  ]},
  { name: "Build Your Site", tools: [
    { name: "Meta Tag Generator", desc: "SEO meta tags for social sharing.", link: "/meta-tags", ours: true },
    { name: "Favicon Generator", desc: "Quick favicon from letters.", link: "/favicon", ours: true },
    { name: "Link in Bio", desc: "Free Linktree alternative with SOL tips.", link: "/bio", ours: true },
    { name: "Vercel", desc: "Deploy for free.", link: "https://vercel.com" },
  ]},
  { name: "Market Your Product", tools: [
    { name: "Content Engine", desc: "Auto-publish to 5 platforms daily.", link: "/templates", ours: true },
    { name: "QR Code Generator", desc: "Create scannable codes for marketing.", link: "/qr", ours: true },
    { name: "Word Counter", desc: "Optimize content length.", link: "/word-counter", ours: true },
  ]},
  { name: "Developer Tools", tools: [
    { name: "JSON Formatter", desc: "Format and validate JSON.", link: "/json", ours: true },
    { name: "Regex Tester", desc: "Test patterns live.", link: "/regex", ours: true },
    { name: "cURL Builder", desc: "Build API requests visually.", link: "/curl-builder", ours: true },
    { name: "Uptime Monitor", desc: "Know when your site goes down.", link: "/uptime", ours: true },
  ]},
  { name: "Crypto/Web3", tools: [
    { name: "Trading Bot", desc: "Telegram bot for Solana trading.", link: "/sol-bot", ours: true },
    { name: "Token Scanner", desc: "Score tokens 0-100 for safety.", link: "/is-safe", ours: true },
    { name: "Wallet Balance Checker", desc: "Check any Solana wallet.", link: "/sol-balance", ours: true },
  ]},
];

export default function StartupToolkitPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Startup Toolkit</h1>
        <p className="text-gray-400 text-center mb-8">Every tool you need to launch. Most are free.</p>
        {SECTIONS.map((s, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-lg font-bold text-purple-400 mb-3">{s.name}</h2>
            <div className="space-y-2">
              {s.tools.map((t, j) => (
                <a key={j} href={t.link} target={t.link.startsWith("http") ? "_blank" : undefined}
                  className="flex items-center justify-between bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                  <div>
                    <div className="font-bold text-sm">{t.name} {t.ours && <span className="text-xs text-green-400 ml-1">FREE</span>}</div>
                    <div className="text-xs text-gray-400">{t.desc}</div>
                  </div>
                  <span className="text-purple-400 text-xs">&rarr;</span>
                </a>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/store" className="text-purple-400 hover:underline">Digital Store</a>{" | "}
          <a href="/jobs" className="text-purple-400 hover:underline">Job Board</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
