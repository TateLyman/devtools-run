"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";

const TIERS = {
  free: {
    name: "Free",
    price: "Free",
    priceSol: 0,
    daily: "10 scans/day",
    rateLimit: "5 req/min",
    features: ["Basic token info", "Price + market cap", "No API key needed", "IP-based rate limit"],
    excluded: ["Liquidity & volume data", "Mint/freeze authority", "Risk scoring", "Holder info"],
    color: "gray",
  },
  pro: {
    name: "Pro",
    price: "$9.99/mo",
    priceSol: 0.08,
    daily: "1,000 scans/day",
    rateLimit: "15 req/min",
    features: [
      "Full token scan data",
      "Liquidity & volume",
      "Mint/freeze authority checks",
      "Risk score & analysis",
      "All trading pairs",
      "Priority support",
    ],
    excluded: [],
    color: "blue",
  },
  unlimited: {
    name: "Unlimited",
    price: "$49.99/mo",
    priceSol: 0.4,
    daily: "100,000 scans/day",
    rateLimit: "60 req/min",
    features: [
      "Everything in Pro",
      "100x higher daily limit",
      "4x faster rate limit",
      "Production-grade throughput",
      "Ideal for bots & dashboards",
      "Priority support",
    ],
    excluded: [],
    color: "purple",
  },
} as const;

const FREE_RESPONSE = `{
  "token": "So11111111111111111111111111111111111111112",
  "name": "Wrapped SOL",
  "symbol": "SOL",
  "price": 142.35,
  "price_change_24h": 3.2,
  "market_cap": 65000000000,
  "pairs": 150,
  "tier": "free",
  "scan_url": "https://t.me/solscanitbot",
  "upgrade": "https://devtools.run/api-access",
  "timestamp": "2026-03-15T12:00:00.000Z"
}`;

const PAID_RESPONSE = `{
  "token": "So11111111111111111111111111111111111111112",
  "name": "Wrapped SOL",
  "symbol": "SOL",
  "decimals": 9,
  "supply": 573892847.38,
  "price": 142.35,
  "price_change_24h": 3.2,
  "liquidity_usd": 285000000,
  "volume_24h": 1200000000,
  "market_cap": 65000000000,
  "pairs": 150,
  "top_pair_url": "https://dexscreener.com/solana/...",
  "mint_authority": {
    "status": "RENOUNCED",
    "address": null
  },
  "freeze_authority": {
    "status": "RENOUNCED",
    "address": null
  },
  "risk": {
    "score": 0,
    "level": "LOW",
    "reasons": []
  },
  "tier": "pro",
  "scan_url": "https://t.me/solscanitbot",
  "timestamp": "2026-03-15T12:00:00.000Z"
}`;

