"use client";

import { useState } from "react";

interface TokenAccount {
  mint: string;
  amount: string;
  decimals: number;
}

interface Transaction {
  signature: string;
  slot: number;
  blockTime: number | null;
  err: unknown | null;
}

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`RPC error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "RPC error");
  return data.result;
}

export default function SolWalletPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [tokens, setTokens] = useState<TokenAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = address.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setSolBalance(null);
    setSolPrice(null);
    setTokens([]);
    setTransactions([]);
    setSearched(false);

    try {
      // Fetch all data in parallel
      const [balanceResult, tokenResult, txResult, priceResult] =
        await Promise.allSettled([
          rpcCall("getBalance", [trimmed]),
          rpcCall("getTokenAccountsByOwner", [
            trimmed,
            { programId: TOKEN_PROGRAM_ID },
            { encoding: "jsonParsed" },
          ]),
          rpcCall("getSignaturesForAddress", [trimmed, { limit: 10 }]),
          fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
          ).then((r) => r.json()),
        ]);

      // Balance
      if (balanceResult.status === "fulfilled") {
        setSolBalance(balanceResult.value.value / 1e9);
      }

      // SOL price
      if (priceResult.status === "fulfilled") {
        setSolPrice(priceResult.value?.solana?.usd ?? null);
      }

      // Token accounts
      if (tokenResult.status === "fulfilled" && tokenResult.value?.value) {
        const parsed: TokenAccount[] = tokenResult.value.value
          .map(
            (acct: {
              account: {
                data: {
                  parsed: {
                    info: {
                      mint: string;
                      tokenAmount: { amount: string; decimals: number };
                    };
                  };
                };
              };
            }) => {
              const info = acct.account.data.parsed.info;
              return {
                mint: info.mint,
                amount: info.tokenAmount.amount,
                decimals: info.tokenAmount.decimals,
              };
            }
          )
          .filter((t: TokenAccount) => t.amount !== "0")
          .sort(
            (a: TokenAccount, b: TokenAccount) =>
              Number(b.amount) / 10 ** b.decimals -
              Number(a.amount) / 10 ** a.decimals
          )
          .slice(0, 20);
        setTokens(parsed);
      }

      // Transactions
      if (txResult.status === "fulfilled" && Array.isArray(txResult.value)) {
        setTransactions(
          txResult.value.map(
            (tx: {
              signature: string;
              slot: number;
              blockTime: number | null;
              err: unknown | null;
            }) => ({
              signature: tx.signature,
              slot: tx.slot,
              blockTime: tx.blockTime,
              err: tx.err,
            })
          )
        );
      }

      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch wallet data. Check the address and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatTokenAmount(amount: string, decimals: number): string {
    const num = Number(amount) / 10 ** decimals;
    if (num >= 1_000_000) return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (num >= 1) return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  }

  function shortenSig(sig: string): string {
    return sig.slice(0, 8) + "..." + sig.slice(-8);
  }

  function shortenMint(mint: string): string {
    return mint.slice(0, 6) + "..." + mint.slice(-4);
  }

  function formatTime(blockTime: number | null): string {
    if (!blockTime) return "—";
    return new Date(blockTime * 1000).toLocaleString();
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Solana Wallet Checker</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Check any Solana wallet&apos;s SOL balance, token holdings, and recent
          transactions.
        </p>
      </div>

      {/* AD SLOT - Top */}
      <div className="ad-slot mb-6">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      {/* Search form */}
      <form onSubmit={handleLookup} className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Wallet Address
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter a Solana wallet address..."
            className="flex-1 text-sm font-mono"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
          >
            {loading ? "Loading..." : "Look Up"}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 mb-6">
          {error}
        </div>
      )}

      {searched && solBalance !== null && (
        <>
          {/* SOL Balance Card */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-sm text-[var(--text-secondary)]">
                  SOL Balance:
                </span>
                <span className="ml-2 text-xl font-bold text-[var(--accent)]">
                  {solBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 9,
                  })}{" "}
                  SOL
                </span>
              </div>
              {solPrice !== null && (
                <div className="text-right">
                  <span className="text-sm text-[var(--text-secondary)]">
                    USD Value:
                  </span>
                  <span className="ml-2 text-lg font-semibold text-white">
                    $
                    {(solBalance * solPrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    @ $
                    {solPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    / SOL
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Token Holdings */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">
              SPL Token Holdings
            </h2>
            {tokens.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">
                No SPL token accounts found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
                      <th className="pb-2 pr-4 font-medium">Token Mint</th>
                      <th className="pb-2 pr-4 font-medium text-right">
                        Balance
                      </th>
                      <th className="pb-2 font-medium text-right">Decimals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token) => (
                      <tr
                        key={token.mint}
                        className="border-b border-[var(--border)] last:border-0"
                      >
                        <td className="py-2 pr-4 font-mono">
                          <a
                            href={`https://solscan.io/token/${token.mint}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--accent)] hover:underline"
                            title={token.mint}
                          >
                            {shortenMint(token.mint)}
                          </a>
                        </td>
                        <td className="py-2 pr-4 text-right font-mono">
                          {formatTokenAmount(token.amount, token.decimals)}
                        </td>
                        <td className="py-2 text-right text-[var(--text-secondary)]">
                          {token.decimals}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">
              Recent Transactions
            </h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">
                No recent transactions found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
                      <th className="pb-2 pr-4 font-medium">Signature</th>
                      <th className="pb-2 pr-4 font-medium">Time</th>
                      <th className="pb-2 pr-4 font-medium text-right">
                        Slot
                      </th>
                      <th className="pb-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.signature}
                        className="border-b border-[var(--border)] last:border-0"
                      >
                        <td className="py-2 pr-4 font-mono">
                          <a
                            href={`https://solscan.io/tx/${tx.signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--accent)] hover:underline"
                            title={tx.signature}
                          >
                            {shortenSig(tx.signature)}
                          </a>
                        </td>
                        <td className="py-2 pr-4 text-[var(--text-secondary)] whitespace-nowrap">
                          {formatTime(tx.blockTime)}
                        </td>
                        <td className="py-2 pr-4 text-right text-[var(--text-secondary)] font-mono">
                          {tx.slot.toLocaleString()}
                        </td>
                        <td className="py-2 text-right">
                          {tx.err ? (
                            <span className="text-red-400">Failed</span>
                          ) : (
                            <span className="text-green-400">Success</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* AD SLOT - Bottom */}
      <div className="ad-slot mt-8">
        {/* AD SLOT: in-content ad */}
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Solana Wallet Checker
        </h2>
        <p>
          This tool queries the public Solana mainnet RPC to fetch wallet
          balances, SPL token holdings, and recent transaction history. All
          requests are made directly from your browser &mdash; no data is stored
          or sent to any third-party server. USD conversion uses the CoinGecko
          API.
        </p>
      </section>
    </>
  );
}
