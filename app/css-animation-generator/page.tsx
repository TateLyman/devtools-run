"use client";
import { useState } from "react";

const presets: Record<string, { keyframes: string; animation: string; label: string }> = {
  bounce: {
    label: "Bounce",
    keyframes: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}`,
    animation: "bounce 1s ease infinite",
  },
  fadeIn: {
    label: "Fade In",
    keyframes: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
    animation: "fadeIn 1s ease forwards",
  },
  slideInLeft: {
    label: "Slide In Left",
    keyframes: `@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
    animation: "slideInLeft 0.5s ease forwards",
  },
  slideInRight: {
    label: "Slide In Right",
    keyframes: `@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
    animation: "slideInRight 0.5s ease forwards",
  },
  pulse: {
    label: "Pulse",
    keyframes: `@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}`,
    animation: "pulse 1s ease infinite",
  },
  shake: {
    label: "Shake",
    keyframes: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}`,
    animation: "shake 0.5s ease infinite",
  },
  spin: {
    label: "Spin",
    keyframes: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    animation: "spin 1s linear infinite",
  },
  flip: {
    label: "Flip",
    keyframes: `@keyframes flip {
  0% { transform: perspective(400px) rotateY(0); }
  100% { transform: perspective(400px) rotateY(360deg); }
}`,
    animation: "flip 1s ease infinite",
  },
  swing: {
    label: "Swing",
    keyframes: `@keyframes swing {
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}`,
    animation: "swing 1s ease infinite",
  },
  zoomIn: {
    label: "Zoom In",
    keyframes: `@keyframes zoomIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
    animation: "zoomIn 0.5s ease forwards",
  },
  float: {
    label: "Float",
    keyframes: `@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}`,
    animation: "float 3s ease-in-out infinite",
  },
  glow: {
    label: "Glow",
    keyframes: `@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(99, 102, 241, 0.4); }
}`,
    animation: "glow 2s ease-in-out infinite",
  },
};

export default function CSSAnimationGenerator() {
  const [selected, setSelected] = useState("bounce");
  const [duration, setDuration] = useState("1");
  const [timing, setTiming] = useState("ease");
  const [iteration, setIteration] = useState("infinite");
  const [delay, setDelay] = useState("0");
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const preset = presets[selected];
  const customAnimation = `${selected} ${duration}s ${timing} ${delay}s ${iteration}`;

  const fullCSS = `${preset.keyframes}

.animated-element {
  animation: ${customAnimation};
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const replay = () => setKey((k) => k + 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSS Animation Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Browse 12 CSS animation presets. Customize timing, duration, delay, and iterations. Copy the CSS code. Free online tool.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold">Presets</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(presets).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => { setSelected(k); setKey((n) => n + 1); }}
                  className={`px-2 py-1.5 rounded text-xs text-left ${selected === k ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white"}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold">Customize</h2>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Duration: {duration}s</label>
              <input type="range" min={0.1} max={5} step={0.1} value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Delay: {delay}s</label>
              <input type="range" min={0} max={3} step={0.1} value={delay} onChange={(e) => setDelay(e.target.value)} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Timing</label>
              <select value={timing} onChange={(e) => setTiming(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                {["ease", "ease-in", "ease-out", "ease-in-out", "linear", "cubic-bezier(0.68, -0.55, 0.265, 1.55)"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Iterations</label>
              <select value={iteration} onChange={(e) => setIteration(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                {["infinite", "1", "2", "3", "5"].map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <button onClick={replay} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold">Replay</button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-8 flex items-center justify-center min-h-[200px]">
            <style>{preset.keyframes}</style>
            <div
              key={key}
              className="w-24 h-24 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ animation: customAnimation }}
            >
              {preset.label}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Generated CSS</label>
              <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy CSS"}</button>
            </div>
            <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-4 text-sm font-mono text-emerald-400 overflow-auto">{fullCSS}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
