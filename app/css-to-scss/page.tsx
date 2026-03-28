"use client";
import { useState } from "react";

interface ParsedRule {
  selector: string;
  declarations: string[];
  children: ParsedRule[];
  atRule?: string;
}

function tokenizeCSS(css: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inString: string | null = null;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (inString) {
      current += ch;
      if (ch === inString && css[i - 1] !== "\\") inString = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      current += ch;
      inString = ch;
      continue;
    }
    if (ch === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      i = end >= 0 ? end + 1 : css.length;
      continue;
    }
    if (ch === "{" || ch === "}" || ch === ";") {
      if (current.trim()) tokens.push(current.trim());
      tokens.push(ch);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) tokens.push(current.trim());
  return tokens;
}

function parseCSS(tokens: string[]): ParsedRule[] {
  const rules: ParsedRule[] = [];
  let i = 0;
  while (i < tokens.length) {
    if (tokens[i] === "}" || tokens[i] === ";") { i++; continue; }
    if (i + 1 < tokens.length && tokens[i + 1] === "{") {
      const selector = tokens[i];
      i += 2;
      const rule: ParsedRule = { selector, declarations: [], children: [] };
      if (selector.startsWith("@media") || selector.startsWith("@supports") || selector.startsWith("@layer")) {
        rule.atRule = selector;
        const innerTokens: string[] = [];
        let depth = 1;
        while (i < tokens.length && depth > 0) {
          if (tokens[i] === "{") depth++;
          if (tokens[i] === "}") { depth--; if (depth === 0) { i++; break; } }
          innerTokens.push(tokens[i]);
          i++;
        }
        rule.children = parseCSS(innerTokens);
      } else {
        while (i < tokens.length && tokens[i] !== "}") {
          if (tokens[i] === ";") { i++; continue; }
          if (i + 1 < tokens.length && tokens[i + 1] === "{") {
            const childTokens: string[] = [tokens[i], tokens[i + 1]];
            i += 2;
            let depth = 1;
            while (i < tokens.length && depth > 0) {
              if (tokens[i] === "{") depth++;
              if (tokens[i] === "}") depth--;
              childTokens.push(tokens[i]);
              i++;
            }
            rule.children.push(...parseCSS(childTokens));
          } else {
            rule.declarations.push(tokens[i]);
            i++;
          }
        }
        i++;
      }
      rules.push(rule);
    } else {
      i++;
    }
  }
  return rules;
}

function nestRules(rules: ParsedRule[]): ParsedRule[] {
  const nested: ParsedRule[] = [];
  const map = new Map<string, ParsedRule>();

  for (const rule of rules) {
    if (rule.atRule) {
      nested.push(rule);
      continue;
    }
    const parts = rule.selector.split(/\s*,\s*/);
    for (const sel of parts) {
      const segments = sel.trim().split(/\s+/);
      if (segments.length === 1) {
        const existing = map.get(sel.trim());
        if (existing) {
          existing.declarations.push(...rule.declarations);
          existing.children.push(...rule.children);
        } else {
          const newRule: ParsedRule = { selector: sel.trim(), declarations: [...rule.declarations], children: [...rule.children] };
          map.set(sel.trim(), newRule);
          nested.push(newRule);
        }
      } else {
        const parent = segments[0];
        const childSel = segments.slice(1).join(" ");
        let parentRule = map.get(parent);
        if (!parentRule) {
          parentRule = { selector: parent, declarations: [], children: [] };
          map.set(parent, parentRule);
          nested.push(parentRule);
        }
        const childPrefix = childSel.startsWith(":") || childSel.startsWith("::") || childSel.startsWith("&") ? `&${childSel}` : childSel;
        parentRule.children.push({ selector: childPrefix, declarations: [...rule.declarations], children: [...rule.children] });
      }
    }
  }
  return nested;
}

function ruleToScss(rule: ParsedRule, indent: number = 0): string {
  const pad = "  ".repeat(indent);
  let out = "";
  if (rule.atRule) {
    out += `${pad}${rule.atRule} {\n`;
    for (const child of rule.children) {
      out += ruleToScss(child, indent + 1);
    }
    out += `${pad}}\n\n`;
    return out;
  }
  out += `${pad}${rule.selector} {\n`;
  for (const decl of rule.declarations) {
    out += `${pad}  ${decl};\n`;
  }
  if (rule.declarations.length > 0 && rule.children.length > 0) out += "\n";
  for (const child of rule.children) {
    out += ruleToScss(child, indent + 1);
  }
  out += `${pad}}\n\n`;
  return out;
}

function convertCssToScss(css: string): string {
  const tokens = tokenizeCSS(css);
  const flat = parseCSS(tokens);
  const nested = nestRules(flat);
  return nested.map((r) => ruleToScss(r, 0)).join("").trim();
}

const sampleCSS = `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.container .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.container .header .logo {
  font-size: 24px;
  font-weight: bold;
}

.container .header .nav {
  display: flex;
  gap: 16px;
}

.container .header .nav a {
  color: #333;
  text-decoration: none;
}

.container .main {
  padding: 32px 0;
}

@media (max-width: 768px) {
  .container {
    padding: 0 8px;
  }
  .container .header {
    flex-direction: column;
  }
}`;

export default function CssToScss() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    if (!input.trim()) { setError("Please enter some CSS."); return; }
    try {
      const result = convertCssToScss(input);
      setOutput(result);
    } catch (e) {
      setError(`Conversion error: ${(e as Error).message}`);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInput(sampleCSS);
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSS to SCSS Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert flat CSS to nested SCSS/Sass syntax automatically. Nests selectors based on hierarchy, preserves media queries, and generates clean SCSS.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 flex flex-wrap gap-3 items-center">
        <button
          onClick={convert}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold text-sm"
        >
          Convert to SCSS
        </button>
        <button onClick={loadSample} className="text-sm text-[var(--text-secondary)] hover:text-white">
          Load Sample
        </button>
        <button onClick={() => { setInput(""); setOutput(""); setError(""); }} className="text-sm text-[var(--text-secondary)] hover:text-white ml-auto">
          Clear
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-purple-400 mb-1 block">CSS Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder=".parent { ... }&#10;.parent .child { ... }"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-80 resize-none font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-bold text-emerald-400">SCSS Output</label>
            {output && (
              <button onClick={copy} className="text-xs text-[var(--text-secondary)] hover:text-white">
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Nested SCSS will appear here..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-emerald-400 h-80 resize-none font-mono text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">{error}</div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">What This Tool Does</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Nests child selectors under their parent automatically</li>
          <li>Preserves <code className="text-purple-400">@media</code> queries as-is</li>
          <li>Merges declarations for the same selector</li>
          <li>Handles pseudo-classes and pseudo-elements with <code className="text-purple-400">&amp;</code> syntax</li>
          <li>All processing happens locally in your browser</li>
        </ul>
      </div>
    </div>
  );
}
