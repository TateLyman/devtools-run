"use client";
import { useState } from "react";

function formatJS(code: string, indent: number): string {
  // Simple JS/TS formatter
  let result = "";
  let depth = 0;
  let inString = false;
  let stringChar = "";
  let inComment = false;
  let inLineComment = false;
  const sp = " ".repeat(indent);

  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      result += c;
      if (c === "\n") inLineComment = false;
      continue;
    }

    if (inComment) {
      result += c;
      if (c === "*" && next === "/") {
        result += "/";
        i++;
        inComment = false;
      }
      continue;
    }

    if (inString) {
      result += c;
      if (c === stringChar && code[i - 1] !== "\\") inString = false;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      inString = true;
      stringChar = c;
      result += c;
      continue;
    }

    if (c === "/" && next === "/") {
      inLineComment = true;
      result += c;
      continue;
    }

    if (c === "/" && next === "*") {
      inComment = true;
      result += c;
      continue;
    }

    if (c === "{" || c === "[") {
      depth++;
      result += c + "\n" + sp.repeat(depth);
      continue;
    }

    if (c === "}" || c === "]") {
      depth = Math.max(0, depth - 1);
      result += "\n" + sp.repeat(depth) + c;
      continue;
    }

    if (c === "," && !inString) {
      result += ",\n" + sp.repeat(depth);
      continue;
    }

    if (c === ";" && !inString) {
      result += ";\n" + sp.repeat(depth);
      continue;
    }

    if (c === "\n" || c === "\r") continue;
    if (c === " " && (result.endsWith(" ") || result.endsWith("\n"))) continue;

    result += c;
  }

  return result.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
}

function formatCSS(code: string, indent: number): string {
  const sp = " ".repeat(indent);
  return code
    .replace(/\s*{\s*/g, " {\n" + sp)
    .replace(/\s*}\s*/g, "\n}\n\n")
    .replace(/;\s*/g, ";\n" + sp)
    .replace(/,\s*/g, ",\n")
    .replace(new RegExp(sp + "}", "g"), "}")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

function formatHTML(code: string, indent: number): string {
  const sp = " ".repeat(indent);
  let depth = 0;
  const selfClosing = new Set(["br", "hr", "img", "input", "meta", "link", "area", "base", "col", "embed", "source"]);

  return code
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (!line) return "";

      const isClosing = line.startsWith("</");
      const tagMatch = line.match(/<\/?(\w+)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : "";
      const isSelfClosing = selfClosing.has(tagName) || line.endsWith("/>");

      if (isClosing) depth = Math.max(0, depth - 1);
      const result = sp.repeat(depth) + line;
      if (!isClosing && !isSelfClosing && tagMatch && !line.startsWith("<!")) depth++;

      return result;
    })
    .filter(Boolean)
    .join("\n");
}

function formatSQL(code: string): string {
  const keywords = ["SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE"];
  let result = code.trim();
  keywords.forEach((kw) => {
    result = result.replace(new RegExp(`\\b${kw}\\b`, "gi"), `\n${kw}`);
  });
  return result.trim();
}

export default function CodeFormatter() {
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("javascript");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const format = () => {
    switch (lang) {
      case "javascript":
      case "typescript":
      case "json":
        if (lang === "json") {
          try {
            setInput(JSON.stringify(JSON.parse(input), null, indent));
          } catch {
            setInput(formatJS(input, indent));
          }
        } else {
          setInput(formatJS(input, indent));
        }
        break;
      case "css":
        setInput(formatCSS(input, indent));
        break;
      case "html":
        setInput(formatHTML(input, indent));
        break;
      case "sql":
        setInput(formatSQL(input));
        break;
    }
  };

  const minify = () => {
    if (lang === "json") {
      try { setInput(JSON.stringify(JSON.parse(input))); return; } catch {}
    }
    setInput(input.replace(/\s+/g, " ").replace(/\s*([{}();,:])\s*/g, "$1").trim());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Code Formatter & Beautifier</h1>
        <p className="text-[var(--text-secondary)]">
          Format and beautify JavaScript, TypeScript, JSON, CSS, HTML, and SQL code. Minify or pretty-print with customizable indentation.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="json">JSON</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="sql">SQL</option>
        </select>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-white text-sm">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={1}>Tab (1)</option>
        </select>
        <button onClick={format} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold">Format</button>
        <button onClick={minify} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Minify</button>
        <button onClick={handleCopy} className="text-sm text-purple-400 hover:text-purple-300 ml-auto">{copied ? "Copied!" : "Copy"}</button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Paste your ${lang} code here...`}
        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-[500px] resize-none font-mono text-sm"
        spellCheck={false}
      />

      <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
        <span>{input.length.toLocaleString()} chars</span>
        <span>{input.split("\n").length} lines</span>
      </div>
    </div>
  );
}
