"use client";
import { useState, useEffect } from "react";

export default function ScreenRes() {
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    const update = () => {
      setInfo({
        "Screen Resolution": `${screen.width} × ${screen.height}`,
        "Viewport Size": `${window.innerWidth} × ${window.innerHeight}`,
        "Available Screen": `${screen.availWidth} × ${screen.availHeight}`,
        "Device Pixel Ratio": `${window.devicePixelRatio}x`,
        "Color Depth": `${screen.colorDepth}-bit`,
        "Orientation": window.innerWidth > window.innerHeight ? "Landscape" : "Portrait",
        "Touch Support": "ontouchstart" in window ? "Yes" : "No",
        "Browser Window": `${window.outerWidth} × ${window.outerHeight}`,
        "Effective Resolution": `${Math.round(screen.width * window.devicePixelRatio)} × ${Math.round(screen.height * window.devicePixelRatio)}`,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const copy = (v: string) => navigator.clipboard.writeText(v);

  const common = [
    ["1920 × 1080", "Full HD", "47.6%"], ["1366 × 768", "HD", "12.3%"], ["2560 × 1440", "QHD", "8.1%"],
    ["3840 × 2160", "4K UHD", "6.2%"], ["1536 × 864", "HD+", "5.8%"], ["1440 × 900", "WXGA+", "3.2%"],
    ["1280 × 720", "HD", "2.9%"], ["2560 × 1080", "UWFHD", "2.1%"], ["3440 × 1440", "UWQHD", "1.4%"],
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">What is My Screen Resolution?</h1>
        <p className="text-[var(--text-secondary)]">Your display details detected in real-time</p>
      </section>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-8 text-center">
        <div className="text-sm text-[var(--text-secondary)]">Your Screen Resolution</div>
        <div className="text-5xl font-bold text-blue-400 my-2">{info["Screen Resolution"] || "..."}</div>
        <div className="text-sm text-[var(--text-secondary)]">Viewport: {info["Viewport Size"] || "..."}</div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {Object.entries(info).map(([k, v]) => (
          <div key={k} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-blue-500/50" onClick={() => copy(v)}>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">{k}</div>
              <div className="font-bold font-mono">{v}</div>
            </div>
            <span className="text-xs text-blue-400">Copy</span>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Most Common Screen Resolutions (2026)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
              <th className="py-2 pr-4">Resolution</th><th className="py-2 pr-4">Name</th><th className="py-2">Market Share</th>
            </tr></thead>
            <tbody>
              {common.map(([res, name, share]) => (
                <tr key={res} className={`border-b border-[var(--border)] ${info["Screen Resolution"] === res ? "bg-blue-500/10 text-blue-400" : ""}`}>
                  <td className="py-1.5 pr-4 font-mono">{res}</td>
                  <td className="py-1.5 pr-4">{name}</td>
                  <td className="py-1.5">{share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
