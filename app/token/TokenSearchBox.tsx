"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TokenSearchBox() {
  const [mintInput, setMintInput] = useState("");
  const router = useRouter();

  function handleSearch() {
    const address = mintInput.trim();
    if (!address) return;
    router.push(`/token/${address}`);
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        Paste Token Mint Address
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={mintInput}
          onChange={(e) => setMintInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
          className="flex-1"
        />
        <button
          onClick={handleSearch}
          className="px-5 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors shrink-0"
        >
          Check Token
        </button>
      </div>
      <p className="text-xs text-[var(--text-secondary)] mt-1.5">
        Enter any Solana token contract address to view its safety report
      </p>
    </div>
  );
}
