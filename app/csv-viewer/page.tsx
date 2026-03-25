"use client";
import { useState } from "react";

export default function CSVViewerPage() {
  const [csv, setCsv] = useState("name,age,city\nAlice,30,NYC\nBob,25,LA\nCharlie,35,Chicago");
  const rows = csv.split("\n").map(r => r.split(","));
  const headers = rows[0] || [];
  const data = rows.slice(1);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">CSV Viewer</h1>
        <p className="text-gray-400 text-center mb-8">Paste CSV data to view as a table. Edit inline.</p>
        <textarea value={csv} onChange={e=>setCsv(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-green-400 font-mono text-sm h-32 resize-none mb-6" />
        {headers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-700">{headers.map((h,i)=><th key={i} className="text-left py-2 px-3 text-purple-400">{h}</th>)}</tr></thead>
              <tbody>{data.map((row,i)=><tr key={i} className="border-b border-gray-800 hover:bg-gray-900">{row.map((cell,j)=><td key={j} className="py-2 px-3">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )}
        <div className="mt-4 text-center">
          <button onClick={()=>{const j=data.map(r=>{const o:any={};headers.forEach((h,i)=>o[h]=r[i]);return o;});navigator.clipboard.writeText(JSON.stringify(j,null,2));}} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-bold">Copy as JSON</button>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/convert/json-to-csv" className="text-purple-400 hover:underline">JSON→CSV</a>{" | "}
          <a href="/convert/csv-to-json" className="text-purple-400 hover:underline">CSV→JSON</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
