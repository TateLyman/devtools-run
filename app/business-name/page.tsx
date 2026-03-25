"use client";
import { useState } from "react";

const prefixes = ["Nova", "Apex", "Pixel", "Code", "Byte", "Cloud", "Zen", "Flux", "Volt", "Pulse", "Neon", "Echo", "Forge", "Swift", "Prime", "Aura", "Orbit", "Vibe", "Spark", "Drift", "Core", "Wave", "Grid", "Link", "Hive", "Mint", "Bolt", "Fuse", "Loom", "Glow"];
const suffixes = ["Labs", "IO", "Hub", "HQ", "ly", "ify", "ware", "Stack", "Base", "Kit", "Box", "Flow", "Shift", "Mind", "Craft", "Works", "Logic", "Verse", "Sync", "Spot", "Zone", "Pro", "Dev", "App", "AI", "X", "Co", "Tech", "Studio", "Digital"];
const industries: Record<string, string[]> = {
  tech: ["Tech", "Digital", "Soft", "Code", "Data", "Cloud", "Cyber", "Net", "Web", "App"],
  creative: ["Creative", "Design", "Art", "Studio", "Pixel", "Color", "Vision", "Craft", "Media", "Brand"],
  finance: ["Fin", "Capital", "Wealth", "Trust", "Ledger", "Mint", "Pay", "Fund", "Asset", "Trade"],
  health: ["Health", "Vita", "Care", "Well", "Med", "Bio", "Life", "Fit", "Pure", "Heal"],
  food: ["Taste", "Fresh", "Spice", "Harvest", "Kitchen", "Bites", "Flavor", "Feast", "Grill", "Bloom"],
  ecommerce: ["Shop", "Store", "Cart", "Market", "Deal", "Buy", "Sell", "Trade", "Goods", "Pick"],
};

function generateNames(industry: string, keyword: string, count: number): string[] {
  const names = new Set<string>();
  const pool = industries[industry] || industries.tech;

  while (names.size < count) {
    const r = Math.random();
    if (r < 0.3) {
      names.add(prefixes[Math.floor(Math.random() * prefixes.length)] + suffixes[Math.floor(Math.random() * suffixes.length)]);
    } else if (r < 0.6) {
      names.add(pool[Math.floor(Math.random() * pool.length)] + suffixes[Math.floor(Math.random() * suffixes.length)]);
    } else if (r < 0.8 && keyword) {
      const cap = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      names.add(cap + suffixes[Math.floor(Math.random() * suffixes.length)]);
    } else {
      names.add(prefixes[Math.floor(Math.random() * prefixes.length)] + pool[Math.floor(Math.random() * pool.length)].toLowerCase());
    }
  }
  return [...names];
}

export default function BusinessName() {
  const [industry, setIndustry] = useState("tech");
  const [keyword, setKeyword] = useState("");
  const [names, setNames] = useState<string[]>(() => generateNames("tech", "", 20));
  const [copied, setCopied] = useState<number | null>(null);
  const [saved, setSaved] = useState<string[]>([]);

  const generate = () => setNames(generateNames(industry, keyword, 20));
  const save = (name: string) => setSaved((s) => s.includes(name) ? s.filter((n) => n !== name) : [...s, name]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Business Name Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate creative business names instantly. 6 industries, custom keywords. Save your favorites. Free name generator.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {Object.keys(industries).map((ind) => (
            <button key={ind} onClick={() => setIndustry(ind)} className={`px-3 py-1.5 rounded text-xs capitalize ${industry === ind ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{ind}</button>
          ))}
        </div>

        <div className="flex gap-2">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Optional keyword (e.g. rocket, zen, smart)" className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2.5 text-white text-sm" />
          <button onClick={generate} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded font-bold">Generate</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {names.map((name, i) => (
            <div key={i} className={`bg-[var(--bg-secondary)] border rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-purple-500/30 ${saved.includes(name) ? "border-purple-500" : "border-[var(--border)]"}`} onClick={() => { navigator.clipboard.writeText(name); setCopied(i); setTimeout(() => setCopied(null), 1500); }}>
              <span className="text-white text-sm font-medium">{name}</span>
              <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); save(name); }} className={`text-xs ${saved.includes(name) ? "text-yellow-400" : "text-gray-500"}`}>{saved.includes(name) ? "★" : "☆"}</button>
                <span className="text-xs text-purple-400">{copied === i ? "✓" : ""}</span>
              </div>
            </div>
          ))}
        </div>

        {saved.length > 0 && (
          <div className="bg-[var(--bg-secondary)] border border-purple-500/30 rounded-lg p-4">
            <h3 className="font-bold text-sm text-purple-400 mb-2">Saved ({saved.length})</h3>
            <div className="flex flex-wrap gap-2">
              {saved.map((name) => (
                <span key={name} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded text-sm">{name}</span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
          <h3 className="font-bold text-white mb-1">Next Steps</h3>
          <ul className="space-y-1">
            <li>• Check domain availability at namecheap.com or domains.google</li>
            <li>• Search trademark databases (USPTO, EUIPO)</li>
            <li>• Check social media handle availability</li>
            <li>• Test the name with your target audience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
