"use client";
import { useState } from "react";
const COLORS = ["AliceBlue:#F0F8FF","AntiqueWhite:#FAEBD7","Aqua:#00FFFF","Aquamarine:#7FFFD4","Azure:#F0FFFF","Beige:#F5F5DC","Bisque:#FFE4C4","Black:#000000","Blue:#0000FF","BlueViolet:#8A2BE2","Brown:#A52A2A","BurlyWood:#DEB887","CadetBlue:#5F9EA0","Chartreuse:#7FFF00","Chocolate:#D2691E","Coral:#FF7F50","CornflowerBlue:#6495ED","Crimson:#DC143C","Cyan:#00FFFF","DarkBlue:#00008B","DarkCyan:#008B8B","DarkGoldenrod:#B8860B","DarkGray:#A9A9A9","DarkGreen:#006400","DarkMagenta:#8B008B","DarkOliveGreen:#556B2F","DarkOrange:#FF8C00","DarkOrchid:#9932CC","DarkRed:#8B0000","DarkSalmon:#E9967A","DarkSeaGreen:#8FBC8F","DarkSlateBlue:#483D8B","DarkSlateGray:#2F4F4F","DarkTurquoise:#00CED1","DarkViolet:#9400D3","DeepPink:#FF1493","DeepSkyBlue:#00BFFF","DimGray:#696969","DodgerBlue:#1E90FF","FireBrick:#B22222","ForestGreen:#228B22","Fuchsia:#FF00FF","Gold:#FFD700","Goldenrod:#DAA520","Gray:#808080","Green:#008000","GreenYellow:#ADFF2F","HotPink:#FF69B4","IndianRed:#CD5C5C","Indigo:#4B0082","Ivory:#FFFFF0","Khaki:#F0E68C","Lavender:#E6E6FA","LawnGreen:#7CFC00","LightBlue:#ADD8E6","LightCoral:#F08080","LightGreen:#90EE90","LightPink:#FFB6C1","LightSalmon:#FFA07A","LightSeaGreen:#20B2AA","LightSkyBlue:#87CEFA","LightSlateGray:#778899","LightSteelBlue:#B0C4DE","Lime:#00FF00","LimeGreen:#32CD32","Magenta:#FF00FF","Maroon:#800000","MediumAquamarine:#66CDAA","MediumBlue:#0000CD","MediumOrchid:#BA55D3","MediumPurple:#9370DB","MediumSeaGreen:#3CB371","MediumSlateBlue:#7B68EE","MediumSpringGreen:#00FA9A","MediumTurquoise:#48D1CC","MediumVioletRed:#C71585","MidnightBlue:#191970","MistyRose:#FFE4E1","Moccasin:#FFE4B5","Navy:#000080","Olive:#808000","OliveDrab:#6B8E23","Orange:#FFA500","OrangeRed:#FF4500","Orchid:#DA70D6","PaleGoldenrod:#EEE8AA","PaleGreen:#98FB98","PaleTurquoise:#AFEEEE","PaleVioletRed:#DB7093","Peru:#CD853F","Pink:#FFC0CB","Plum:#DDA0DD","PowderBlue:#B0E0E6","Purple:#800080","Red:#FF0000","RoyalBlue:#4169E1","SaddleBrown:#8B4513","Salmon:#FA8072","SandyBrown:#F4A460","SeaGreen:#2E8B57","Sienna:#A0522D","Silver:#C0C0C0","SkyBlue:#87CEEB","SlateBlue:#6A5ACD","SlateGray:#708090","SpringGreen:#00FF7F","SteelBlue:#4682B4","Tan:#D2B48C","Teal:#008080","Thistle:#D8BFD8","Tomato:#FF6347","Turquoise:#40E0D0","Violet:#EE82EE","Wheat:#F5DEB3","White:#FFFFFF","WhiteSmoke:#F5F5F5","Yellow:#FFFF00","YellowGreen:#9ACD32"];
export default function WebColors() {
  const [copied, setCopied] = useState("");
  const [search, setSearch] = useState("");
  const copy = (hex: string, name: string) => { navigator.clipboard.writeText(hex); setCopied(name); setTimeout(() => setCopied(""), 800); };
  const filtered = search ? COLORS.filter(c => c.toLowerCase().includes(search.toLowerCase())) : COLORS;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Web Colors</h1><p className="text-[var(--text-secondary)]">All 148 named CSS colors {copied && <span className="text-emerald-400">Copied {copied}!</span>}</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search colors..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" /></div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {filtered.map(c => { const [name, hex] = c.split(":"); return (
          <button key={name} onClick={() => copy(hex, name)} className="text-center hover:scale-105 transition-transform" title={`${name} ${hex}`}>
            <div className="w-full h-10 rounded-lg border border-[var(--border)]" style={{ backgroundColor: hex }} />
            <div className="text-xs truncate mt-1">{name}</div>
            <div className="text-xs text-[var(--text-secondary)] font-mono">{hex}</div>
          </button>
        ); })}
      </div>
    </div>
  );
}
