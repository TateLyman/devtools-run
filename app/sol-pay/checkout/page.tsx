"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

function CheckoutContent() {
  const params = useSearchParams();
  const to = params.get("to") || "";
  const amount = params.get("amount") || "0";
  const label = params.get("label") || "Payment";
  const feeWallet = params.get("fee") || "";
  const feePct = parseFloat(params.get("feePct") || "0.02");

  const [status, setStatus] = useState<"ready" | "checking" | "success" | "error">("ready");
  const [txSig, setTxSig] = useState("");

  const totalAmount = parseFloat(amount);
  const feeAmount = totalAmount * feePct;
  const netAmount = totalAmount - feeAmount;

  // Generate Solana Pay QR / deep link
  const solanaPayUrl = `solana:${to}?amount=${totalAmount}&label=${encodeURIComponent(label)}`;

  async function checkPayment() {
    setStatus("checking");
    // In production, this would call an API to verify the transaction
    // For now, show instructions
    setTimeout(() => {
      setStatus("ready");
    }, 5000);
  }

  if (!to || !amount) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Payment Link</h1>
          <p className="text-gray-400">This payment link is missing required parameters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-400 mb-1">Pay with Solana</div>
          <div className="text-4xl font-extrabold">{totalAmount} SOL</div>
          <div className="text-gray-400 mt-1">{label}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="text-sm text-gray-400 mb-2">Send exactly:</div>
          <div className="font-mono text-lg font-bold text-green-400 mb-3">
            {totalAmount} SOL
          </div>
          <div className="text-sm text-gray-400 mb-1">To this address:</div>
          <div
            className="font-mono text-xs bg-gray-700 p-3 rounded-lg break-all cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(to);
            }}
          >
            {to}
            <div className="text-gray-500 text-xs mt-1">Click to copy</div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <a
            href={solanaPayUrl}
            className="block text-center py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold transition-colors"
          >
            Open in Wallet App
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(to)}
            className="block w-full text-center py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold transition-colors"
          >
            Copy Address
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>Send from any Solana wallet (Phantom, Solflare, Backpack, etc.)</p>
          <p className="mt-1">
            {feePct > 0
              ? `${(feePct * 100).toFixed(0)}% platform fee included`
              : "No platform fee"}
          </p>
          <p className="mt-2">
            Powered by{" "}
            <a
              href="https://devtools-site-delta.vercel.app/sol-pay"
              className="text-green-400 hover:underline"
            >
              Sol Pay Buttons
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
