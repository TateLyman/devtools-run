"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const TIP_ADDRESS = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const PRESET_AMOUNTS = [0.01, 0.05, 0.1, 0.5];

type Status =
  | { type: "idle" }
  | { type: "connecting" }
  | { type: "sending" }
  | { type: "success"; signature: string }
  | { type: "error"; message: string };

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  signAndSendTransaction: (
    transaction: Transaction
  ) => Promise<{ signature: string }>;
  publicKey: PublicKey | null;
}

function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const provider = w.phantom?.solana ?? w.solana;
  if (provider?.isPhantom) return provider as PhantomProvider;
  return null;
}

interface TipButtonProps {
  /** Render a compact inline version (for footer/header) */
  compact?: boolean;
}

export default function TipButton({ compact = false }: TipButtonProps) {
  const [open, setOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [hasPhantom, setHasPhantom] = useState<boolean | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Phantom injects after page load; wait a tick
    const timer = setTimeout(() => {
      setHasPhantom(getPhantom() !== null);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  const sendTip = useCallback(async (amount: number) => {
    const phantom = getPhantom();
    if (!phantom) return;

    try {
      setStatus({ type: "connecting" });
      const resp = await phantom.connect();
      const fromPubkey = resp.publicKey;

      setStatus({ type: "sending" });
      const connection = new Connection(SOLANA_RPC, "confirmed");
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey: new PublicKey(TIP_ADDRESS),
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
        })
      );
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = fromPubkey;

      const { signature } = await phantom.signAndSendTransaction(transaction);
      setStatus({ type: "success", signature });
      setOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Transaction cancelled";
      setStatus({ type: "error", message });
    }
  }, []);

  const handleCustomSend = useCallback(() => {
    const parsed = parseFloat(customAmount);
    if (isNaN(parsed) || parsed <= 0) {
      setStatus({ type: "error", message: "Enter a valid SOL amount" });
      return;
    }
    sendTip(parsed);
  }, [customAmount, sendTip]);

  // -- No Phantom installed --
  if (hasPhantom === false) {
    if (compact) {
      return (
        <a
          href="https://phantom.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          Get Phantom to tip SOL
        </a>
      );
    }
    return (
      <a
        href="https://phantom.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-2 text-sm text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
      >
        Install Phantom to tip SOL
      </a>
    );
  }

  // -- Still detecting --
  if (hasPhantom === null) {
    return null;
  }

  // -- Success / Error toasts --
  const statusBanner =
    status.type === "success" ? (
      <div className="text-xs text-[var(--success)] mt-2">
        Tip sent!{" "}
        <a
          href={`https://solscan.io/tx/${status.signature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white transition-colors"
        >
          View on Solscan
        </a>
      </div>
    ) : status.type === "error" ? (
      <div className="text-xs text-[var(--error)] mt-2">{status.message}</div>
    ) : null;

  // -- Compact version (footer/header) --
  if (compact) {
    return (
      <div className="inline-flex flex-col items-center" ref={dropdownRef}>
        <div className="relative inline-block">
          <button
            onClick={() => {
              setOpen((prev) => !prev);
              setStatus({ type: "idle" });
              setShowCustom(false);
            }}
            disabled={
              status.type === "connecting" || status.type === "sending"
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:border-[var(--accent)] transition-colors disabled:opacity-50"
          >
            {status.type === "connecting"
              ? "Connecting..."
              : status.type === "sending"
                ? "Sending..."
                : "Tip SOL"}
          </button>

          {open && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg z-50 overflow-hidden">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => sendTip(amt)}
                  className="w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  {amt} SOL
                </button>
              ))}
              {!showCustom ? (
                <button
                  onClick={() => setShowCustom(true)}
                  className="w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors border-t border-[var(--border)]"
                >
                  Custom amount...
                </button>
              ) : (
                <div className="flex border-t border-[var(--border)]">
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="SOL"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="flex-1 text-xs px-2 py-2 bg-[var(--bg-tertiary)] border-none rounded-none outline-none min-h-0"
                  />
                  <button
                    onClick={handleCustomSend}
                    className="px-3 py-2 text-xs font-medium text-[var(--accent)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {statusBanner}
      </div>
    );
  }

  // -- Full version (support section) --
  return (
    <div className="flex flex-col items-center" ref={dropdownRef}>
      <div className="relative inline-block">
        <button
          onClick={() => {
            setOpen((prev) => !prev);
            setStatus({ type: "idle" });
            setShowCustom(false);
          }}
          disabled={status.type === "connecting" || status.type === "sending"}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          {status.type === "connecting"
            ? "Connecting wallet..."
            : status.type === "sending"
              ? "Sending tip..."
              : "Tip SOL"}
        </button>

        {open && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-2 text-xs text-[var(--text-secondary)] border-b border-[var(--border)]">
              Select amount
            </div>
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => sendTip(amt)}
                className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                {amt} SOL
              </button>
            ))}
            {!showCustom ? (
              <button
                onClick={() => setShowCustom(true)}
                className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors border-t border-[var(--border)]"
              >
                Custom amount...
              </button>
            ) : (
              <div className="flex border-t border-[var(--border)]">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="SOL"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 text-sm px-3 py-2.5 bg-[var(--bg-tertiary)] border-none rounded-none outline-none min-h-0"
                />
                <button
                  onClick={handleCustomSend}
                  className="px-4 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {statusBanner}
    </div>
  );
}
