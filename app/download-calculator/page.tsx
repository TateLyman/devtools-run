"use client";
import { useState } from "react";

const SPEED_PRESETS = [
  { name: "3G", mbps: 5 }, { name: "4G LTE", mbps: 25 }, { name: "5G", mbps: 100 },
  { name: "Cable", mbps: 100 }, { name: "Fiber 500", mbps: 500 }, { name: "Fiber 1G", mbps: 1000 },
  { name: "WiFi 5", mbps: 300 }, { name: "WiFi 6", mbps: 600 },
];

const FILE_PRESETS = [
  { name: "MP3 Song", mb: 5 }, { name: "Photo (RAW)", mb: 25 }, { name: "App Update", mb: 100 },
  { name: "HD Movie", mb: 1500 }, { name: "4K Movie", mb: 5000 }, { name: "AAA Game", mb: 50000 },
  { name: "OS Image", mb: 5000 }, { name: "Backup (50GB)", mb: 50000 },
];

function formatTime(seconds: number): string {
  if (seconds < 1) return "< 1 second";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s || !parts.length) parts.push(`${s}s`);
  return parts.join(" ");
}

function calcSeconds(fileMB: number, speedMbps: number): number {
  return (fileMB * 8) / speedMbps;
}

export default function DownloadCalc() {
  const [fileSize, setFileSize] = useState("1");
  const [fileUnit, setFileUnit] = useState("GB");
  const [speed, setSpeed] = useState("100");
  const [speedUnit, setSpeedUnit] = useState("Mbps");

  const fileMB = parseFloat(fileSize) * (fileUnit === "B" ? 1e-6 : fileUnit === "KB" ? 0.001 : fileUnit === "MB" ? 1 : fileUnit === "GB" ? 1000 : 1000000);
  const speedMbps = parseFloat(speed) * (speedUnit === "Kbps" ? 0.001 : speedUnit === "Mbps" ? 1 : 1000);
  const seconds = speedMbps > 0 ? calcSeconds(fileMB, speedMbps) : 0;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Download Time Calculator</h1>
        <p className="text-[var(--text-secondary)]">How long will your download take?</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">File Size</label>
            <div className="flex gap-2">
              <input value={fileSize} onChange={e => setFileSize(e.target.value)} type="number" min="0" step="any" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" />
              <select value={fileUnit} onChange={e => setFileUnit(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-2">
                {["B", "KB", "MB", "GB", "TB"].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Internet Speed</label>
            <div className="flex gap-2">
              <input value={speed} onChange={e => setSpeed(e.target.value)} type="number" min="0" step="any" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" />
              <select value={speedUnit} onChange={e => setSpeedUnit(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-2">
                {["Kbps", "Mbps", "Gbps"].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {SPEED_PRESETS.map(p => (
            <button key={p.name} onClick={() => { setSpeed(p.mbps.toString()); setSpeedUnit("Mbps"); }}
              className={`text-xs px-2 py-1 rounded border ${Number(speed) === p.mbps && speedUnit === "Mbps" ? "bg-blue-600 border-blue-500 text-white" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"}`}>
              {p.name} ({p.mbps} Mbps)
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-8 text-center">
        <div className="text-sm text-[var(--text-secondary)] mb-1">Estimated Download Time</div>
        <div className="text-4xl font-bold text-blue-400">{formatTime(seconds)}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-2">{fileMB.toFixed(1)} MB at {speedMbps.toFixed(1)} Mbps</div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Speed Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
              <th className="py-2 pr-4">Connection</th><th className="py-2 pr-4">Speed</th><th className="py-2">Time</th>
            </tr></thead>
            <tbody>
              {SPEED_PRESETS.map(p => (
                <tr key={p.name} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4">{p.name}</td>
                  <td className="py-2 pr-4 font-mono text-[var(--text-secondary)]">{p.mbps} Mbps</td>
                  <td className="py-2 font-mono">{formatTime(calcSeconds(fileMB, p.mbps))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Common File Sizes at Your Speed</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {FILE_PRESETS.map(f => (
            <div key={f.name} className="flex justify-between items-center bg-[var(--bg-primary)] rounded-lg px-4 py-2">
              <span className="text-sm">{f.name} <span className="text-[var(--text-secondary)]">({f.mb >= 1000 ? (f.mb / 1000).toFixed(0) + " GB" : f.mb + " MB"})</span></span>
              <span className="font-mono text-sm text-blue-400">{formatTime(calcSeconds(f.mb, speedMbps))}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
