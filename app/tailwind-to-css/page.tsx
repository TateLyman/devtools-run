"use client";
import { useState } from "react";

const tailwindMap: Record<string, string> = {
  // Layout
  "flex": "display: flex;", "grid": "display: grid;", "block": "display: block;", "inline": "display: inline;",
  "hidden": "display: none;", "relative": "position: relative;", "absolute": "position: absolute;",
  "fixed": "position: fixed;", "sticky": "position: sticky;",
  // Spacing
  "p-0": "padding: 0;", "p-1": "padding: 0.25rem;", "p-2": "padding: 0.5rem;", "p-3": "padding: 0.75rem;",
  "p-4": "padding: 1rem;", "p-5": "padding: 1.25rem;", "p-6": "padding: 1.5rem;", "p-8": "padding: 2rem;",
  "px-1": "padding-left: 0.25rem; padding-right: 0.25rem;", "px-2": "padding-left: 0.5rem; padding-right: 0.5rem;",
  "px-3": "padding-left: 0.75rem; padding-right: 0.75rem;", "px-4": "padding-left: 1rem; padding-right: 1rem;",
  "py-1": "padding-top: 0.25rem; padding-bottom: 0.25rem;", "py-2": "padding-top: 0.5rem; padding-bottom: 0.5rem;",
  "py-3": "padding-top: 0.75rem; padding-bottom: 0.75rem;", "py-4": "padding-top: 1rem; padding-bottom: 1rem;",
  "m-0": "margin: 0;", "m-1": "margin: 0.25rem;", "m-2": "margin: 0.5rem;", "m-4": "margin: 1rem;",
  "mx-auto": "margin-left: auto; margin-right: auto;",
  "mt-1": "margin-top: 0.25rem;", "mt-2": "margin-top: 0.5rem;", "mt-4": "margin-top: 1rem;",
  "mb-1": "margin-bottom: 0.25rem;", "mb-2": "margin-bottom: 0.5rem;", "mb-4": "margin-bottom: 1rem;",
  // Sizing
  "w-full": "width: 100%;", "h-full": "height: 100%;", "w-screen": "width: 100vw;", "h-screen": "height: 100vh;",
  "min-h-screen": "min-height: 100vh;", "max-w-sm": "max-width: 24rem;", "max-w-md": "max-width: 28rem;",
  "max-w-lg": "max-width: 32rem;", "max-w-xl": "max-width: 36rem;", "max-w-2xl": "max-width: 42rem;",
  // Flex
  "items-center": "align-items: center;", "items-start": "align-items: flex-start;",
  "justify-center": "justify-content: center;", "justify-between": "justify-content: space-between;",
  "flex-col": "flex-direction: column;", "flex-row": "flex-direction: row;",
  "flex-wrap": "flex-wrap: wrap;", "flex-1": "flex: 1 1 0%;", "gap-1": "gap: 0.25rem;",
  "gap-2": "gap: 0.5rem;", "gap-3": "gap: 0.75rem;", "gap-4": "gap: 1rem;",
  // Text
  "text-xs": "font-size: 0.75rem; line-height: 1rem;", "text-sm": "font-size: 0.875rem; line-height: 1.25rem;",
  "text-base": "font-size: 1rem; line-height: 1.5rem;", "text-lg": "font-size: 1.125rem; line-height: 1.75rem;",
  "text-xl": "font-size: 1.25rem; line-height: 1.75rem;", "text-2xl": "font-size: 1.5rem; line-height: 2rem;",
  "text-3xl": "font-size: 1.875rem; line-height: 2.25rem;", "text-4xl": "font-size: 2.25rem; line-height: 2.5rem;",
  "font-bold": "font-weight: 700;", "font-semibold": "font-weight: 600;", "font-medium": "font-weight: 500;",
  "font-mono": "font-family: ui-monospace, monospace;",
  "text-center": "text-align: center;", "text-right": "text-align: right;",
  "text-white": "color: #ffffff;", "text-black": "color: #000000;",
  "uppercase": "text-transform: uppercase;", "lowercase": "text-transform: lowercase;", "capitalize": "text-transform: capitalize;",
  // Borders
  "rounded": "border-radius: 0.25rem;", "rounded-md": "border-radius: 0.375rem;",
  "rounded-lg": "border-radius: 0.5rem;", "rounded-xl": "border-radius: 0.75rem;",
  "rounded-full": "border-radius: 9999px;", "border": "border-width: 1px;",
  "border-2": "border-width: 2px;", "border-0": "border-width: 0;",
  // Effects
  "shadow": "box-shadow: 0 1px 3px rgba(0,0,0,0.1);", "shadow-md": "box-shadow: 0 4px 6px rgba(0,0,0,0.1);",
  "shadow-lg": "box-shadow: 0 10px 15px rgba(0,0,0,0.1);", "shadow-none": "box-shadow: none;",
  "opacity-0": "opacity: 0;", "opacity-50": "opacity: 0.5;", "opacity-100": "opacity: 1;",
  // Overflow
  "overflow-hidden": "overflow: hidden;", "overflow-auto": "overflow: auto;", "overflow-scroll": "overflow: scroll;",
  // Cursor
  "cursor-pointer": "cursor: pointer;", "cursor-not-allowed": "cursor: not-allowed;",
  // Transitions
  "transition": "transition-property: all; transition-duration: 150ms;",
  "transition-colors": "transition-property: color, background-color, border-color; transition-duration: 150ms;",
  "duration-300": "transition-duration: 300ms;",
};

function convertTailwind(classes: string): string {
  const classList = classes.trim().split(/\s+/);
  const cssLines: string[] = [];
  const unknown: string[] = [];

  for (const cls of classList) {
    if (tailwindMap[cls]) {
      cssLines.push(`  ${tailwindMap[cls]}`);
    } else {
      unknown.push(cls);
    }
  }

  let result = `.element {\n${cssLines.join("\n")}\n}`;
  if (unknown.length > 0) {
    result += `\n\n/* Could not convert: ${unknown.join(", ")} */`;
  }
  return result;
}

export default function TailwindToCSS() {
  const [input, setInput] = useState("flex items-center justify-between p-4 rounded-lg shadow-md text-white font-bold");
  const [copied, setCopied] = useState(false);

  const output = input.trim() ? convertTailwind(input) : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Tailwind to CSS Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert Tailwind CSS classes to plain CSS. Paste your Tailwind classes and get the equivalent CSS. Free online converter.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Tailwind Classes</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="flex items-center p-4 rounded-lg..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-48 resize-none font-mono text-sm" />
          <p className="text-xs text-gray-500 mt-1">{input.trim().split(/\s+/).filter(Boolean).length} classes</p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">CSS Output</label>
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-48 overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
        <h3 className="font-bold text-sm mb-2">Preview</h3>
        <div className={input}
          style={{ backgroundColor: "#1a1a2e", padding: "1rem", borderRadius: "0.5rem" }}>
          <p>Preview Element</p>
        </div>
      </div>
    </div>
  );
}
