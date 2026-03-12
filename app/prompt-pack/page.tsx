"use client";

import { useState } from "react";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PRICE_SOL = 0.1;
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

export default function PromptPackPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [txSig, setTxSig] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  async function verifyPayment() {
    if (!txSig.trim()) return;
    setVerifying(true);
    setError("");
    try {
      const res = await fetch(SOLANA_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTransaction",
          params: [txSig.trim(), { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
        }),
      });
      const data = await res.json();
      if (!data.result) {
        setError("Transaction not found. Please wait a moment and try again.");
        setVerifying(false);
        return;
      }

      const instructions = data.result.transaction?.message?.instructions || [];
      let paid = false;
      for (const ix of instructions) {
        if (
          ix.parsed?.type === "transfer" &&
          ix.parsed?.info?.destination === RECIPIENT
        ) {
          const lamports = ix.parsed.info.lamports;
          if (lamports >= PRICE_SOL * 1e9 * 0.95) {
            paid = true;
            break;
          }
        }
      }

      if (paid) {
        setVerified(true);
      } else {
        setError(
          `Transaction found but payment amount insufficient. Expected ${PRICE_SOL} SOL to ${RECIPIENT.slice(0, 8)}...`
        );
      }
    } catch {
      setError("Verification failed. Please try again.");
    }
    setVerifying(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            AI Prompt Engineering Pack
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            50+ battle-tested prompt templates for coding, business, and creative work
          </p>
          <p className="text-2xl font-bold text-purple-400 mb-6">
            Works with ChatGPT, Claude, Gemini &amp; any LLM
          </p>
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get It — {PRICE_SOL} SOL
          </button>
          <p className="text-gray-500 text-sm mt-2">Pay with SOL. Instant delivery.</p>
        </div>

        {showPayment && !verified && (
          <div className="bg-gray-900 rounded-xl p-8 mb-12 border border-purple-800/50">
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
                <p className="text-gray-300 mb-2">
                  After sending, paste your transaction signature below:
                </p>
                <input
                  type="text"
                  value={txSig}
                  onChange={(e) => setTxSig(e.target.value)}
                  placeholder="Paste transaction signature..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button
                onClick={verifyPayment}
                disabled={verifying || !txSig.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {verifying ? "Verifying..." : "Verify Payment & Get Download"}
              </button>
            </div>
          </div>
        )}

        {verified && (
          <div className="bg-purple-900/30 border border-purple-600 rounded-xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Payment Verified!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for your purchase. Download your files below:
            </p>
            <a
              href="https://github.com/TateLyman/ai-prompt-pack/archive/refs/heads/main.zip"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Download Prompt Pack
            </a>
            <p className="text-gray-500 text-sm mt-4">
              Includes all 50+ templates in Markdown format, ready to use.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">15 Software Dev Prompts</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Code review &amp; architecture design</li>
              <li>Security audit &amp; bug fixing</li>
              <li>Refactoring &amp; testing</li>
              <li>Documentation generation</li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">15 Business Prompts</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Customer personas &amp; landing pages</li>
              <li>Competitive analysis &amp; business plans</li>
              <li>Email sequences &amp; sales pitches</li>
              <li>Financial projections</li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">10 Creative Prompts</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Blog posts &amp; newsletters</li>
              <li>Video scripts &amp; podcast outlines</li>
              <li>Course curricula &amp; whitepapers</li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">8 Advanced Techniques</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Chain-of-thought &amp; few-shot learning</li>
              <li>Role prompting &amp; constraint setting</li>
              <li>Meta-prompting &amp; system prompts</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Every Prompt Includes</h2>
          <ul className="space-y-2 text-gray-300">
            <li>Full template with [PLACEHOLDERS] ready to fill in</li>
            <li>When to use it — specific use cases</li>
            <li>Example output — see what you&apos;ll get</li>
            <li>Pro tips for customization</li>
          </ul>
          <p className="text-gray-400 mt-4 text-sm">
            Works with ChatGPT, Claude, Gemini, and any other LLM.
          </p>
        </div>

        <div className="text-center mb-12">
          <button
            onClick={() => setShowPayment(true)}
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Get the Prompt Pack — {PRICE_SOL} SOL
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Want to trade Solana from Telegram?</h3>
          <p className="text-gray-300 text-sm mb-3">Buy, sell, copy trade, snipe, DCA — 40+ commands. MEV-protected. 0.5% fees with Premium.</p>
          <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Open @solscanitbot</a>
        </div>
      </div>
    </div>
  );
}
