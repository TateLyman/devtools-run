"use client";
import { useState } from "react";

export default function NPMPackageSize() {
  const [pkg, setPkg] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!pkg.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://bundlephobia.com/api/size?package=${encodeURIComponent(pkg.trim())}`);
      if (!res.ok) throw new Error("Package not found");
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({ error: e.message });
    }
    setLoading(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">NPM Package Size Checker</h1>
        <p className="text-[var(--text-secondary)]">
          Check the bundle size of any NPM package. See minified, gzipped, and dependency sizes. Free package size checker.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={pkg} onChange={(e) => setPkg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="react, lodash, axios..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono" />
        <button onClick={check} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "..." : "Check"}</button>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {["react", "vue", "svelte", "lodash", "axios", "express", "next", "tailwindcss", "zod", "date-fns"].map((p) => (
          <button key={p} onClick={() => { setPkg(p); }} className="px-2 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{p}</button>
        ))}
      </div>

      {result && !result.error && (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-1">{result.name}@{result.version}</h2>
            <p className="text-xs text-gray-400">{result.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">{formatSize(result.size)}</p>
              <p className="text-xs text-gray-400">Minified</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{formatSize(result.gzip)}</p>
              <p className="text-xs text-gray-400">Gzipped</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{result.dependencyCount}</p>
              <p className="text-xs text-gray-400">Dependencies</p>
            </div>
          </div>

          {result.dependencySizes?.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2">Dependency Sizes</h3>
              <div className="space-y-1 max-h-32 overflow-auto">
                {result.dependencySizes.sort((a: any, b: any) => b.approximateSize - a.approximateSize).map((dep: any) => (
                  <div key={dep.name} className="flex justify-between text-xs">
                    <span className="text-white font-mono">{dep.name}</span>
                    <span className="text-gray-400">{formatSize(dep.approximateSize)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {result?.error && <p className="text-red-400 text-center text-sm">{result.error}</p>}
    </div>
  );
}
