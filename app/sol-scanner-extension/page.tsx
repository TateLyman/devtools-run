import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOL Scanner Chrome Extension — Instant Token Risk Analysis",
  description: "Scan any Solana token for rug pull risks directly from DexScreener, Birdeye, and Solscan. Checks mint authority, freeze authority, holder concentration. Free Chrome extension.",
  keywords: ["Solana token scanner", "rug pull checker", "DexScreener extension", "crypto safety", "token risk analysis", "Solana Chrome extension"],
};

export default function SolScannerExtension() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-block bg-emerald-900/50 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-700/50 mb-4">
          FREE CHROME EXTENSION
        </div>
        <h1 className="text-4xl font-bold mb-4">SOL Scanner</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Instant Solana token risk analysis. Works on DexScreener, Birdeye, and Solscan. Scan any token in one click.
        </p>
        <div className="mt-6">
          <a href="https://github.com/TateLyman/sol-scanner-extension" target="_blank" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-2">
            Get Extension (Free)
          </a>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold text-lg mb-2">Auto-Detect Tokens</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Opens on DexScreener, Birdeye, or Solscan? The extension automatically detects the token and scans it.
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <h3 className="font-bold text-lg mb-2">6-Point Safety Check</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Mint authority, freeze authority, metadata mutability, holder concentration, supply analysis, holder count.
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-bold text-lg mb-2">Instant Results</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Risk score 0-100 with detailed breakdown. Know if a token is safe before you ape in.
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">What It Checks</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { check: "Mint Authority", desc: "Is the team able to mint unlimited new tokens? (Revoked = safe)" },
            { check: "Freeze Authority", desc: "Can the team freeze your tokens in your wallet? (Revoked = safe)" },
            { check: "Metadata Mutability", desc: "Can the team change the token name, image, or description?" },
            { check: "Top Holder Concentration", desc: "Does one wallet hold >50% of supply? (Whale risk)" },
            { check: "Holder Count", desc: "How many unique wallets hold this token?" },
            { check: "Total Supply", desc: "What's the total token supply?" },
          ].map((item) => (
            <div key={item.check} className="flex items-start gap-2 text-sm">
              <span className="text-emerald-400 shrink-0">✓</span>
              <div>
                <span className="font-bold text-white">{item.check}</span>
                <span className="text-[var(--text-secondary)]"> — {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">How to Install</h2>
        <ol className="space-y-2 text-sm">
          <li className="flex items-start gap-2"><span className="text-purple-400 font-bold">1.</span> Clone: <code className="bg-[var(--bg-primary)] px-2 py-0.5 rounded text-xs">git clone https://github.com/TateLyman/sol-scanner-extension</code></li>
          <li className="flex items-start gap-2"><span className="text-purple-400 font-bold">2.</span> Open <code className="bg-[var(--bg-primary)] px-2 py-0.5 rounded text-xs">chrome://extensions</code> in Chrome</li>
          <li className="flex items-start gap-2"><span className="text-purple-400 font-bold">3.</span> Enable "Developer mode" (top right)</li>
          <li className="flex items-start gap-2"><span className="text-purple-400 font-bold">4.</span> Click "Load unpacked" → select the cloned folder</li>
          <li className="flex items-start gap-2"><span className="text-purple-400 font-bold">5.</span> Visit any token on DexScreener or Birdeye — the scan button appears automatically!</li>
        </ol>
      </section>

      <section className="text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Also available: <a href="/is-safe" className="text-purple-400">Web-based token scanner</a> · <a href="https://t.me/solscanitbot" className="text-purple-400">Telegram bot scanner</a>
        </p>
      </section>
    </div>
  );
}
