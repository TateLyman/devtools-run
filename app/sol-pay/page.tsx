"use client";

import { useState } from "react";

const FEE_WALLET = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const PLATFORM_FEE = 0.02; // 2% platform fee

export default function SolPayPage() {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [generated, setGenerated] = useState("");

  function generate() {
    if (!wallet || !amount) return;
    const params = new URLSearchParams({
      to: wallet,
      amount,
      label: label || "Payment",
      fee: FEE_WALLET,
      feePct: String(PLATFORM_FEE),
    });
    const url = `${window.location.origin}/sol-pay/checkout?${params}`;
    const embedCode = `<a href="${url}" target="_blank" style="display:inline-block;padding:12px 24px;background:#6c5ce7;color:white;border-radius:8px;font-weight:bold;text-decoration:none;font-family:sans-serif">Pay ${amount} SOL</a>`;
    setGenerated(embedCode);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-green-400 mb-3 tracking-widest uppercase">
            Sol Pay Buttons
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            Accept SOL Payments Anywhere
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Generate a payment button in 10 seconds. Embed it on your site,
            blog, or share the link. Buyers pay in SOL. You get paid instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Create Your Button</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Your Solana Wallet Address
                </label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="Your SOL address..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.1"
                  step="0.01"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Button Label (optional)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Premium Access"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
              </div>
              <button
                onClick={generate}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Generate Button
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Preview</h2>
            {generated ? (
              <>
                <div className="mb-4 p-4 bg-gray-800 rounded-lg flex items-center justify-center min-h-[80px]">
                  <div dangerouslySetInnerHTML={{ __html: generated }} />
                </div>
                <div className="mb-4">
                  <label className="text-sm text-gray-400 block mb-1">
                    Embed Code (copy this)
                  </label>
                  <textarea
                    readOnly
                    value={generated}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-green-400 text-xs font-mono h-24 resize-none"
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Paste this HTML anywhere — your website, blog, Notion page,
                  or share the link directly.
                </p>
              </>
            ) : (
              <div className="text-gray-500 text-center py-12">
                Fill in the form to see your payment button
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                n: "1",
                title: "Generate",
                desc: "Enter your wallet address and payment amount",
              },
              {
                n: "2",
                title: "Embed",
                desc: "Copy the HTML code and paste it on your site",
              },
              {
                n: "3",
                title: "Buyer Pays",
                desc: "They click the button and send SOL from any wallet",
              },
              {
                n: "4",
                title: "You Get Paid",
                desc: "SOL arrives in your wallet instantly. On-chain verification.",
              },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center mx-auto mb-3">
                  {s.n}
                </div>
                <div className="font-bold mb-1">{s.title}</div>
                <div className="text-sm text-gray-400">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Pricing</h2>
          <p className="text-gray-300 mb-2">
            <strong>Free to generate buttons.</strong> No signup required.
          </p>
          <p className="text-gray-300 mb-2">
            2% platform fee on each payment (deducted automatically).
          </p>
          <p className="text-gray-300">
            No monthly fees. No minimums. You only pay when you get paid.
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <UseCase
              title="Digital Products"
              desc="Sell ebooks, templates, courses, or software with a simple payment link"
            />
            <UseCase
              title="Freelance Invoices"
              desc="Send a payment link to clients instead of sharing your wallet address"
            />
            <UseCase
              title="Donations & Tips"
              desc="Add a tip button to your blog, GitHub, or social media"
            />
            <UseCase
              title="Token-Gated Access"
              desc="Charge for premium content, Discord access, or API keys"
            />
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          Powered by Solana. Payments verified on-chain. Built by{" "}
          <a
            href="https://t.me/solscanitbot"
            className="text-green-400 hover:underline"
          >
            Sol Scanner
          </a>
          .
        </div>
      </div>
    </div>
  );
}

function UseCase({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
