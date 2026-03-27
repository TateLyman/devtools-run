"use client";
import { useState } from "react";
const MAP: Record<string, string> = {
  "flex": "display: flex;", "grid": "display: grid;", "block": "display: block;", "hidden": "display: none;", "inline": "display: inline;",
  "relative": "position: relative;", "absolute": "position: absolute;", "fixed": "position: fixed;", "sticky": "position: sticky;",
  "text-center": "text-align: center;", "text-left": "text-align: left;", "text-right": "text-align: right;",
  "font-bold": "font-weight: 700;", "font-semibold": "font-weight: 600;", "font-medium": "font-weight: 500;", "font-normal": "font-weight: 400;",
  "italic": "font-style: italic;", "underline": "text-decoration: underline;", "line-through": "text-decoration: line-through;",
  "text-xs": "font-size: 0.75rem;", "text-sm": "font-size: 0.875rem;", "text-base": "font-size: 1rem;", "text-lg": "font-size: 1.125rem;",
  "text-xl": "font-size: 1.25rem;", "text-2xl": "font-size: 1.5rem;", "text-3xl": "font-size: 1.875rem;", "text-4xl": "font-size: 2.25rem;",
  "w-full": "width: 100%;", "h-full": "height: 100%;", "w-screen": "width: 100vw;", "h-screen": "height: 100vh;",
  "p-0": "padding: 0;", "p-1": "padding: 0.25rem;", "p-2": "padding: 0.5rem;", "p-3": "padding: 0.75rem;", "p-4": "padding: 1rem;", "p-6": "padding: 1.5rem;", "p-8": "padding: 2rem;",
  "m-0": "margin: 0;", "m-1": "margin: 0.25rem;", "m-2": "margin: 0.5rem;", "m-4": "margin: 1rem;", "m-auto": "margin: auto;",
  "rounded": "border-radius: 0.25rem;", "rounded-lg": "border-radius: 0.5rem;", "rounded-xl": "border-radius: 0.75rem;", "rounded-full": "border-radius: 9999px;",
  "shadow": "box-shadow: 0 1px 3px rgba(0,0,0,0.1);", "shadow-lg": "box-shadow: 0 10px 15px rgba(0,0,0,0.1);",
  "overflow-hidden": "overflow: hidden;", "overflow-auto": "overflow: auto;", "overflow-scroll": "overflow: scroll;",
  "cursor-pointer": "cursor: pointer;", "select-none": "user-select: none;", "opacity-50": "opacity: 0.5;",
  "gap-1": "gap: 0.25rem;", "gap-2": "gap: 0.5rem;", "gap-4": "gap: 1rem;", "gap-6": "gap: 1.5rem;",
  "items-center": "align-items: center;", "justify-center": "justify-content: center;", "justify-between": "justify-content: space-between;",
  "flex-col": "flex-direction: column;", "flex-wrap": "flex-wrap: wrap;", "flex-1": "flex: 1 1 0%;",
  "border": "border: 1px solid;", "border-0": "border: 0;", "border-2": "border-width: 2px;",
  "text-white": "color: #ffffff;", "text-black": "color: #000000;", "bg-white": "background-color: #ffffff;", "bg-black": "background-color: #000000;",
};
export default function TwToCss() {
  const [input, setInput] = useState("flex items-center justify-between p-4 rounded-lg shadow-lg text-white font-bold");
  const classes = input.trim().split(/\s+/).filter(Boolean);
  const css = classes.map(c => MAP[c] || `/* ${c}: unknown */`).join("\n");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Tailwind to CSS</h1><p className="text-[var(--text-secondary)]">Convert Tailwind classes to vanilla CSS</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><textarea value={input} onChange={e => setInput(e.target.value)} rows={3} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" placeholder="Paste Tailwind classes..." /></div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS Output</label><button onClick={() => navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">{css}</pre></div>
    </div>
  );
}
