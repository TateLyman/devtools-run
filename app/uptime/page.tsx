"use client";
import { useState } from "react";

export default function UptimePage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  async function check() {
    if (!url) return;
    setChecking(true);
    const start = Date.now();
    try {
      const res = await fetch(url.startsWith("http") ? url : `https://${url}`, {
        mode: "no-cors",
        signal: AbortSignal.timeout(10000),
      });
      setResult({ status: "up", latency: Date.now() - start, url });
    } catch {
      setResult({ status: "down", latency: Date.now() - start, url });
    }
    setChecking(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-emerald-400 mb-3 tracking-widest uppercase">Uptime Monitor</div>
          <h1 className="text-5xl font-extrabold mb-4">Is Your Website Up?</h1>
          <p className="text-xl text-gray-400">Check any URL right now, or set up 24/7 monitoring with Telegram alerts.</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Check</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://yoursite.com" onKeyDown={e => e.key === "Enter" && check()}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
            <button onClick={check} disabled={checking}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50">
              {checking ? "Checking..." : "Check"}
            </button>
          </div>
          {result && (
            <div className={`rounded-xl p-4 flex items-center gap-4 ${result.status === "up" ? "bg-emerald-900/30 border border-emerald-700" : "bg-red-900/30 border border-red-700"}`}>
              <div className={`w-4 h-4 rounded-full ${result.status === "up" ? "bg-emerald-400" : "bg-red-400"}`} />
              <div>
                <div className="font-bold">{result.url} is {result.status === "up" ? "UP" : "DOWN"}</div>
                <div className="text-sm text-gray-400">Response time: {result.latency}ms</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">24/7 Monitoring Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-lg">Free</h3>
              <div className="text-3xl font-extrabold mt-1 mb-3">$0</div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>&#x2713; 1 URL monitored</li>
                <li>&#x2713; 5-minute check interval</li>
                <li>&#x2713; Telegram alerts</li>
              </ul>
            </div>
            <div className="border border-emerald-500 rounded-xl p-6 ring-2 ring-emerald-500/20">
              <div className="text-xs font-bold text-emerald-400 uppercase mb-1">Popular</div>
              <h3 className="font-bold text-lg">Pro</h3>
              <div className="text-3xl font-extrabold mt-1 mb-3">0.05 SOL<span className="text-sm text-gray-400">/mo</span></div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>&#x2713; 10 URLs monitored</li>
                <li>&#x2713; 1-minute checks</li>
                <li>&#x2713; Telegram + webhook alerts</li>
                <li>&#x2713; Uptime history (30 days)</li>
                <li>&#x2713; Status page for your users</li>
              </ul>
            </div>
            <div className="border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-lg">Business</h3>
              <div className="text-3xl font-extrabold mt-1 mb-3">0.3 SOL<span className="text-sm text-gray-400">/mo</span></div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>&#x2713; 100 URLs</li>
                <li>&#x2713; 30-second checks</li>
                <li>&#x2713; Multi-region monitoring</li>
                <li>&#x2713; Custom status page</li>
                <li>&#x2713; API access</li>
                <li>&#x2713; Priority support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href="https://t.me/solscanitbot" target="_blank"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-xl text-lg">
            Set Up Monitoring
          </a>
          <p className="text-gray-500 mt-4 text-sm">Pay in SOL or Telegram Stars. Cancel anytime.</p>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/rpc-status" className="text-emerald-400 hover:underline">RPC Status</a>{" | "}
          <a href="/ip" className="text-emerald-400 hover:underline">My IP</a>{" | "}
          <a href="/webhooks" className="text-emerald-400 hover:underline">Webhooks</a>{" | "}
          <a href="/sol-pay" className="text-emerald-400 hover:underline">Payments</a>{" | "}
          <a href="/api-access" className="text-emerald-400 hover:underline">API</a>
        </div>
      </div>
    </div>
  );
}
