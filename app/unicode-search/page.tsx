"use client";
import { useState } from "react";

const CHARS: [string, string, string][] = [
  ["→","Right Arrow","arrows"],["←","Left Arrow","arrows"],["↑","Up Arrow","arrows"],["↓","Down Arrow","arrows"],
  ["↗","NE Arrow","arrows"],["↘","SE Arrow","arrows"],["↙","SW Arrow","arrows"],["↖","NW Arrow","arrows"],
  ["⇒","Double Right","arrows"],["⇐","Double Left","arrows"],["⇑","Double Up","arrows"],["⇓","Double Down","arrows"],
  ["➜","Heavy Right","arrows"],["➡","Right Arrow","arrows"],["⬆","Up Arrow","arrows"],["⬇","Down Arrow","arrows"],
  ["±","Plus Minus","math"],["×","Multiply","math"],["÷","Divide","math"],["√","Square Root","math"],
  ["∑","Summation","math"],["∏","Product","math"],["∫","Integral","math"],["∞","Infinity","math"],
  ["≈","Approximately","math"],["≠","Not Equal","math"],["≤","Less Equal","math"],["≥","Greater Equal","math"],
  ["∠","Angle","math"],["°","Degree","math"],["π","Pi","math"],["Δ","Delta","math"],
  ["$","Dollar","currency"],["€","Euro","currency"],["£","Pound","currency"],["¥","Yen","currency"],
  ["₹","Rupee","currency"],["₿","Bitcoin","currency"],["¢","Cent","currency"],["₩","Won","currency"],
  ["©","Copyright","legal"],["®","Registered","legal"],["™","Trademark","legal"],["§","Section","legal"],
  ["¶","Pilcrow","legal"],["†","Dagger","legal"],["‡","Double Dagger","legal"],
  ["α","Alpha","greek"],["β","Beta","greek"],["γ","Gamma","greek"],["δ","Delta","greek"],
  ["ε","Epsilon","greek"],["θ","Theta","greek"],["λ","Lambda","greek"],["μ","Mu","greek"],
  ["σ","Sigma","greek"],["φ","Phi","greek"],["ω","Omega","greek"],["Ω","Omega Cap","greek"],
  ["★","Star","symbols"],["☆","Empty Star","symbols"],["♥","Heart","symbols"],["♦","Diamond","symbols"],
  ["♠","Spade","symbols"],["♣","Club","symbols"],["✓","Check","symbols"],["✗","Cross","symbols"],
  ["✦","Star","symbols"],["⚡","Lightning","symbols"],["☀","Sun","symbols"],["☁","Cloud","symbols"],
  ["♪","Note","symbols"],["♫","Notes","symbols"],["☎","Phone","symbols"],["✉","Mail","symbols"],
  ["│","Vert","box"],["─","Horiz","box"],["┌","TopLeft","box"],["┐","TopRight","box"],
  ["└","BotLeft","box"],["┘","BotRight","box"],["├","LeftT","box"],["┤","RightT","box"],
  ["┬","TopT","box"],["┴","BotT","box"],["┼","Cross","box"],["║","DblVert","box"],
  ["═","DblHoriz","box"],["╔","DblTL","box"],["╗","DblTR","box"],["╚","DblBL","box"],["╝","DblBR","box"],
  ["…","Ellipsis","punctuation"],["—","Em Dash","punctuation"],["–","En Dash","punctuation"],
  [""","Left Quote","punctuation"],[""","Right Quote","punctuation"],["'","Left Single","punctuation"],
  ["'","Right Single","punctuation"],["«","Left Guillemet","punctuation"],["»","Right Guillemet","punctuation"],
  ["•","Bullet","punctuation"],["·","Middle Dot","punctuation"],
];

export default function UnicodeSearch() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const filtered = search
    ? CHARS.filter(([, name, cat]) => name.toLowerCase().includes(search.toLowerCase()) || cat.includes(search.toLowerCase()))
    : CHARS;

  const copy = (c: string) => { navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(""), 800); };
  const cats = [...new Set(CHARS.map(c => c[2]))];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Unicode Character Search</h1>
        <p className="text-[var(--text-secondary)]">Find and copy special characters {copied && <span className="text-emerald-400">Copied {copied}!</span>}</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or category (arrows, math, currency, greek, box...)"
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" />
      </div>

      {!search && (
        <div className="flex flex-wrap gap-2 justify-center">
          {cats.map(c => <button key={c} onClick={() => setSearch(c)} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded text-sm capitalize hover:bg-[var(--bg-primary)]">{c}</button>)}
        </div>
      )}

      <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {filtered.map(([char, name], i) => (
          <button key={i} onClick={() => copy(char)} title={name}
            className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-2 text-center hover:bg-[var(--bg-primary)] hover:scale-110 transition-transform">
            <div className="text-2xl">{char}</div>
            <div className="text-xs text-[var(--text-secondary)] truncate">{name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
