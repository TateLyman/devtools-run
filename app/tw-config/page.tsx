"use client";
import { useState } from "react";
export default function TwConfig() {
  const [primary, setPrimary] = useState("#3b82f6");
  const [secondary, setSecondary] = useState("#8b5cf6");
  const [accent, setAccent] = useState("#22c55e");
  const [font, setFont] = useState("Inter");
  const [dark, setDark] = useState(true);
  const [prefix, setPrefix] = useState("");
  const [screens, setScreens] = useState({ sm: "640px", md: "768px", lg: "1024px", xl: "1280px" });
  const config = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],${dark ? '\n  darkMode: "class",' : ""}${prefix ? `\n  prefix: "${prefix}",` : ""}
  theme: {
    extend: {
      colors: {
        primary: "${primary}",
        secondary: "${secondary}",
        accent: "${accent}",
      },
      fontFamily: {
        sans: ["${font}", "system-ui", "sans-serif"],
      },
      screens: {
        sm: "${screens.sm}",
        md: "${screens.md}",
        lg: "${screens.lg}",
        xl: "${screens.xl}",
      },
    },
  },
  plugins: [],
};`;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Tailwind Config Generator</h1><p className="text-[var(--text-secondary)]">Build your tailwind.config.js visually</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 grid gap-4 md:grid-cols-3">
        <div><label className="text-xs text-[var(--text-secondary)]">Primary</label><div className="flex gap-2"><input type="color" value={primary} onChange={e=>setPrimary(e.target.value)} className="w-10 h-10 rounded cursor-pointer" /><input value={primary} onChange={e=>setPrimary(e.target.value)} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-xs" /></div></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Secondary</label><div className="flex gap-2"><input type="color" value={secondary} onChange={e=>setSecondary(e.target.value)} className="w-10 h-10 rounded cursor-pointer" /><input value={secondary} onChange={e=>setSecondary(e.target.value)} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-xs" /></div></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Accent</label><div className="flex gap-2"><input type="color" value={accent} onChange={e=>setAccent(e.target.value)} className="w-10 h-10 rounded cursor-pointer" /><input value={accent} onChange={e=>setAccent(e.target.value)} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-xs" /></div></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Font Family</label><input value={font} onChange={e=>setFont(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Prefix</label><input value={prefix} onChange={e=>setPrefix(e.target.value)} placeholder="tw-" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm" /></div>
        <div><label className="text-xs"><input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)} className="mr-1" />Dark Mode (class)</label></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">tailwind.config.js</label><button onClick={()=>navigator.clipboard.writeText(config)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre max-h-[400px] overflow-auto">{config}</pre></div>
    </div>
  );
}
