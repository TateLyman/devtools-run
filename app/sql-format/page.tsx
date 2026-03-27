"use client";
import { useState } from "react";
function formatSql(sql: string): string {
  const keywords = ["SELECT","FROM","WHERE","AND","OR","ORDER BY","GROUP BY","HAVING","LIMIT","OFFSET","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","ON","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","CREATE TABLE","ALTER TABLE","DROP TABLE","AS","IN","NOT","BETWEEN","LIKE","IS NULL","IS NOT NULL","UNION","DISTINCT","COUNT","SUM","AVG","MAX","MIN","CASE","WHEN","THEN","ELSE","END"];
  let result = sql.replace(/\s+/g, " ").trim();
  keywords.forEach(kw => {
    const re = new RegExp(`\\b${kw}\\b`, "gi");
    result = result.replace(re, `\n${kw.toUpperCase()}`);
  });
  return result.replace(/^\n/, "").replace(/,\s*/g, ",\n  ");
}
export default function SqlFormat() {
  const [input, setInput] = useState("select u.name, u.email, count(o.id) as order_count from users u left join orders o on u.id = o.user_id where u.active = true and o.created_at > '2024-01-01' group by u.name, u.email having count(o.id) > 5 order by order_count desc limit 10");
  const output = formatSql(input);
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">SQL Formatter</h1></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Messy SQL</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={12} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Formatted</label><button onClick={()=>navigator.clipboard.writeText(output)} className="text-xs text-blue-400">Copy</button></div><textarea value={output} readOnly rows={12} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none text-emerald-400" /></div>
      </div>
    </div>
  );
}
