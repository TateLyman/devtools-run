"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PRICE_SOL = 0.5;

const EXAMPLE_RESPONSE = `{
  "success": true,
  "data": {
    "mint": "So11111111111111111111111111111111111111112",
    "name": "Wrapped SOL",
    "symbol": "SOL",
    "decimals": 9,
    "supply": 573892847.38,
    "mintAuthority": {
      "status": "RENOUNCED",
      "address": null
    },
    "freezeAuthority": {
      "status": "RENOUNCED",
      "address": null
    },
    "price": { "usd": 142.35 },
    "market": {
      "liquidityUsd": 285000000,
      "volume24hUsd": 1200000000,
      "pairCount": 150,
      "topPairUrl": "https://dexscreener.com/solana/..."
    },
    "risk": {
      "score": 0,
      "level": "LOW",
      "reasons": []
    }
  },
  "timestamp": "2026-03-15T12:00:00.000Z"
}`;

export default function ApiAccessPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [txSig, setTxSig] = useState("");
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"curl" | "js" | "python">("curl");

  async function registerKey() {
    if (!txSig.trim() || !email.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/scan/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txSig: txSig.trim(), email: email.trim() }),
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

  const curlExample = `curl "https://devtools.run/api/scan?mint=TOKEN_MINT&apiKey=YOUR_API_KEY"`;

  const jsExample = `const res = await fetch(
  "https://devtools.run/api/scan?mint=TOKEN_MINT&apiKey=YOUR_API_KEY"
);
const data = await res.json();

if (data.success) {
  console.log(\`\${data.data.name} (\${data.data.symbol})\`);
  console.log(\`Price: $\${data.data.price.usd}\`);
  console.log(\`Risk: \${data.data.risk.level} (\${data.data.risk.score}/100)\`);
  console.log(\`Liquidity: $\${data.data.market.liquidityUsd.toLocaleString()}\`);
} else {
  console.error(data.error);
}`;

  const pythonExample = [
    'import requests',
    '',
    'url = "https://devtools.run/api/scan"',
    'params = {',
    '    "mint": "TOKEN_MINT",',
    '    "apiKey": "YOUR_API_KEY"',
    '}',
    '',
    'res = requests.get(url, params=params)',
    'data = res.json()',
    '',
    'if data.get("success"):',
    '    token = data["data"]',
    '    print(f"{token[\'name\']} ({token[\'symbol\']})")',
    '    print(f"Price: ${token[\'price\'][\'usd\']}")',
    '    print(f"Risk: {token[\'risk\'][\'level\']} ({token[\'risk\'][\'score\']}/100)")',
    '    liq = f"{token[\'market\'][\'liquidityUsd\']:,.0f}"',
    '    print(f"Liquidity: ${liq}")',
    'else:',
    '    print(f"Error: {data.get(\'error\')}")',
  ].join('\n');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Solana Token Scanner API
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Comprehensive token safety data in a single API call. Mint authority, freeze authority, liquidity, volume, price, and risk scoring.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Powered by Solana RPC, Jupiter, and DexScreener
          </p>
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get API Key -- {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-2">1,000 requests/month. 10 req/min rate limit.</p>
        </div>

        {/* Payment Flow */}
        {showPayment && !apiKey && (
          <div className="bg-gray-900 rounded-xl p-8 mb-12 border border-blue-800/50">
            <h2 className="text-xl font-bold mb-4 text-center">Pay with SOL</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300 mb-2">
                  Send <strong>{PRICE_SOL} SOL</strong> to:
                </p>
                <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm break-all select-all border border-gray-700">
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
                <label className="text-gray-300 mb-2 block">
                  Transaction signature:
                </label>
                <input
                  type="text"
                  value={txSig}
                  onChange={(e) => setTxSig(e.target.value)}
                  placeholder="Paste transaction signature..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={registerKey}
                disabled={verifying || !txSig.trim() || !email.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {verifying ? "Verifying..." : "Verify Payment & Get API Key"}
              </button>
            </div>
          </div>
        )}

        {/* API Key Display */}
        {apiKey && (
          <div className="bg-blue-900/30 border border-blue-600 rounded-xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Payment Verified!
            </h2>
            <p className="text-gray-300 mb-4">
              Your API key is ready. Save it somewhere safe -- it will not be shown again.
            </p>
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
              1,000 requests/month | 10 requests/minute
            </p>
          </div>
        )}

        {/* Endpoint Documentation */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">API Reference</h2>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-blue-400">Endpoint</h3>
            <pre className="text-sm">GET /api/scan?mint=&lt;TOKEN_ADDRESS&gt;&amp;apiKey=&lt;YOUR_KEY&gt;</pre>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-blue-400">Parameters</h3>
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
                    <td className="py-2 pr-4 font-mono text-blue-300">mint</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Solana token mint address</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-blue-300">apiKey</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Your API key</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-blue-400">Response Fields</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 pr-4 text-gray-400">Field</th>
                    <th className="py-2 text-gray-400">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.name</td>
                    <td className="py-2">Token name</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.symbol</td>
                    <td className="py-2">Token symbol</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.decimals</td>
                    <td className="py-2">Token decimal places</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.supply</td>
                    <td className="py-2">Adjusted total supply</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.mintAuthority.status</td>
                    <td className="py-2">ACTIVE or RENOUNCED</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.freezeAuthority.status</td>
                    <td className="py-2">ACTIVE or RENOUNCED</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.price.usd</td>
                    <td className="py-2">Current price in USD (Jupiter)</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.market.liquidityUsd</td>
                    <td className="py-2">Total liquidity across all pairs</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.market.volume24hUsd</td>
                    <td className="py-2">24-hour trading volume</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.risk.score</td>
                    <td className="py-2">Risk score from 0 (safe) to 100 (dangerous)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-sm text-blue-300">data.risk.level</td>
                    <td className="py-2">LOW, MEDIUM, or HIGH</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-blue-400">Risk Scoring</h3>
            <p className="text-gray-400 text-sm mb-3">
              The risk score (0-100) is calculated from multiple safety signals:
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

          <div>
            <h3 className="text-lg font-bold mb-2 text-blue-400">Error Codes</h3>
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
                    <td className="py-2">Missing or invalid mint address</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono">401</td>
                    <td className="py-2">Missing or invalid API key</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono">404</td>
                    <td className="py-2">Token mint account not found</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4 font-mono">429</td>
                    <td className="py-2">Rate limit or monthly limit exceeded</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">500</td>
                    <td className="py-2">Internal server error</td>
                  </tr>
                </tbody>
              </table>
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

          <pre className="text-sm leading-relaxed">
            {activeTab === "curl" && curlExample}
            {activeTab === "js" && jsExample}
            {activeTab === "python" && pythonExample}
          </pre>
        </div>

        {/* Example Response */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Example Response</h2>
          <pre className="text-sm leading-relaxed text-green-300">{EXAMPLE_RESPONSE}</pre>
        </div>

        {/* Limits */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-blue-400">1,000</p>
              <p className="text-gray-400 text-sm mt-1">Requests per month</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-blue-400">10</p>
              <p className="text-gray-400 text-sm mt-1">Requests per minute</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4 text-center">
            Monthly counter resets on the 1st. Need higher limits? Purchase additional API keys.
          </p>
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

        {/* CTA */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get API Key -- {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-2">
            One-time payment. Instant delivery. No subscription.
          </p>
        </div>

        {/* Cross-sell */}
        <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-6 border border-green-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Need a full trading bot?</h3>
          <p className="text-gray-300 text-sm mb-3">
            Get the complete Solana Telegram bot source code -- 4,100+ lines with 42 commands, copy trading, sniping, DCA, and more.
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
