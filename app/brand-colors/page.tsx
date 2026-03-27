"use client";
import { useState } from "react";
const BRANDS: Record<string, string[]> = {
  "Google": ["#4285F4","#DB4437","#F4B400","#0F9D58"],
  "Facebook": ["#1877F2","#FFFFFF","#898F9C"],
  "Twitter/X": ["#000000","#1D9BF0","#FFFFFF"],
  "GitHub": ["#0D1117","#238636","#1F6FEB","#F78166"],
  "Spotify": ["#1DB954","#191414","#FFFFFF"],
  "Netflix": ["#E50914","#141414","#FFFFFF"],
  "Stripe": ["#635BFF","#0A2540","#FFFFFF"],
  "Vercel": ["#000000","#FFFFFF","#888888"],
  "Tailwind": ["#06B6D4","#0F172A","#F8FAFC"],
  "React": ["#61DAFB","#20232A","#FFFFFF"],
  "Vue": ["#42B883","#35495E","#FFFFFF"],
  "Svelte": ["#FF3E00","#40B3FF","#FFFFFF"],
  "Next.js": ["#000000","#FFFFFF","#666666"],
  "Discord": ["#5865F2","#2C2F33","#99AAB5"],
  "Slack": ["#4A154B","#36C5F0","#2EB67D","#ECB22E","#E01E5A"],
  "Figma": ["#F24E1E","#A259FF","#1ABCFE","#0ACF83","#FF7262"],
};
export default function BrandColors() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");
  const copy = (hex: string) => { navigator.clipboard.writeText(hex); setCopied(hex); setTimeout(() => setCopied(""), 800); };
  const filtered = search ? Object.entries(BRANDS).filter(([name]) => name.toLowerCase().includes(search.toLowerCase())) : Object.entries(BRANDS);
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Brand Colors</h1><p className="text-[var(--text-secondary)]">Color palettes from popular brands {copied && <span className="text-emerald-400">Copied {copied}!</span>}</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brands..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" /></div>
      <div className="space-y-3">
        {filtered.map(([name, colors]) => (
          <div key={name} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="font-bold mb-2">{name}</h2>
            <div className="flex gap-2">
              {colors.map((hex, i) => (
                <button key={i} onClick={() => copy(hex)} className="flex-1 group">
                  <div className="h-12 rounded-lg border border-[var(--border)] hover:scale-105 transition-transform" style={{ backgroundColor: hex }} />
                  <div className="text-xs font-mono text-center mt-1 text-[var(--text-secondary)]">{hex}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
