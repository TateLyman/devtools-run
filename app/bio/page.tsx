"use client";
import { useState } from "react";

const THEMES = [
  { name: "Dark", bg: "#0f0f0f", card: "#1a1a2e", accent: "#6c5ce7" },
  { name: "Ocean", bg: "#0a1628", card: "#112240", accent: "#64ffda" },
  { name: "Forest", bg: "#0d1117", card: "#161b22", accent: "#3fb950" },
  { name: "Sunset", bg: "#1a0a2e", card: "#2d1b69", accent: "#f5af19" },
];

export default function BioPage() {
  const [name, setName] = useState("Your Name");
  const [bio, setBio] = useState("Developer & Creator");
  const [links, setLinks] = useState([
    { label: "Portfolio", url: "https://example.com" },
    { label: "GitHub", url: "https://github.com" },
    { label: "Twitter/X", url: "https://x.com" },
  ]);
  const [wallet, setWallet] = useState("");
  const [theme, setTheme] = useState(0);
  const t = THEMES[theme];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Link in Bio Generator</h1>
          <p className="text-gray-400">Create your bio page with SOL tip button. Free alternative to Linktree.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Bio</label>
              <input type="text" value={bio} onChange={e => setBio(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400">SOL Wallet (for tips)</label>
              <input type="text" value={wallet} onChange={e => setWallet(e.target.value)}
                placeholder="Your Solana address for receiving tips"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Theme</label>
              <div className="flex gap-2">
                {THEMES.map((th, i) => (
                  <button key={i} onClick={() => setTheme(i)}
                    className={`px-3 py-1 rounded text-xs font-bold ${theme === i ? "ring-2 ring-white" : ""}`}
                    style={{ backgroundColor: th.accent, color: "#000" }}>{th.name}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400">Links</label>
              {links.map((l, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" value={l.label} onChange={e => { const n=[...links]; n[i].label=e.target.value; setLinks(n); }}
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm w-1/3" placeholder="Label" />
                  <input type="text" value={l.url} onChange={e => { const n=[...links]; n[i].url=e.target.value; setLinks(n); }}
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm flex-1" placeholder="URL" />
                </div>
              ))}
              <button onClick={() => setLinks([...links, { label: "", url: "" }])}
                className="text-xs text-purple-400 hover:underline">+ Add Link</button>
            </div>
          </div>
          <div>
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: t.bg, minHeight: 400 }}>
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: t.card, color: t.accent }}>
                {name[0]?.toUpperCase() || "?"}
              </div>
              <div className="text-xl font-bold" style={{ color: "#fff" }}>{name}</div>
              <div className="text-sm mb-6" style={{ color: "#999" }}>{bio}</div>
              <div className="space-y-3">
                {links.filter(l => l.label && l.url).map((l, i) => (
                  <a key={i} href={l.url} target="_blank"
                    className="block py-3 rounded-xl font-bold text-sm transition-colors hover:opacity-80"
                    style={{ backgroundColor: t.card, color: t.accent, border: `1px solid ${t.accent}33` }}>
                    {l.label}
                  </a>
                ))}
                {wallet && (
                  <a href={`/sol-pay/checkout?to=${wallet}&amount=0.1&label=Tip&fee=NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr&feePct=0.05`}
                    className="block py-3 rounded-xl font-bold text-sm"
                    style={{ backgroundColor: t.accent, color: "#000" }}>
                    Tip 0.1 SOL
                  </a>
                )}
              </div>
              <div className="mt-6 text-xs" style={{ color: "#555" }}>
                Made with <a href="/bio" style={{ color: t.accent }}>Sol Bio</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/sol-pay" className="text-purple-400 hover:underline">Payment Buttons</a>{" | "}
          <a href="/qr" className="text-purple-400 hover:underline">QR Code</a>{" | "}
          <a href="/meta-tags" className="text-purple-400 hover:underline">Meta Tags</a>{" | "}
          <a href="/favicon" className="text-purple-400 hover:underline">Favicon</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>
        </div>
      </div>
    </div>
  );
}
