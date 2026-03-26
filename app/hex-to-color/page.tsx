"use client";
import { useState } from "react";

const COLORS: [string, string][] = [
  ["#F0F8FF","AliceBlue"],["#FAEBD7","AntiqueWhite"],["#00FFFF","Aqua"],["#7FFFD4","Aquamarine"],["#F0FFFF","Azure"],
  ["#F5F5DC","Beige"],["#FFE4C4","Bisque"],["#000000","Black"],["#0000FF","Blue"],["#8A2BE2","BlueViolet"],
  ["#A52A2A","Brown"],["#DEB887","BurlyWood"],["#5F9EA0","CadetBlue"],["#7FFF00","Chartreuse"],["#D2691E","Chocolate"],
  ["#FF7F50","Coral"],["#6495ED","CornflowerBlue"],["#DC143C","Crimson"],["#00FFFF","Cyan"],["#00008B","DarkBlue"],
  ["#008B8B","DarkCyan"],["#B8860B","DarkGoldenrod"],["#A9A9A9","DarkGray"],["#006400","DarkGreen"],["#BDB76B","DarkKhaki"],
  ["#8B008B","DarkMagenta"],["#556B2F","DarkOliveGreen"],["#FF8C00","DarkOrange"],["#9932CC","DarkOrchid"],["#8B0000","DarkRed"],
  ["#E9967A","DarkSalmon"],["#8FBC8F","DarkSeaGreen"],["#483D8B","DarkSlateBlue"],["#2F4F4F","DarkSlateGray"],
  ["#00CED1","DarkTurquoise"],["#9400D3","DarkViolet"],["#FF1493","DeepPink"],["#00BFFF","DeepSkyBlue"],
  ["#696969","DimGray"],["#1E90FF","DodgerBlue"],["#B22222","FireBrick"],["#228B22","ForestGreen"],["#FF00FF","Fuchsia"],
  ["#FFD700","Gold"],["#DAA520","Goldenrod"],["#808080","Gray"],["#008000","Green"],["#ADFF2F","GreenYellow"],
  ["#F0FFF0","Honeydew"],["#FF69B4","HotPink"],["#CD5C5C","IndianRed"],["#4B0082","Indigo"],["#FFFFF0","Ivory"],
  ["#F0E68C","Khaki"],["#E6E6FA","Lavender"],["#7CFC00","LawnGreen"],["#ADD8E6","LightBlue"],["#F08080","LightCoral"],
  ["#90EE90","LightGreen"],["#FFB6C1","LightPink"],["#FFA07A","LightSalmon"],["#20B2AA","LightSeaGreen"],
  ["#87CEFA","LightSkyBlue"],["#778899","LightSlateGray"],["#B0C4DE","LightSteelBlue"],["#FFFFE0","LightYellow"],
  ["#00FF00","Lime"],["#32CD32","LimeGreen"],["#FAF0E6","Linen"],["#FF00FF","Magenta"],["#800000","Maroon"],
  ["#66CDAA","MediumAquamarine"],["#0000CD","MediumBlue"],["#BA55D3","MediumOrchid"],["#9370DB","MediumPurple"],
  ["#3CB371","MediumSeaGreen"],["#7B68EE","MediumSlateBlue"],["#00FA9A","MediumSpringGreen"],["#48D1CC","MediumTurquoise"],
  ["#C71585","MediumVioletRed"],["#191970","MidnightBlue"],["#FFE4E1","MistyRose"],["#FFE4B5","Moccasin"],
  ["#FFDEAD","NavajoWhite"],["#000080","Navy"],["#FDF5E6","OldLace"],["#808000","Olive"],["#6B8E23","OliveDrab"],
  ["#FFA500","Orange"],["#FF4500","OrangeRed"],["#DA70D6","Orchid"],["#EEE8AA","PaleGoldenrod"],["#98FB98","PaleGreen"],
  ["#AFEEEE","PaleTurquoise"],["#DB7093","PaleVioletRed"],["#FFDAB9","PeachPuff"],["#CD853F","Peru"],["#FFC0CB","Pink"],
  ["#DDA0DD","Plum"],["#B0E0E6","PowderBlue"],["#800080","Purple"],["#FF0000","Red"],["#BC8F8F","RosyBrown"],
  ["#4169E1","RoyalBlue"],["#8B4513","SaddleBrown"],["#FA8072","Salmon"],["#F4A460","SandyBrown"],["#2E8B57","SeaGreen"],
  ["#FFF5EE","SeaShell"],["#A0522D","Sienna"],["#C0C0C0","Silver"],["#87CEEB","SkyBlue"],["#6A5ACD","SlateBlue"],
  ["#708090","SlateGray"],["#FFFAFA","Snow"],["#00FF7F","SpringGreen"],["#4682B4","SteelBlue"],["#D2B48C","Tan"],
  ["#008080","Teal"],["#D8BFD8","Thistle"],["#FF6347","Tomato"],["#40E0D0","Turquoise"],["#EE82EE","Violet"],
  ["#F5DEB3","Wheat"],["#FFFFFF","White"],["#F5F5F5","WhiteSmoke"],["#FFFF00","Yellow"],["#9ACD32","YellowGreen"],
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
  return Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2) + Math.pow(c1[2] - c2[2], 2));
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function HexToColor() {
  const [hex, setHex] = useState("#FF6347");
  const clean = hex.startsWith("#") ? hex : "#" + hex;
  const valid = /^#[0-9A-Fa-f]{6}$/.test(clean);
  const rgb = valid ? hexToRgb(clean) : [0, 0, 0] as [number, number, number];
  const hsl = valid ? rgbToHsl(...rgb) : [0, 0, 0];
  
  const closest = valid ? COLORS.reduce((best, [ch, cn]) => {
    const dist = colorDistance(rgb, hexToRgb(ch));
    return dist < best.dist ? { hex: ch, name: cn, dist } : best;
  }, { hex: "", name: "", dist: Infinity }) : { hex: "", name: "Invalid", dist: 0 };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Hex to Color Name</h1>
        <p className="text-[var(--text-secondary)]">Find the closest named color for any hex code</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex gap-4 items-center justify-center">
          <input type="color" value={valid ? clean : "#000000"} onChange={e => setHex(e.target.value)} className="w-16 h-16 rounded-lg cursor-pointer" />
          <input value={hex} onChange={e => setHex(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-xl w-40" placeholder="#FF6347" />
        </div>
      </div>

      {valid && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl h-32 border border-[var(--border)]" style={{ backgroundColor: clean }} />
            <div className="rounded-xl h-32 border border-[var(--border)]" style={{ backgroundColor: closest.hex }} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="text-xs text-[var(--text-secondary)]">Your Color</div>
              <div className="text-2xl font-bold font-mono">{clean.toUpperCase()}</div>
              <div className="text-sm text-[var(--text-secondary)]">rgb({rgb.join(", ")})</div>
              <div className="text-sm text-[var(--text-secondary)]">hsl({hsl[0]}, {hsl[1]}%, {hsl[2]}%)</div>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="text-xs text-[var(--text-secondary)]">Closest Named Color</div>
              <div className="text-2xl font-bold">{closest.name}</div>
              <div className="text-sm font-mono text-[var(--text-secondary)]">{closest.hex}</div>
              <div className="text-xs text-[var(--text-secondary)]">Distance: {closest.dist.toFixed(1)}</div>
            </div>
          </div>
        </>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">All CSS Named Colors</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {COLORS.slice(0, 64).map(([ch, cn]) => (
            <button key={cn} onClick={() => setHex(ch)} className="text-center hover:scale-105 transition-transform" title={cn}>
              <div className="w-full h-8 rounded border border-[var(--border)]" style={{ backgroundColor: ch }} />
              <div className="text-xs text-[var(--text-secondary)] truncate mt-1">{cn}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
