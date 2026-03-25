"use client";
import { useState } from "react";

const cssToTailwindMap: Record<string, string> = {
  "display: flex": "flex", "display: grid": "grid", "display: block": "block",
  "display: inline": "inline", "display: none": "hidden", "display: inline-flex": "inline-flex",
  "position: relative": "relative", "position: absolute": "absolute", "position: fixed": "fixed", "position: sticky": "sticky",
  "flex-direction: column": "flex-col", "flex-direction: row": "flex-row",
  "align-items: center": "items-center", "align-items: flex-start": "items-start", "align-items: flex-end": "items-end",
  "justify-content: center": "justify-center", "justify-content: space-between": "justify-between",
  "justify-content: space-around": "justify-around", "justify-content: flex-end": "justify-end",
  "flex-wrap: wrap": "flex-wrap", "flex: 1": "flex-1", "flex: 1 1 0%": "flex-1",
  "text-align: center": "text-center", "text-align: right": "text-right", "text-align: left": "text-left",
  "font-weight: 700": "font-bold", "font-weight: 600": "font-semibold", "font-weight: 500": "font-medium", "font-weight: 400": "font-normal",
  "text-transform: uppercase": "uppercase", "text-transform: lowercase": "lowercase", "text-transform: capitalize": "capitalize",
  "overflow: hidden": "overflow-hidden", "overflow: auto": "overflow-auto", "overflow: scroll": "overflow-scroll",
  "cursor: pointer": "cursor-pointer", "cursor: not-allowed": "cursor-not-allowed",
  "width: 100%": "w-full", "height: 100%": "h-full", "min-height: 100vh": "min-h-screen",
  "max-width: 100%": "max-w-full",
  "border-radius: 9999px": "rounded-full", "border-radius: 0": "rounded-none",
  "box-shadow: none": "shadow-none",
  "opacity: 0": "opacity-0", "opacity: 0.5": "opacity-50", "opacity: 1": "opacity-100",
  "color: #ffffff": "text-white", "color: #000000": "text-black", "color: white": "text-white", "color: black": "text-black",
  "background-color: transparent": "bg-transparent",
};

function convertCSSToTailwind(css: string): string {
  const lines = css.split("\n").map((l) => l.trim()).filter(Boolean);
  const classes: string[] = [];
  const unconverted: string[] = [];

  for (const line of lines) {
    const clean = line.replace(/[{}]/g, "").replace(/;$/, "").trim();
    if (!clean || clean.startsWith("//") || clean.startsWith("/*") || clean.startsWith(".") || clean.startsWith("#")) continue;

    let found = false;
    for (const [cssProp, twClass] of Object.entries(cssToTailwindMap)) {
      if (clean === cssProp || clean.replace(/\s+/g, " ") === cssProp) {
        classes.push(twClass);
        found = true;
        break;
      }
    }

    // Dynamic conversions
    if (!found) {
      const pxMatch = clean.match(/^(padding|margin|gap):\s*(\d+)px$/);
      if (pxMatch) {
        const prop = pxMatch[1] === "padding" ? "p" : pxMatch[1] === "margin" ? "m" : "gap";
        const val = parseInt(pxMatch[2]);
        const rem = val / 4;
        if (Number.isInteger(rem) && rem <= 96) { classes.push(`${prop}-${rem}`); found = true; }
      }

      const borderRadiusMatch = clean.match(/^border-radius:\s*(\d+)px$/);
      if (borderRadiusMatch) {
        const val = parseInt(borderRadiusMatch[1]);
        if (val <= 2) classes.push("rounded-sm");
        else if (val <= 4) classes.push("rounded");
        else if (val <= 6) classes.push("rounded-md");
        else if (val <= 8) classes.push("rounded-lg");
        else if (val <= 12) classes.push("rounded-xl");
        else if (val <= 16) classes.push("rounded-2xl");
        else classes.push("rounded-3xl");
        found = true;
      }

      const fontSizeMatch = clean.match(/^font-size:\s*(\d+(?:\.\d+)?)(px|rem)$/);
      if (fontSizeMatch) {
        const val = fontSizeMatch[2] === "rem" ? parseFloat(fontSizeMatch[1]) : parseFloat(fontSizeMatch[1]) / 16;
        if (val <= 0.75) classes.push("text-xs");
        else if (val <= 0.875) classes.push("text-sm");
        else if (val <= 1) classes.push("text-base");
        else if (val <= 1.125) classes.push("text-lg");
        else if (val <= 1.25) classes.push("text-xl");
        else if (val <= 1.5) classes.push("text-2xl");
        else if (val <= 1.875) classes.push("text-3xl");
        else classes.push("text-4xl");
        found = true;
      }
    }

    if (!found && clean.includes(":")) unconverted.push(clean);
  }

  let result = classes.join(" ");
  if (unconverted.length > 0) {
    result += `\n\n/* Could not convert:\n${unconverted.map((u) => `   ${u};`).join("\n")}\n*/`;
  }
  return result;
}

export default function CSSToTailwind() {
  const [input, setInput] = useState("display: flex;\nalign-items: center;\njustify-content: space-between;\npadding: 16px;\nborder-radius: 8px;\nfont-weight: 700;\nfont-size: 14px;\ncursor: pointer;");
  const [copied, setCopied] = useState(false);
  const output = convertCSSToTailwind(input);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSS to Tailwind Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert plain CSS to Tailwind CSS utility classes. Paste your CSS properties, get equivalent Tailwind classes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">CSS Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="display: flex;\nalign-items: center;\npadding: 16px;" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-64 resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Tailwind Output</label>
            <button onClick={() => { navigator.clipboard.writeText(output.split("\n")[0]); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-64 overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