export default function ApiAccessPage() {
  const [selectedTier, setSelectedTier] = useState<"pro" | "unlimited" | null>(null);
  const [txSig, setTxSig] = useState("");
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"curl" | "js" | "python">("curl");
  const [responseTab, setResponseTab] = useState<"free" | "paid">("free");

  async function registerKey() {
    if (!txSig.trim() || !email.trim() || !selectedTier) return;
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/scan/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txSig: txSig.trim(),
          email: email.trim(),
          tier: selectedTier,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setVerifying(false);
        return;
      }
      setApiKey(data.apiKey);
    } catch {
      setError("Registration failed. Please try again.");
    }
    setVerifying(false);
  }

  function copyKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  const curlFree = `curl "https://devtools.run/api/v1/scan?token=TOKEN_MINT_ADDRESS"`;
  const curlPaid = `curl "https://devtools.run/api/v1/scan?token=TOKEN_MINT_ADDRESS&key=YOUR_API_KEY"`;

  const jsFree = `// Free tier — no API key needed
const res = await fetch(
  "https://devtools.run/api/v1/scan?token=TOKEN_MINT_ADDRESS"
);
const data = await res.json();
console.log(\`\${data.name} (\${data.symbol}) — $\${data.price}\`);`;

  const jsPaid = `// Pro/Unlimited tier — full scan data
const res = await fetch(
  "https://devtools.run/api/v1/scan?token=TOKEN_MINT_ADDRESS&key=YOUR_API_KEY"
);
const data = await res.json();

console.log(\`\${data.name} (\${data.symbol})\`);
console.log(\`Price: $\${data.price}\`);
console.log(\`Liquidity: $\${data.liquidity_usd.toLocaleString()}\`);
console.log(\`Volume 24h: $\${data.volume_24h.toLocaleString()}\`);
console.log(\`Risk: \${data.risk.level} (\${data.risk.score}/100)\`);
console.log(\`Mint Authority: \${data.mint_authority.status}\`);`;

  const pythonFree = [
    'import requests',
    '',
    '# Free tier — no API key needed',
    'url = "https://devtools.run/api/v1/scan"',
    'params = {"token": "TOKEN_MINT_ADDRESS"}',
    '',
    'data = requests.get(url, params=params).json()',
    'print(f"{data[\'name\']} ({data[\'symbol\']}) — ${data[\'price\']}")',
  ].join('\n');

  const pythonPaid = [
    'import requests',
    '',
    '# Pro/Unlimited tier — full scan data',
    'url = "https://devtools.run/api/v1/scan"',
    'params = {"token": "TOKEN_MINT_ADDRESS", "key": "YOUR_API_KEY"}',
    '',
    'data = requests.get(url, params=params).json()',
    'print(f"{data[\'name\']} ({data[\'symbol\']})")',
    'print(f"Price: ${data[\'price\']}")',
    'liq = f"{data[\'liquidity_usd\']:,.0f}"',
    'print(f"Liquidity: ${liq}")',
    'vol = f"{data[\'volume_24h\']:,.0f}"',
    'print(f"Volume 24h: ${vol}")',
    'print(f"Risk: {data[\'risk\'][\'level\']} ({data[\'risk\'][\'score\']}/100)")',
    'print(f"Mint Authority: {data[\'mint_authority\'][\'status\']}")',
  ].join('\n');
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-600/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Solana Token Scanner API
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Token intelligence in one API call
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-2">
            Price, liquidity, volume, authority checks, and risk scoring for any Solana token. Powered by Helius, Jupiter, and DexScreener.
          </p>
          <p className="text-gray-500 text-sm">
            Free tier available -- no signup required
          </p>
        </div>

        {/* Quick Try */}
        <div className="bg-gray-900 rounded-xl p-6 mb-16 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Try it now</h3>
            <button
              onClick={() => copyText(curlFree)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="text-sm text-green-400">
            {`GET /api/v1/scan?token=So11111111111111111111111111111111111111112`}
          </pre>
          <p className="text-gray-500 text-xs mt-3">No API key needed for basic data. Add <code className="text-blue-300">&key=YOUR_KEY</code> for full scan.</p>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">Pricing</h2>
          <p className="text-gray-400 text-center mb-10">Start free, upgrade when you need more</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 flex flex-col">
              <h3 className="text-xl font-bold mb-1">Free</h3>
              <p className="text-3xl font-bold mb-1">$0</p>
              <p className="text-gray-500 text-sm mb-6">No signup required</p>
              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400 font-bold">10</span>
                  <span className="text-gray-300">scans per day</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400 font-bold">5</span>
                  <span className="text-gray-300">requests per minute</span>
                </div>
                {TIERS.free.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">+</span>
                    <span>{f}</span>
                  </div>
                ))}
                {TIERS.free.excluded.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5">-</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <pre className="text-xs text-gray-400 mb-0">
                {`GET /api/v1/scan?token=MINT`}
              </pre>
            </div>

            {/* Pro Tier */}
            <div className="bg-gray-900 rounded-xl p-8 border-2 border-blue-600 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl font-bold">$9.99</p>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">{TIERS.pro.priceSol} SOL</p>
              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400 font-bold">1,000</span>
                  <span className="text-gray-300">scans per day</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400 font-bold">15</span>
                  <span className="text-gray-300">requests per minute</span>
                </div>
                {TIERS.pro.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">+</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setSelectedTier("pro"); setApiKey(""); setError(""); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Get Pro Key -- {TIERS.pro.priceSol} SOL
              </button>
            </div>

            {/* Unlimited Tier */}
            <div className="bg-gray-900 rounded-xl p-8 border border-purple-800/50 flex flex-col">
              <h3 className="text-xl font-bold mb-1">Unlimited</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl font-bold">$49.99</p>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">{TIERS.unlimited.priceSol} SOL</p>
              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-purple-400 font-bold">100,000</span>
                  <span className="text-gray-300">scans per day</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-purple-400 font-bold">60</span>
                  <span className="text-gray-300">requests per minute</span>
                </div>
                {TIERS.unlimited.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">+</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setSelectedTier("unlimited"); setApiKey(""); setError(""); }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Get Unlimited Key -- {TIERS.unlimited.priceSol} SOL
              </button>
            </div>
          </div>
        </div>

        {/* Payment Flow */}
        {selectedTier && !apiKey && (
          <div id="payment" className="bg-gray-900 rounded-xl p-8 mb-16 border border-blue-800/50">
            <h2 className="text-xl font-bold mb-2 text-center">
              Get {selectedTier === "pro" ? "Pro" : "Unlimited"} API Key
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              Pay with SOL on Solana mainnet
            </p>
            <div className="space-y-4 max-w-lg mx-auto">
              <div>
                <p className="text-gray-300 mb-2">
                  Send <strong className={selectedTier === "pro" ? "text-blue-400" : "text-purple-400"}>
                    {TIERS[selectedTier].priceSol} SOL
                  </strong> to:
                </p>
                <div
                  className="bg-gray-800 rounded-lg p-3 font-mono text-sm break-all select-all border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors"
                  onClick={() => copyText(RECIPIENT)}
                  title="Click to copy"
                >
                  {RECIPIENT}
                </div>
              </div>
              <div>
                <label className="text-gray-300 mb-2 block">Your email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-gray-300 mb-2 block">Transaction signature:</label>
                <input
                  type="text"
                  value={txSig}
                  onChange={(e) => setTxSig(e.target.value)}
                  placeholder="Paste your Solana transaction signature..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={registerKey}
                disabled={verifying || !txSig.trim() || !email.trim()}
                className={`w-full ${selectedTier === "pro" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"} disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors`}
              >
                {verifying ? "Verifying payment..." : "Verify & Get API Key"}
              </button>
              <button
                onClick={() => setSelectedTier(null)}
                className="w-full text-gray-500 hover:text-gray-300 text-sm py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* API Key Display */}
        {apiKey && (
          <div className="bg-blue-900/30 border border-blue-600 rounded-xl p-8 mb-16 text-center">
            <h2 className="text-2xl font-bold mb-2 text-blue-400">Payment Verified!</h2>
            <p className="text-gray-300 mb-1">
              Your <strong>{selectedTier === "pro" ? "Pro" : "Unlimited"}</strong> API key is ready.
            </p>
            <p className="text-gray-400 text-sm mb-4">Save it somewhere safe -- it will not be shown again.</p>
            <div className="bg-gray-800 rounded-lg p-4 font-mono text-lg break-all select-all border border-gray-700 mb-4">
              {apiKey}
            </div>
            <button
              onClick={copyKey}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {copied ? "Copied!" : "Copy API Key"}
            </button>
            <p className="text-gray-500 text-sm mt-4">
              {selectedTier === "pro" ? "1,000 scans/day | 15 req/min" : "100,000 scans/day | 60 req/min"}
            </p>
          </div>
        )}

        {/* API Reference */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">API Reference</h2>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-blue-400">Endpoint</h3>
            <pre className="text-sm">
              GET https://devtools.run/api/v1/scan?token=&lt;MINT_ADDRESS&gt;&amp;key=&lt;API_KEY&gt;
            </pre>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-blue-400">Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 pr-4 text-gray-400">Parameter</th>
                    <th className="py-2 pr-4 text-gray-400">Type</th>
                    <th className="py-2 pr-4 text-gray-400">Required</th>
                    <th className="py-2 text-gray-400">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-blue-300">token</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Solana token mint address</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-blue-300">key</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">No</td>
                    <td className="py-2">API key for Pro/Unlimited data. Omit for free tier.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-blue-400">Response Comparison</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 font-medium mb-2">Free Tier Fields</p>
                <ul className="space-y-1 text-gray-300">
                  <li><code className="text-green-400">token</code> -- mint address</li>
                  <li><code className="text-green-400">name</code> -- token name</li>
                  <li><code className="text-green-400">symbol</code> -- ticker symbol</li>
                  <li><code className="text-green-400">price</code> -- USD price</li>
                  <li><code className="text-green-400">price_change_24h</code> -- 24h % change</li>
                  <li><code className="text-green-400">market_cap</code> -- market cap</li>
                  <li><code className="text-green-400">pairs</code> -- number of trading pairs</li>
                </ul>
              </div>
              <div>
                <p className="text-blue-400 font-medium mb-2">Pro/Unlimited Additional Fields</p>
                <ul className="space-y-1 text-gray-300">
                  <li><code className="text-blue-300">decimals</code> -- token decimal places</li>
                  <li><code className="text-blue-300">supply</code> -- adjusted total supply</li>
                  <li><code className="text-blue-300">liquidity_usd</code> -- total liquidity</li>
                  <li><code className="text-blue-300">volume_24h</code> -- 24h trading volume</li>
                  <li><code className="text-blue-300">top_pair_url</code> -- DexScreener link</li>
                  <li><code className="text-blue-300">mint_authority</code> -- status + address</li>
                  <li><code className="text-blue-300">freeze_authority</code> -- status + address</li>
                  <li><code className="text-blue-300">risk</code> -- score, level, reasons</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-blue-400">Risk Scoring</h3>
            <p className="text-gray-400 text-sm mb-3">
              Risk score (0-100) calculated from multiple safety signals (Pro/Unlimited only):
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li><strong>Mint authority active:</strong> +30 points</li>
              <li><strong>Freeze authority active:</strong> +25 points</li>
              <li><strong>Liquidity &lt; $1,000:</strong> +25 points</li>
              <li><strong>Liquidity &lt; $10,000:</strong> +15 points</li>
              <li><strong>Volume &lt; $100:</strong> +15 points</li>
              <li><strong>Volume &lt; $1,000:</strong> +10 points</li>
            </ul>
            <div className="mt-3 flex gap-4 text-sm">
              <span className="text-green-400">0-29 = LOW</span>
              <span className="text-yellow-400">30-59 = MEDIUM</span>
              <span className="text-red-400">60-100 = HIGH</span>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Code Examples</h2>

          <div className="flex gap-2 mb-4">
            {(["curl", "js", "python"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {tab === "curl" ? "cURL" : tab === "js" ? "JavaScript" : "Python"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Free (no key)</p>
              <pre className="text-sm leading-relaxed text-green-300">
                {activeTab === "curl" && curlFree}
                {activeTab === "js" && jsFree}
                {activeTab === "python" && pythonFree}
              </pre>
            </div>
            <div>
              <p className="text-blue-500 text-xs uppercase tracking-wide mb-2">Pro / Unlimited (with key)</p>
              <pre className="text-sm leading-relaxed text-blue-300">
                {activeTab === "curl" && curlPaid}
                {activeTab === "js" && jsPaid}
                {activeTab === "python" && pythonPaid}
              </pre>
            </div>
          </div>
        </div>

        {/* Example Responses */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Example Responses</h2>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setResponseTab("free")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                responseTab === "free"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Free Tier
            </button>
            <button
              onClick={() => setResponseTab("paid")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                responseTab === "paid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Pro / Unlimited
            </button>
          </div>
          <pre className="text-sm leading-relaxed text-green-300">
            {responseTab === "free" ? FREE_RESPONSE : PAID_RESPONSE}
          </pre>
        </div>

        {/* Error Codes */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Error Codes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 pr-4 text-gray-400">Status</th>
                  <th className="py-2 text-gray-400">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-2 pr-4 font-mono">400</td>
                  <td className="py-2">Missing or invalid token mint address</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 pr-4 font-mono">401</td>
                  <td className="py-2">Invalid API key</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 pr-4 font-mono">404</td>
                  <td className="py-2">Token mint account not found on Solana</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 pr-4 font-mono">429</td>
                  <td className="py-2">Rate limit or daily limit exceeded</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">500</td>
                  <td className="py-2">Internal server error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Trading Bots</h3>
              <p className="text-gray-400 text-sm">
                Screen tokens before buying. Reject tokens with active mint authority, low liquidity, or high risk scores automatically.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Portfolio Dashboards</h3>
              <p className="text-gray-400 text-sm">
                Enrich your portfolio tracker with real-time safety data and risk scores for every token in a wallet.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Token Alerts</h3>
              <p className="text-gray-400 text-sm">
                Monitor new token launches and alert users when a token passes safety checks. Filter out rugs before your users see them.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Research Tools</h3>
              <p className="text-gray-400 text-sm">
                Build token research platforms with automated safety analysis. Aggregate data from multiple sources in one call.
              </p>
            </div>
          </div>
        </div>

        {/* Telegram Bot CTA */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 mb-8 border border-blue-800/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Prefer manual scanning?</h3>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Use our Telegram bot for interactive token scans, whale alerts, copy trading, sniping, and more -- all from your phone.
          </p>
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Open @solscanitbot on Telegram
          </a>
          <p className="text-gray-500 text-sm mt-3">
            44 commands | Whale tracker | Volume bot | Premium signals
          </p>
        </div>

        {/* Bot Source CTA */}
        <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-6 border border-green-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Need a full trading bot?</h3>
          <p className="text-gray-300 text-sm mb-3">
            Get the complete Solana Telegram bot source code -- 4,300+ lines with 44 commands, copy trading, sniping, DCA, and more.
          </p>
          <a
            href="/sol-bot-source"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors"
          >
            Sol Bot Source Code -- 2 SOL
          </a>
        </div>
      </div>
    </div>
  );
}
