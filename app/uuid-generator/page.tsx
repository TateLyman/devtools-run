"use client";
import { useState } from "react";

function generateUUID(): string {
  return crypto.randomUUID();
}

export default function UUIDGenerator() {
  const [count, setCount] = useState(1);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => [generateUUID()]);
  const [copied, setCopied] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const generate = () => {
    const generated = Array.from({ length: count }, generateUUID);
    setUuids(generated);
  };

  const format = (uuid: string) => {
    let result = hyphens ? uuid : uuid.replace(/-/g, "");
    return uppercase ? result.toUpperCase() : result;
  };

  const copyOne = (i: number) => {
    navigator.clipboard.writeText(format(uuids[i]));
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.map(format).join("\n"));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">UUID Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate random UUID v4 identifiers. Bulk generate up to 100 at once. Free online UUID/GUID generator.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm">Count:</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm text-center" />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={hyphens} onChange={() => setHyphens(!hyphens)} className="accent-purple-500" />
          Hyphens
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={uppercase} onChange={() => setUppercase(!uppercase)} className="accent-purple-500" />
          Uppercase
        </label>
        <button onClick={generate} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold text-sm">Generate</button>
        <button onClick={copyAll} className="text-sm text-purple-400 hover:text-purple-300 ml-auto">{allCopied ? "All Copied!" : "Copy All"}</button>
      </div>

      <div className="space-y-1.5">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2">
            <code className="flex-1 font-mono text-sm text-white select-all">{format(uuid)}</code>
            <button onClick={() => copyOne(i)} className="text-xs text-purple-400 hover:text-purple-300 whitespace-nowrap">{copied === i ? "Copied!" : "Copy"}</button>
          </div>
        ))}
      </div>

      <div className="text-xs text-[var(--text-secondary)]">
        UUID v4 generated using <code>crypto.randomUUID()</code> — cryptographically secure.
      </div>
    </div>
  );
}
