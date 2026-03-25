"use client";
import { useState } from "react";

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function encode(num: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  while (num > 0) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result || "a";
}

interface ShortenedLink {
  original: string;
  short: string;
  created: string;
}

export default function LinkShortener() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  const shorten = () => {
    if (!url.trim()) return;
    let fullUrl = url.trim();
    if (!fullUrl.startsWith("http")) fullUrl = "https://" + fullUrl;

    const code = alias.trim() || encode(hashCode(fullUrl + Date.now()));
    // Use a redirect via the site itself
    const short = `devtools.run/go/${code}`;

    const link: ShortenedLink = {
      original: fullUrl,
      short,
      created: new Date().toLocaleString(),
    };

    // Store in localStorage for the redirect page to find
    const stored = JSON.parse(localStorage.getItem("dt_links") || "{}");
    stored[code] = fullUrl;
    localStorage.setItem("dt_links", JSON.stringify(stored));

    setLinks([link, ...links]);
    setUrl("");
    setAlias("");
  };

  const copyLink = (i: number) => {
    navigator.clipboard.writeText("https://" + links[i].short);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const showQR = (url: string) => {
    setQr(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://" + url)}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Link Shortener</h1>
        <p className="text-[var(--text-secondary)]">
          Shorten URLs with custom aliases. Generate QR codes. Track your links. Free, no signup.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
        <div className="flex gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-4 py-3 text-white"
            onKeyDown={(e) => e.key === "Enter" && shorten()}
          />
          <button onClick={shorten} disabled={!url.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold whitespace-nowrap">
            Shorten
          </button>
        </div>
        <div className="mt-3">
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
            placeholder="Custom alias (optional) — e.g. my-link"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-4 py-2 text-white text-sm"
          />
        </div>
      </div>

      {links.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-lg">Your Links</h2>
          {links.map((link, i) => (
            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-purple-400 font-mono font-bold">{link.short}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">{link.original}</p>
                <p className="text-xs text-gray-500 mt-1">{link.created}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copyLink(i)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">
                  {copied === i ? "Copied!" : "Copy"}
                </button>
                <button onClick={() => showQR(link.short)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">
                  QR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {qr && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setQr(null)}>
          <div className="bg-white rounded-lg p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <img src={qr} alt="QR Code" className="mx-auto" width={200} height={200} />
            <button onClick={() => setQr(null)} className="mt-4 px-4 py-2 bg-gray-800 text-white rounded">Close</button>
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">Features</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Custom aliases for branded short links</li>
          <li>QR code generation for any link</li>
          <li>Links stored locally in your browser</li>
          <li>No tracking, no ads, no signup required</li>
        </ul>
      </div>
    </div>
  );
}
