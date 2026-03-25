"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Token {
  name: string;
  symbol: string;
  coingeckoId?: string;
}

interface Props {
  fromId: string;
  toId: string;
  fromToken: Token;
  toToken: Token;
  allTokens: (Token & { id: string })[];
}

export default function PriceClient({ fromId, toId, fromToken, toToken, allTokens }: Props) {
  const [amount, setAmount] = useState("1");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        // Try CoinGecko for crypto pairs
        if (fromToken.coingeckoId && toToken.coingeckoId) {
          const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromToken.coingeckoId}&vs_currencies=usd`);
          const data = await res.json();
          const fromUsd = data[fromToken.coingeckoId]?.usd;

          const res2 = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${toToken.coingeckoId}&vs_currencies=usd`);
          const data2 = await res2.json();
          const toUsd = data2[toToken.coingeckoId]?.usd;

          if (fromUsd && toUsd) {
            setRate(fromUsd / toUsd);
          }
        } else if (fromToken.coingeckoId) {
          // Crypto to fiat
          const currency = toId === "usd" ? "usd" : toId === "eur" ? "eur" : toId === "gbp" ? "gbp" : toId === "jpy" ? "jpy" : toId === "aud" ? "aud" : toId === "cad" ? "cad" : toId === "inr" ? "inr" : "usd";
          const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromToken.coingeckoId}&vs_currencies=${currency}`);
          const data = await res.json();
          const price = data[fromToken.coingeckoId]?.[currency];
          if (price) setRate(price);
        } else if (toToken.coingeckoId) {
          // Fiat to crypto
          const currency = fromId === "usd" ? "usd" : fromId === "eur" ? "eur" : fromId === "gbp" ? "gbp" : fromId === "jpy" ? "jpy" : fromId === "aud" ? "aud" : fromId === "cad" ? "cad" : fromId === "inr" ? "inr" : "usd";
          const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${toToken.coingeckoId}&vs_currencies=${currency}`);
          const data = await res.json();
          const price = data[toToken.coingeckoId]?.[currency];
          if (price) setRate(1 / price);
        } else {
          // Stablecoin or fiat pair — approximate
          setRate(1);
        }
      } catch {
        setRate(null);
      }
      setLoading(false);
    };
    fetchPrice();
  }, [fromId, toId, fromToken.coingeckoId, toToken.coingeckoId]);

  const result = rate && amount ? parseFloat(amount) * rate : null;

  // Related pairs
  const related = allTokens
    .filter((t) => t.id !== fromId && t.id !== toId)
    .slice(0, 12)
    .map((t) => ({ from: fromId, to: t.id, label: `${fromToken.symbol}/${t.symbol}` }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{fromToken.name} to {toToken.name} Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert {fromToken.name} ({fromToken.symbol}) to {toToken.name} ({toToken.symbol}) with live prices. Free {fromToken.symbol}/{toToken.symbol} calculator.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">{fromToken.symbol}</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-4 py-3 text-white text-xl font-mono"
                min={0}
                step="any"
              />
            </div>

            <div className="flex justify-center">
              <Link href={`/price/${toId}-to-${fromId}`} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-full w-10 h-10 flex items-center justify-center text-purple-400 hover:text-white">↕</Link>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">{toToken.symbol}</label>
              <div className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-4 py-3 text-emerald-400 text-xl font-mono">
                {loading ? "Loading..." : result !== null ? result < 0.000001 ? result.toExponential(6) : result < 1 ? result.toFixed(8) : result.toLocaleString("en-US", { maximumFractionDigits: 6 }) : "N/A"}
              </div>
            </div>
          </div>

          {rate && (
            <p className="text-center text-sm text-gray-400 mt-3">
              1 {fromToken.symbol} = {rate < 0.000001 ? rate.toExponential(4) : rate < 1 ? rate.toFixed(8) : rate.toLocaleString("en-US", { maximumFractionDigits: 6 })} {toToken.symbol}
            </p>
          )}
        </div>

        {rate && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-sm mb-2">Quick Reference</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[0.1, 0.5, 1, 5, 10, 25, 50, 100, 500, 1000].map((a) => (
                <div key={a} className="flex justify-between py-0.5">
                  <span className="text-gray-400">{a} {fromToken.symbol}</span>
                  <span className="text-white font-mono">{(a * rate).toLocaleString("en-US", { maximumFractionDigits: 6 })} {toToken.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="font-bold text-sm mb-3">About {fromToken.name}</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {fromToken.name} ({fromToken.symbol}) is a {fromToken.coingeckoId ? "cryptocurrency" : "currency"}.
            This converter shows the live exchange rate from {fromToken.symbol} to {toToken.symbol}.
            Prices are fetched from CoinGecko and updated in real-time.
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            To convert {fromToken.symbol} to {toToken.symbol}, simply enter the amount above.
            The converter uses real-time market data to give you the most accurate conversion.
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-3">More {fromToken.symbol} Conversions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {related.map((r) => (
            <Link key={r.to} href={`/price/${r.from}-to-${r.to}`} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-center text-xs text-[var(--text-secondary)] hover:text-white hover:border-purple-500/50">{r.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
