"use client";
import { useState } from "react";

const SECTIONS = [
  { title: "Character Classes", items: [
    [".", "Any character except newline", "a.c → abc, a1c"],
    ["\\d", "Digit (0-9)", "\\d{3} → 123"],
    ["\\D", "Non-digit", "\\D+ → abc"],
    ["\\w", "Word character (a-z, A-Z, 0-9, _)", "\\w+ → hello_123"],
    ["\\W", "Non-word character", "\\W → @, #, !"],
    ["\\s", "Whitespace", "\\s+ → spaces/tabs"],
    ["\\S", "Non-whitespace", "\\S+ → hello"],
    ["[abc]", "Character set (a, b, or c)", "[aeiou] → vowels"],
    ["[^abc]", "Negated set (not a, b, or c)", "[^0-9] → non-digits"],
    ["[a-z]", "Range", "[A-Za-z] → letters"],
  ]},
  { title: "Quantifiers", items: [
    ["*", "0 or more", "ab*c → ac, abc, abbc"],
    ["+", "1 or more", "ab+c → abc, abbc"],
    ["?", "0 or 1 (optional)", "colou?r → color, colour"],
    ["{n}", "Exactly n times", "\\d{4} → 2024"],
    ["{n,}", "n or more times", "\\d{2,} → 12, 123, 1234"],
    ["{n,m}", "Between n and m times", "\\d{2,4} → 12, 123, 1234"],
    ["*?", "Lazy (0 or more, minimal)", "<.*?> → first tag only"],
    ["+?", "Lazy (1 or more, minimal)", ".+? → minimal match"],
  ]},
  { title: "Anchors & Boundaries", items: [
    ["^", "Start of string/line", "^Hello → starts with Hello"],
    ["$", "End of string/line", "world$ → ends with world"],
    ["\\b", "Word boundary", "\\bcat\\b → cat (not cats)"],
    ["\\B", "Non-word boundary", "\\Bcat → scat, category"],
  ]},
  { title: "Groups & References", items: [
    ["(abc)", "Capture group", "(\\d+)-(\\d+) → groups"],
    ["(?:abc)", "Non-capturing group", "(?:ab|cd)+ → abcd"],
    ["\\1", "Backreference to group 1", "(\\w)\\1 → aa, bb"],
    ["(?<name>)", "Named capture group", "(?<year>\\d{4})"],
    ["(a|b)", "Alternation (a or b)", "(cat|dog) → cat or dog"],
  ]},
  { title: "Lookahead & Lookbehind", items: [
    ["(?=abc)", "Positive lookahead", "\\d+(?=px) → 10 in 10px"],
    ["(?!abc)", "Negative lookahead", "\\d+(?!px) → 10 not before px"],
    ["(?<=abc)", "Positive lookbehind", "(?<=\\$)\\d+ → 10 in $10"],
    ["(?<!abc)", "Negative lookbehind", "(?<!\\$)\\d+ → 10 not after $"],
  ]},
  { title: "Common Patterns", items: [
    ["[\\w.-]+@[\\w.-]+\\.\\w+", "Email", "user@example.com"],
    ["https?://[\\w.-]+(/\\S*)?", "URL", "https://example.com/path"],
    ["\\d{3}-\\d{3}-\\d{4}", "US Phone", "123-456-7890"],
    ["\\d{4}-\\d{2}-\\d{2}", "Date (YYYY-MM-DD)", "2024-01-15"],
    ["#[0-9A-Fa-f]{6}", "Hex Color", "#FF5733"],
    ["\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}", "IPv4", "192.168.1.1"],
  ]},
];

export default function RegexCheat() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const copy = (t: string) => { navigator.clipboard.writeText(t); setCopied(t); setTimeout(() => setCopied(""), 800); };

  const filtered = search ? SECTIONS.map(s => ({
    ...s, items: s.items.filter(([pat, desc]) => pat.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase()))
  })).filter(s => s.items.length > 0) : SECTIONS;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Regex Cheatsheet</h1>
        <p className="text-[var(--text-secondary)]">Quick reference for regular expressions {copied && <span className="text-emerald-400">Copied!</span>}</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patterns..."
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" />
      </div>

      {filtered.map(section => (
        <div key={section.title} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">{section.title}</h2>
          <div className="space-y-1">
            {section.items.map(([pattern, desc, example]) => (
              <div key={pattern} className="flex items-center gap-3 bg-[var(--bg-primary)] rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-blue-500/50 border border-transparent" onClick={() => copy(pattern)}>
                <code className="text-blue-400 font-mono font-bold w-32 shrink-0">{pattern}</code>
                <span className="flex-1 text-[var(--text-secondary)]">{desc}</span>
                <code className="text-xs text-emerald-400/60 hidden md:block">{example}</code>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
