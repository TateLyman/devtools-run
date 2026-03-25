"use client";
import { useState } from "react";

export default function NpmNamePage() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name.toLowerCase())}`);
      if (res.status === 404) setResult({ available: true, name: name.toLowerCase() });
      else { const data = await res.json(); setResult({ available: false, name: data.name, desc: data.description, version: data["dist-tags"]?.latest }); }
    } catch { setResult({ available: true, name: name.toLowerCase() }); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">NPM Name Checker</h1>
        <p className="text-gray-400 text-center mb-8">Check if a package name is available on npm.</p>
        <div className="flex gap-2 mb-6">
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="my-cool-package" onKeyDown={e=>e.key==="Enter"&&check()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono" />
          <button onClick={check} disabled={loading} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold disabled:opacity-50">{loading?"...":"Check"}</button>
        </div>
        {result && (
          <div className={`rounded-xl p-6 text-center ${result.available?"bg-green-900/20 border border-green-700":"bg-red-900/20 border border-red-700"}`}>
            <div className="text-2xl font-bold mb-1">{result.available?"Available!":"Taken"}</div>
            <div className="font-mono text-lg text-purple-400">{result.name}</div>
            {!result.available && result.desc && <div className="text-sm text-gray-400 mt-2">{result.desc} (v{result.version})</div>}
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/cheatsheet/javascript" className="text-purple-400 hover:underline">JS Cheatsheet</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/gitignore" className="text-purple-400 hover:underline">.gitignore</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
