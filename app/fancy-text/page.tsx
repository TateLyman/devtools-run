"use client";
import { useState } from "react";

const transforms: Record<string, (text: string) => string> = {
  "𝐁𝐨𝐥𝐝": (t) => t.split("").map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97); return c; }).join(""),
  "𝑰𝒕𝒂𝒍𝒊𝒄": (t) => t.split("").map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D468 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D482 + code - 97); return c; }).join(""),
  "𝕆𝕦𝕥𝕝𝕚𝕟𝕖": (t) => t.split("").map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D538 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + code - 97); return c; }).join(""),
  "𝙼𝚘𝚗𝚘": (t) => t.split("").map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + code - 97); return c; }).join(""),
  "🅱🅾🆇": (t) => t.toUpperCase().split("").map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F170 + code - 65); return c; }).join(""),
  "Ⓒⓘⓡⓒⓛⓔ": (t) => t.split("").map((c) => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65); if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97); return c; }).join(""),
  "uʍop ǝpᴉsd∩": (t) => {const map: Record<string,string> = {a:"ɐ",b:"q",c:"ɔ",d:"p",e:"ǝ",f:"ɟ",g:"ƃ",h:"ɥ",i:"ᴉ",j:"ɾ",k:"ʞ",l:"l",m:"ɯ",n:"u",o:"o",p:"d",q:"b",r:"ɹ",s:"s",t:"ʇ",u:"n",v:"ʌ",w:"ʍ",x:"x",y:"ʎ",z:"z"," ":" ","!":"¡","?":"¿",".":"˙",",":"'"}; return t.toLowerCase().split("").reverse().map(c => map[c] || c).join("");},
  "S̷t̷r̷i̷k̷e̷": (t) => t.split("").map((c) => c + "\u0337").join(""),
  "W̲u̲n̲d̲e̲r̲l̲i̲n̲e̲": (t) => t.split("").map((c) => c + "\u0332").join(""),
  "S⃣q⃣u⃣a⃣r⃣e⃣": (t) => t.split("").map((c) => c + "\u20E3").join(""),
  "ᴛɪɴʏ": (t) => { const map: Record<string,string> = {a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ꜰ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",q:"Q",r:"ʀ",s:"ꜱ",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"}; return t.toLowerCase().split("").map(c => map[c] || c).join(""); },
  "ᵂⁱᵈᵉ": (t) => t.split("").join(" "),
};

export default function FancyText() {
  const [input, setInput] = useState("Hello World!");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Fancy Text Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Convert text to fancy Unicode styles. Bold, italic, outline, upside down, strikethrough, and more. Works on Instagram, Twitter, TikTok.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your text here..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white text-lg text-center" autoFocus />

        <div className="space-y-2">
          {Object.entries(transforms).map(([name, fn]) => {
            const result = fn(input);
            return (
              <div key={name} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-purple-500/30" onClick={() => copy(result, name)}>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">{name}</p>
                  <p className="text-white text-sm truncate">{result}</p>
                </div>
                <button className="text-xs text-purple-400 shrink-0 ml-2">{copied === name ? "✓" : "Copy"}</button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 text-center">Click any style to copy. Works on Instagram, Twitter, TikTok, Facebook, Discord, and more.</p>
      </div>
    </div>
  );
}
