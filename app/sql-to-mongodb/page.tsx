"use client";
import { useState } from "react";

function sqlToMongo(sql: string): string {
  const trimmed = sql.trim().replace(/;$/, "");

  // SELECT
  const selectMatch = trimmed.match(/^SELECT\s+(.*?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER\s+BY\s+(.*?))?(?:\s+LIMIT\s+(\d+))?$/i);
  if (selectMatch) {
    const [, fields, collection, where, orderBy, limit] = selectMatch;
    let query = `db.${collection}.find(`;

    // WHERE clause
    if (where) {
      const conditions = where.split(/\s+AND\s+/i).map((cond) => {
        const eqMatch = cond.match(/(\w+)\s*=\s*'?([^']*)'?/);
        const gtMatch = cond.match(/(\w+)\s*>\s*(\d+)/);
        const ltMatch = cond.match(/(\w+)\s*<\s*(\d+)/);
        const likeMatch = cond.match(/(\w+)\s+LIKE\s+'%(.*)%'/i);
        const inMatch = cond.match(/(\w+)\s+IN\s*\(([^)]+)\)/i);

        if (eqMatch) return `${eqMatch[1]}: ${isNaN(Number(eqMatch[2])) ? `"${eqMatch[2]}"` : eqMatch[2]}`;
        if (gtMatch) return `${gtMatch[1]}: { $gt: ${gtMatch[2]} }`;
        if (ltMatch) return `${ltMatch[1]}: { $lt: ${ltMatch[2]} }`;
        if (likeMatch) return `${likeMatch[1]}: { $regex: "${likeMatch[2]}", $options: "i" }`;
        if (inMatch) {
          const values = inMatch[2].split(",").map((v) => v.trim().replace(/'/g, '"'));
          return `${inMatch[1]}: { $in: [${values.join(", ")}] }`;
        }
        return cond;
      });
      query += `{ ${conditions.join(", ")} }`;
    } else {
      query += "{}";
    }

    // Projection
    if (fields !== "*") {
      const proj = fields.split(",").map((f) => `${f.trim()}: 1`).join(", ");
      query += `, { ${proj} }`;
    }

    query += ")";

    if (orderBy) {
      const sorts = orderBy.split(",").map((s) => {
        const parts = s.trim().split(/\s+/);
        return `${parts[0]}: ${parts[1]?.toUpperCase() === "DESC" ? -1 : 1}`;
      });
      query += `.sort({ ${sorts.join(", ")} })`;
    }

    if (limit) query += `.limit(${limit})`;

    return query;
  }

  // INSERT
  const insertMatch = trimmed.match(/^INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (insertMatch) {
    const [, collection, cols, vals] = insertMatch;
    const columns = cols.split(",").map((c) => c.trim());
    const values = vals.split(",").map((v) => v.trim().replace(/'/g, '"'));
    const doc = columns.map((c, i) => `${c}: ${values[i]}`).join(", ");
    return `db.${collection}.insertOne({ ${doc} })`;
  }

  // UPDATE
  const updateMatch = trimmed.match(/^UPDATE\s+(\w+)\s+SET\s+(.*?)\s+WHERE\s+(.*)/i);
  if (updateMatch) {
    const [, collection, setClause, where] = updateMatch;
    const sets = setClause.split(",").map((s) => {
      const [key, val] = s.split("=").map((x) => x.trim());
      return `${key}: ${val.replace(/'/g, '"')}`;
    });
    const conditions = where.split(/\s+AND\s+/i).map((cond) => {
      const [key, val] = cond.split("=").map((x) => x.trim());
      return `${key}: ${val?.replace(/'/g, '"') || ""}`;
    });
    return `db.${collection}.updateMany(\n  { ${conditions.join(", ")} },\n  { $set: { ${sets.join(", ")} } }\n)`;
  }

  // DELETE
  const deleteMatch = trimmed.match(/^DELETE\s+FROM\s+(\w+)\s+WHERE\s+(.*)/i);
  if (deleteMatch) {
    const [, collection, where] = deleteMatch;
    const conditions = where.split(/\s+AND\s+/i).map((cond) => {
      const [key, val] = cond.split("=").map((x) => x.trim());
      return `${key}: ${val?.replace(/'/g, '"') || ""}`;
    });
    return `db.${collection}.deleteMany({ ${conditions.join(", ")} })`;
  }

  return "// Could not parse SQL. Supports SELECT, INSERT, UPDATE, DELETE.";
}

const examples = [
  "SELECT * FROM users WHERE age > 25 ORDER BY name LIMIT 10",
  "SELECT name, email FROM users WHERE status = 'active' AND role = 'admin'",
  "INSERT INTO users (name, email, age) VALUES ('John', 'john@example.com', 30)",
  "UPDATE users SET status = 'inactive' WHERE last_login < '2024-01-01'",
  "DELETE FROM orders WHERE status = 'cancelled'",
  "SELECT * FROM products WHERE name LIKE '%phone%'",
];

export default function SQLToMongoDB() {
  const [sql, setSql] = useState(examples[0]);
  const [copied, setCopied] = useState(false);
  const output = sqlToMongo(sql);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">SQL to MongoDB Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert SQL queries to MongoDB shell commands. Supports SELECT, INSERT, UPDATE, DELETE with WHERE, ORDER BY, LIMIT.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {examples.slice(0, 4).map((e, i) => (
          <button key={i} onClick={() => setSql(e)} className="px-2 py-1 rounded text-[10px] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{e.slice(0, 40)}...</button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">SQL Query</label>
          <textarea value={sql} onChange={(e) => setSql(e.target.value)} placeholder="SELECT * FROM users WHERE ..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-48 resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">MongoDB Query</label>
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-48 overflow-auto font-mono text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
