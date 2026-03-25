"use client";
import { useState } from "react";

function formatSQL(sql: string, indent: number = 2): string {
  const sp = " ".repeat(indent);
  let result = sql.trim();

  // Uppercase keywords
  const keywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN",
    "INNER JOIN", "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "ON", "AS",
    "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "UNION", "UNION ALL",
    "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "DELETE",
    "CREATE TABLE", "CREATE INDEX", "CREATE VIEW", "ALTER TABLE", "DROP TABLE",
    "DROP INDEX", "DROP VIEW", "TRUNCATE", "BEGIN", "COMMIT", "ROLLBACK",
    "CASE", "WHEN", "THEN", "ELSE", "END", "IN", "NOT IN", "EXISTS", "NOT EXISTS",
    "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL", "ASC", "DESC", "DISTINCT",
    "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "CAST",
    "PRIMARY KEY", "FOREIGN KEY", "REFERENCES", "CONSTRAINT", "DEFAULT",
    "NOT NULL", "UNIQUE", "INDEX", "IF EXISTS", "IF NOT EXISTS",
    "WITH", "RECURSIVE", "FETCH", "NEXT", "ROWS ONLY",
  ];

  // Uppercase all keywords
  keywords.forEach((kw) => {
    result = result.replace(new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi"), kw);
  });

  // Add newlines before major clauses
  const majorClauses = [
    "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING",
    "LIMIT", "OFFSET", "UNION ALL", "UNION", "JOIN", "LEFT JOIN",
    "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "FULL JOIN", "CROSS JOIN",
    "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
    "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
  ];

  majorClauses.forEach((clause) => {
    result = result.replace(new RegExp(`\\b${clause}\\b`, "g"), `\n${clause}`);
  });

  // Indent sub-clauses
  result = result.replace(/\bAND\b/g, `\n${sp}AND`);
  result = result.replace(/\bOR\b/g, `\n${sp}OR`);
  result = result.replace(/\bON\b/g, `\n${sp}ON`);

  // Clean up multiple newlines
  result = result.replace(/\n\s*\n/g, "\n").trim();

  // Indent after SELECT, SET
  const lines = result.split("\n");
  const formatted: string[] = [];
  let inSelect = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("SELECT")) {
      inSelect = true;
      formatted.push(trimmed);
    } else if (["FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "SET", "VALUES", "UNION"].some((k) => trimmed.startsWith(k))) {
      inSelect = false;
      formatted.push(trimmed);
    } else if (inSelect && !trimmed.startsWith("AND") && !trimmed.startsWith("OR")) {
      formatted.push(sp + trimmed);
    } else {
      formatted.push(trimmed);
    }
  }

  return formatted.join("\n");
}

const sampleSQL = `select u.id, u.name, u.email, count(o.id) as order_count, sum(o.total) as total_spent from users u left join orders o on u.id = o.user_id where u.created_at > '2024-01-01' and u.status = 'active' group by u.id, u.name, u.email having count(o.id) > 5 order by total_spent desc limit 100`;

export default function SQLFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const output = input.trim() ? formatSQL(input, indent) : "";

  const handleFormat = () => setInput(formatSQL(input, indent));
  const handleMinify = () => setInput(input.replace(/\s+/g, " ").trim());
  const handleCopy = () => {
    navigator.clipboard.writeText(output || input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">SQL Formatter & Beautifier</h1>
        <p className="text-[var(--text-secondary)]">
          Format and beautify SQL queries. Auto-uppercase keywords, add proper indentation. Supports SELECT, INSERT, UPDATE, DELETE, CREATE, and more.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={handleFormat} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold">Format</button>
        <button onClick={handleMinify} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Minify</button>
        <button onClick={() => setInput(sampleSQL)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Load Example</button>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-white text-sm">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
        <button onClick={handleCopy} className="text-sm text-purple-400 hover:text-purple-300 ml-auto">{copied ? "Copied!" : "Copy"}</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Input SQL</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your SQL query here..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[450px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Formatted</label>
          <pre className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[450px] overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
