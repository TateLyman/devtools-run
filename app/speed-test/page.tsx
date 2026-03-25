"use client";
import { useState } from "react";

export default function SpeedTestPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  async function test() {
    if (!url) return;
    setTesting(true);
    const target = url.startsWith("http") ? url : `https://${url}`;
    const times: number[] = [];
    for (let i = 0; i < 3; i++) {
      const start = Date.now();
      try { await fetch(`/api/uptime?url=${encodeURIComponent(target)}`); } catch {}
      times.push(Date.now() - start);
    }
    const avg = Math.round(times.reduce((a,b)=>a+b,0)/times.length);
    const min = Math.min(...times);
    const max = Math.max(...times);
    setResult({ url: target, avg, min, max, grade: avg < 300 ? "A" : avg < 600 ? "B" : avg < 1000 ? "C" : avg < 2000 ? "D" : "F" });
    setTesting(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Website Speed Test</h1>
        <p className="text-gray-400 text-center mb-8">Test how fast any website responds. 3 requests averaged.</p>
        <div className="flex gap-2 mb-8">
          <input type="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yoursite.com" onKeyDown={e=>e.key==="Enter"&&test()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <button onClick={test} disabled={testing} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold disabled:opacity-50">{testing?"Testing...":"Test Speed"}</button>
        </div>
        {result && (
          <div className="bg-gray-900 rounded-xl p-8 text-center">
            <div className={`text-6xl font-extrabold mb-2 ${result.grade==="A"?"text-green-400":result.grade==="B"?"text-blue-400":result.grade==="C"?"text-yellow-400":"text-red-400"}`}>{result.grade}</div>
            <div className="text-xl mb-4">{result.avg}ms average</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><div className="text-lg font-bold text-green-400">{result.min}ms</div><div className="text-xs text-gray-400">Fastest</div></div>
              <div><div className="text-lg font-bold text-purple-400">{result.avg}ms</div><div className="text-xs text-gray-400">Average</div></div>
              <div><div className="text-lg font-bold text-red-400">{result.max}ms</div><div className="text-xs text-gray-400">Slowest</div></div>
            </div>
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/uptime" className="text-purple-400 hover:underline">Uptime Monitor</a>{" | "}
          <a href="/responsive" className="text-purple-400 hover:underline">Responsive Test</a>{" | "}
          <a href="/seo-checklist" className="text-purple-400 hover:underline">SEO Checklist</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
