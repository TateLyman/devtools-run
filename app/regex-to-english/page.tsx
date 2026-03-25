"use client";
import { useState } from "react";

function explainRegex(pattern: string): string {
  if (!pattern) return "";
  const explanations: string[] = [];
  let i = 0;

  while (i < pattern.length) {
    const c = pattern[i];
    const next = pattern[i + 1];

    if (c === "^") { explanations.push("Start of string"); i++; }
    else if (c === "$") { explanations.push("End of string"); i++; }
    else if (c === ".") { explanations.push("Any character"); i++; }
    else if (c === "*") { explanations.push("(zero or more times)"); i++; }
    else if (c === "+") { explanations.push("(one or more times)"); i++; }
    else if (c === "?") { explanations.push("(optional)"); i++; }
    else if (c === "|") { explanations.push("OR"); i++; }
    else if (c === "\\") {
      i++;
      const esc = pattern[i];
      if (esc === "d") explanations.push("A digit (0-9)");
      else if (esc === "D") explanations.push("A non-digit");
      else if (esc === "w") explanations.push("A word character (letter, digit, underscore)");
      else if (esc === "W") explanations.push("A non-word character");
      else if (esc === "s") explanations.push("A whitespace character");
      else if (esc === "S") explanations.push("A non-whitespace character");
      else if (esc === "b") explanations.push("A word boundary");
      else if (esc === "n") explanations.push("A newline");
      else if (esc === "t") explanations.push("A tab");
      else explanations.push(`Literal '${esc}'`);
      i++;
    }
    else if (c === "[") {
      const end = pattern.indexOf("]", i);
      if (end !== -1) {
        const charClass = pattern.slice(i + 1, end);
        if (charClass.startsWith("^")) explanations.push(`Any character NOT in [${charClass.slice(1)}]`);
        else explanations.push(`Any character in [${charClass}]`);
        i = end + 1;
      } else { explanations.push(`Literal '['`); i++; }
    }
    else if (c === "(") {
      const end = findMatchingParen(pattern, i);
      const group = pattern.slice(i + 1, end);
      if (group.startsWith("?:")) explanations.push(`Non-capturing group: ${group.slice(2)}`);
      else if (group.startsWith("?=")) explanations.push(`Lookahead: ${group.slice(2)}`);
      else if (group.startsWith("?!")) explanations.push(`Negative lookahead: ${group.slice(2)}`);
      else explanations.push(`Capture group: ${group}`);
      i = end + 1;
    }
    else if (c === "{") {
      const end = pattern.indexOf("}", i);
      if (end !== -1) {
        const quant = pattern.slice(i + 1, end);
        if (quant.includes(",")) {
          const [min, max] = quant.split(",");
          explanations.push(`(${min} to ${max || "unlimited"} times)`);
        } else {
          explanations.push(`(exactly ${quant} times)`);
        }
        i = end + 1;
      } else { explanations.push(`Literal '{'`); i++; }
    }
    else {
      explanations.push(`Literal '${c}'`);
      i++;
    }
  }

  return explanations.join("\n");
}

function findMatchingParen(str: string, start: number): number {
  let depth = 1;
  for (let i = start + 1; i < str.length; i++) {
    if (str[i] === "(") depth++;
    if (str[i] === ")") { depth--; if (depth === 0) return i; }
  }
  return str.length - 1;
}

export default function RegexToEnglish() {
  const [pattern, setPattern] = useState("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

  const explanation = explainRegex(pattern);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Regex to English</h1>
        <p className="text-[var(--text-secondary)]">
          Explain any regular expression in plain English. Paste a regex and understand what it does. Free regex explainer.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono text-lg" />

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2 text-purple-400">Explanation</h3>
          <pre className="text-sm text-white whitespace-pre-wrap">{explanation || "Enter a regex above..."}</pre>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-gray-400">Try:</span>
          {[
            { label: "Email", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
            { label: "URL", pattern: "https?://[\\w-]+(\\.[\\w-]+)+[\\w.,@?^=%&:/~+#-]*" },
            { label: "Phone", pattern: "\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,3}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}" },
            { label: "IP", pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b" },
          ].map((p) => (
            <button key={p.label} onClick={() => setPattern(p.pattern)} className="px-2 py-1 rounded text-xs bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white">{p.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
