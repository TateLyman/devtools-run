"use client";

import { useState } from "react";

const MAJOR_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "FULL OUTER JOIN",
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "CROSS JOIN",
  "ON",
  "AND",
  "OR",
  "ORDER BY",
  "GROUP BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "UNION",
  "UNION ALL",
  "INTERSECT",
  "EXCEPT",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "CREATE TABLE",
  "CREATE INDEX",
  "ALTER TABLE",
  "DROP TABLE",
  "DROP INDEX",
  "ADD COLUMN",
  "DROP COLUMN",
  "MODIFY COLUMN",
  "PRIMARY KEY",
  "FOREIGN KEY",
  "REFERENCES",
  "NOT NULL",
  "DEFAULT",
  "DISTINCT",
  "AS",
  "IN",
  "EXISTS",
  "BETWEEN",
  "LIKE",
  "IS NULL",
  "IS NOT NULL",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "ASC",
  "DESC",
];

// Keywords that trigger a newline before them
const NEWLINE_BEFORE = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "FULL OUTER JOIN",
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "CROSS JOIN",
  "ON",
  "ORDER BY",
  "GROUP BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "UNION",
  "UNION ALL",
  "INTERSECT",
  "EXCEPT",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "CREATE TABLE",
  "ALTER TABLE",
  "DROP TABLE",
]);

// Keywords that increase indent for subsequent content
const INDENT_AFTER = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "SET",
  "VALUES",
  "ON",
]);

// Keywords that trigger AND/OR sub-indentation
const SUB_INDENT = new Set(["AND", "OR"]);

function formatSQL(input: string): string {
  if (!input.trim()) return "";

  // Normalize whitespace
  let sql = input.replace(/\s+/g, " ").trim();

  // Tokenize: split into meaningful tokens while preserving strings
  const tokens: string[] = [];
  let i = 0;
  while (i < sql.length) {
    // Skip whitespace
    if (sql[i] === " ") {
      i++;
      continue;
    }

    // String literal (single quote)
    if (sql[i] === "'") {
      let j = i + 1;
      while (j < sql.length && (sql[j] !== "'" || sql[j + 1] === "'")) {
        if (sql[j] === "'" && sql[j + 1] === "'") j += 2;
        else j++;
      }
      tokens.push(sql.slice(i, j + 1));
      i = j + 1;
      continue;
    }

    // Parentheses and commas
    if ("(),;".includes(sql[i])) {
      tokens.push(sql[i]);
      i++;
      continue;
    }

    // Regular token (word, number, operator)
    let j = i;
    while (j < sql.length && !" (),;'".includes(sql[j])) j++;
    tokens.push(sql.slice(i, j));
    i = j;
  }

  // Now format: uppercase keywords, add newlines and indentation
  const lines: string[] = [];
  let currentLine = "";
  let indent = 0;
  const indentStr = "  ";
  let parenDepth = 0;

  function pushLine() {
    if (currentLine.trim()) {
      lines.push(indentStr.repeat(indent) + currentLine.trim());
    }
    currentLine = "";
  }

  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t];
    const upper = token.toUpperCase();

    // Check for multi-word keywords
    let multiWord = "";
    if (t + 1 < tokens.length) {
      const twoWord = upper + " " + tokens[t + 1].toUpperCase();
      if (t + 2 < tokens.length) {
        const threeWord = twoWord + " " + tokens[t + 2].toUpperCase();
        if (NEWLINE_BEFORE.has(threeWord) || MAJOR_KEYWORDS.includes(threeWord)) {
          multiWord = threeWord;
        }
      }
      if (!multiWord && (NEWLINE_BEFORE.has(twoWord) || MAJOR_KEYWORDS.includes(twoWord))) {
        multiWord = twoWord;
      }
    }

    const keyword = multiWord || (MAJOR_KEYWORDS.includes(upper) ? upper : "");
    const skipExtra = multiWord ? (multiWord.split(" ").length - 1) : 0;

    if (token === "(") {
      parenDepth++;
      currentLine += " (";
      continue;
    }

    if (token === ")") {
      parenDepth--;
      currentLine += ")";
      continue;
    }

    if (token === ",") {
      currentLine += ",";
      // Newline after comma in SELECT, VALUES
      if (parenDepth === 0) {
        pushLine();
      }
      continue;
    }

    if (token === ";") {
      currentLine += ";";
      pushLine();
      indent = 0;
      lines.push(""); // blank line between statements
      continue;
    }

    if (keyword && parenDepth === 0) {
      if (NEWLINE_BEFORE.has(keyword)) {
        pushLine();
        if (INDENT_AFTER.has(keyword)) {
          // Keyword goes at current indent, contents indented more
          lines.push(indentStr.repeat(Math.max(0, indent > 0 ? indent - 1 : 0)) + keyword);
          currentLine = "";
          if (skipExtra) t += skipExtra;
          // Keep indent
          if (indent === 0) indent = 1;
          continue;
        }
        if (SUB_INDENT.has(keyword)) {
          currentLine = keyword;
          if (skipExtra) t += skipExtra;
          continue;
        }
        indent = keyword === "SELECT" || keyword === "INSERT INTO" || keyword === "UPDATE" || keyword === "DELETE FROM" || keyword === "CREATE TABLE" || keyword === "ALTER TABLE" || keyword === "DROP TABLE" ? 1 : 1;
        lines.push(keyword);
        currentLine = "";
        if (skipExtra) t += skipExtra;
        continue;
      }

      if (SUB_INDENT.has(keyword)) {
        pushLine();
        currentLine = keyword;
        if (skipExtra) t += skipExtra;
        continue;
      }

      // Other keyword: uppercase it
      currentLine += (currentLine ? " " : "") + keyword;
      if (skipExtra) t += skipExtra;
      continue;
    }

    // Regular token
    currentLine += (currentLine ? " " : "") + token;
  }

  pushLine();

  // Clean up: remove trailing blank lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  return lines.join("\n");
}

export default function SqlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function format() {
    setOutput(formatSQL(input));
  }

  function uppercase() {
    // Just uppercase all SQL keywords in the input
    setOutput(formatSQL(input));
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">SQL Formatter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Paste messy SQL to format with proper indentation and keyword
          uppercasing. Runs entirely in your browser.
        </p>
      </div>

      <div className="ad-slot mb-6">
        <span>Ad Space</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Input SQL</label>
          <textarea
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="select id, name from users where active = 1 order by name"
            spellCheck={false}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={format}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
            >
              Format
            </button>
            <button
              onClick={uppercase}
              className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm font-medium transition-colors"
            >
              Uppercase Keywords
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Formatted SQL</label>
            {output && (
              <button
                onClick={copyOutput}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            )}
          </div>
          <pre className="min-h-[340px]">{output}</pre>
        </div>
      </div>

      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">About SQL Formatter</h2>
        <p>
          This free online SQL formatter beautifies your SQL queries with proper
          indentation and uppercased keywords. Supports SELECT, INSERT, UPDATE,
          DELETE, CREATE, and ALTER statements. All processing happens in your
          browser.
        </p>
      </section>
    </>
  );
}
