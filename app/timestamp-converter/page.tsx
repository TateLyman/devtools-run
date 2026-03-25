"use client";
import { useState, useEffect } from "react";

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [input, setInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentDate = new Date(now * 1000);

  // Parse timestamp input
  let parsedFromTs: Date | null = null;
  if (input.trim()) {
    const num = parseInt(input.trim());
    if (!isNaN(num)) {
      parsedFromTs = num > 1e12 ? new Date(num) : new Date(num * 1000);
    }
  }

  // Parse date input
  let parsedFromDate: number | null = null;
  if (dateInput.trim()) {
    const d = new Date(dateInput.trim());
    if (!isNaN(d.getTime())) parsedFromDate = Math.floor(d.getTime() / 1000);
  }

  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Unix Timestamp Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert between Unix timestamps and human-readable dates. Live clock. Supports seconds and milliseconds.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
        <p className="text-xs text-gray-400 mb-1">Current Unix Timestamp</p>
        <p className="text-4xl font-mono font-bold text-purple-400 cursor-pointer" onClick={() => copy(now.toString(), "now")}>{now}</p>
        <p className="text-sm text-[var(--text-secondary)] mt-2">{currentDate.toUTCString()}</p>
        <p className="text-sm text-[var(--text-secondary)]">{currentDate.toLocaleString()}</p>
        <button onClick={() => copy(now.toString(), "now")} className="mt-2 text-xs text-purple-400 hover:text-purple-300">{copied === "now" ? "Copied!" : "Click to copy"}</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <h2 className="font-bold">Timestamp → Date</h2>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Unix timestamp..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white font-mono" />
          {parsedFromTs && !isNaN(parsedFromTs.getTime()) && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">UTC:</span>
                <span className="text-white font-mono">{parsedFromTs.toUTCString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Local:</span>
                <span className="text-white font-mono">{parsedFromTs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ISO 8601:</span>
                <span className="text-white font-mono cursor-pointer" onClick={() => copy(parsedFromTs!.toISOString(), "iso")}>{parsedFromTs.toISOString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Relative:</span>
                <span className="text-white">{formatRelative(parsedFromTs, new Date())}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <h2 className="font-bold">Date → Timestamp</h2>
          <input type="datetime-local" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
          {parsedFromDate !== null && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Seconds:</span>
                <span className="text-white font-mono cursor-pointer" onClick={() => copy(parsedFromDate!.toString(), "sec")}>{parsedFromDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Milliseconds:</span>
                <span className="text-white font-mono cursor-pointer" onClick={() => copy((parsedFromDate! * 1000).toString(), "ms")}>{parsedFromDate * 1000}</span>
              </div>
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Now", ts: Math.floor(Date.now() / 1000) },
              { label: "Start of day", ts: Math.floor(new Date().setHours(0, 0, 0, 0) / 1000) },
              { label: "Start of year", ts: Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000) },
              { label: "+1 hour", ts: Math.floor(Date.now() / 1000) + 3600 },
              { label: "+1 day", ts: Math.floor(Date.now() / 1000) + 86400 },
              { label: "+1 week", ts: Math.floor(Date.now() / 1000) + 604800 },
            ].map((p) => (
              <button key={p.label} onClick={() => setInput(p.ts.toString())} className="px-2 py-1 rounded text-xs bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white">{p.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRelative(date: Date, now: Date): string {
  const diff = (now.getTime() - date.getTime()) / 1000;
  const abs = Math.abs(diff);
  const future = diff < 0;
  const prefix = future ? "in " : "";
  const suffix = future ? "" : " ago";

  if (abs < 60) return `${prefix}${Math.round(abs)} seconds${suffix}`;
  if (abs < 3600) return `${prefix}${Math.round(abs / 60)} minutes${suffix}`;
  if (abs < 86400) return `${prefix}${Math.round(abs / 3600)} hours${suffix}`;
  if (abs < 2592000) return `${prefix}${Math.round(abs / 86400)} days${suffix}`;
  if (abs < 31536000) return `${prefix}${Math.round(abs / 2592000)} months${suffix}`;
  return `${prefix}${Math.round(abs / 31536000)} years${suffix}`;
}
