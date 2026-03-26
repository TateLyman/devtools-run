"use client";
import { useState } from "react";

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (c === '"') { inQuotes = !inQuotes; }
    else if (c === "," && !inQuotes) { row.push(current.trim()); current = ""; }
    else if ((c === "\n" || c === "\r") && !inQuotes) { if (current || row.length) { row.push(current.trim()); rows.push(row); row = []; current = ""; } }
    else { current += c; }
  }
  if (current || row.length) { row.push(current.trim()); rows.push(row); }
  return rows;
}

const SAMPLE = `Name,Age,City,Email
Alice Johnson,30,New York,alice@example.com
Bob Smith,25,Los Angeles,bob@example.com
Charlie Brown,35,Chicago,charlie@example.com
Diana Ross,28,Houston,diana@example.com
Eve Williams,42,Phoenix,eve@example.com`;

export default function CSVViewer() {
  const [csv, setCSV] = useState(SAMPLE);
  const [sortCol, setSortCol] = useState(-1);
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");

  const rows = parseCSV(csv);
  const headers = rows[0] || [];
  let data = rows.slice(1);

  if (sortCol >= 0) {
    data.sort((a, b) => {
      const va = a[sortCol] || "", vb = b[sortCol] || "";
      const na = parseFloat(va), nb = parseFloat(vb);
      const cmp = !isNaN(na) && !isNaN(nb) ? na - nb : va.localeCompare(vb);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  const handleSort = (col: number) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = () => setCSV(r.result as string); r.readAsText(file); }
  };

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSV Viewer</h1><p className="text-[var(--text-secondary)]">View and sort CSV data as a table</p></section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex gap-2 mb-2">
          <input type="file" accept=".csv" onChange={handleFile} className="text-sm" />
          <button onClick={() => setCSV(SAMPLE)} className="text-xs text-blue-400">Load Sample</button>
        </div>
        <textarea value={csv} onChange={e => setCSV(e.target.value)} rows={4}
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" placeholder="Paste CSV data here..." />
      </div>

      <div className="text-xs text-[var(--text-secondary)] text-center">{data.length} rows, {headers.length} columns</div>

      {headers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>{headers.map((h, i) => (
                <th key={i} onClick={() => handleSort(i)} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-2 text-left cursor-pointer hover:bg-[var(--bg-primary)]">
                  {h} {sortCol === i && (sortDir === "asc" ? "↑" : "↓")}
                </th>
              ))}</tr>
            </thead>
            <tbody>
              {data.map((row, r) => (
                <tr key={r} className="hover:bg-[var(--bg-secondary)]">
                  {row.map((cell, c) => <td key={c} className="border border-[var(--border)] px-3 py-1.5">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
