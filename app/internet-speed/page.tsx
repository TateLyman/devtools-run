"use client";
import { useState } from "react";

export default function SpeedTest() {
  const [testing, setTesting] = useState(false);
  const [speed, setSpeed] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const runTest = async () => {
    setTesting(true); setSpeed(null); setLatency(null); setProgress(0);
    
    // Latency test
    const pingStart = performance.now();
    try { await fetch("https://www.google.com/generate_204", { mode: "no-cors", cache: "no-store" }); } catch {}
    const lat = Math.round(performance.now() - pingStart);
    setLatency(lat);
    setProgress(20);

    // Download test - fetch progressively larger payloads
    const sizes = [
      { url: `https://devtools-site-delta.vercel.app/api/health?t=${Date.now()}`, expected: 0.001 },
    ];
    
    let totalBytes = 0;
    const start = performance.now();
    
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch(`https://devtools-site-delta.vercel.app/sitemap.xml?t=${Date.now()}-${i}`, { cache: "no-store" });
        const data = await res.text();
        totalBytes += data.length;
      } catch {}
      setProgress(20 + (i + 1) * 16);
    }
    
    const elapsed = (performance.now() - start) / 1000;
    const mbps = (totalBytes * 8) / (elapsed * 1000000);
    setSpeed(Math.round(mbps * 10) / 10);
    setProgress(100);
    setTesting(false);
  };

  const getSpeedLabel = (s: number) => {
    if (s < 5) return { label: "Slow", color: "text-red-400", desc: "Basic browsing only" };
    if (s < 25) return { label: "Moderate", color: "text-yellow-400", desc: "Good for HD streaming" };
    if (s < 100) return { label: "Fast", color: "text-emerald-400", desc: "Great for 4K streaming" };
    return { label: "Very Fast", color: "text-blue-400", desc: "Excellent for everything" };
  };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Internet Speed Test</h1>
        <p className="text-[var(--text-secondary)]">Check your download speed and latency</p>
      </section>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-12 text-center">
        {speed !== null ? (
          <>
            <div className="text-6xl font-bold text-blue-400">{speed}</div>
            <div className="text-xl text-[var(--text-secondary)]">Mbps</div>
            <div className={`text-lg font-bold mt-2 ${getSpeedLabel(speed).color}`}>{getSpeedLabel(speed).label}</div>
            <div className="text-sm text-[var(--text-secondary)]">{getSpeedLabel(speed).desc}</div>
          </>
        ) : testing ? (
          <>
            <div className="text-2xl font-bold text-blue-400 animate-pulse">Testing...</div>
            <div className="w-full max-w-xs mx-auto bg-[var(--bg-primary)] rounded-full h-3 mt-4">
              <div className="h-3 rounded-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <button onClick={runTest} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full text-xl font-bold">
            Start Test
          </button>
        )}
      </div>

      {(speed !== null || latency !== null) && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
            <div className="text-xs text-[var(--text-secondary)]">Download</div>
            <div className="text-3xl font-bold text-blue-400">{speed ?? "..."} <span className="text-sm">Mbps</span></div>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
            <div className="text-xs text-[var(--text-secondary)]">Latency</div>
            <div className="text-3xl font-bold text-emerald-400">{latency ?? "..."} <span className="text-sm">ms</span></div>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
            <div className="text-xs text-[var(--text-secondary)]">Status</div>
            <div className={`text-3xl font-bold ${speed ? getSpeedLabel(speed).color : ""}`}>{speed ? getSpeedLabel(speed).label : "..."}</div>
          </div>
        </div>
      )}

      {speed !== null && (
        <div className="flex justify-center">
          <button onClick={runTest} className="bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-primary)] px-6 py-2 rounded-lg text-sm font-bold">Test Again</button>
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Speed Recommendations</h2>
        <div className="grid gap-2 md:grid-cols-2 text-sm">
          {[
            { activity: "Email & browsing", speed: "1-5 Mbps" },
            { activity: "HD video streaming", speed: "5-25 Mbps" },
            { activity: "4K video streaming", speed: "25-50 Mbps" },
            { activity: "Online gaming", speed: "25-50 Mbps" },
            { activity: "Video conferencing", speed: "10-25 Mbps" },
            { activity: "Large file downloads", speed: "50-100+ Mbps" },
          ].map(r => (
            <div key={r.activity} className="flex justify-between bg-[var(--bg-primary)] rounded-lg px-4 py-2">
              <span>{r.activity}</span>
              <span className="text-[var(--text-secondary)] font-mono">{r.speed}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
