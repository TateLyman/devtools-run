"use client";
import { useState } from "react";

const ANIMS: Record<string, string> = {
  "fadeIn": "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }",
  "fadeOut": "@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }",
  "slideInLeft": "@keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }",
  "slideInRight": "@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }",
  "slideInUp": "@keyframes slideInUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }",
  "slideInDown": "@keyframes slideInDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }",
  "bounce": "@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }",
  "spin": "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }",
  "pulse": "@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }",
  "shake": "@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }",
  "flip": "@keyframes flip { from { transform: perspective(400px) rotateY(0); } to { transform: perspective(400px) rotateY(360deg); } }",
  "swing": "@keyframes swing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(15deg); } 75% { transform: rotate(-15deg); } }",
  "rubberBand": "@keyframes rubberBand { 0%, 100% { transform: scale(1); } 30% { transform: scaleX(1.25) scaleY(0.75); } 40% { transform: scaleX(0.75) scaleY(1.25); } 60% { transform: scaleX(1.15) scaleY(0.85); } }",
  "zoomIn": "@keyframes zoomIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }",
  "zoomOut": "@keyframes zoomOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0); opacity: 0; } }",
  "heartBeat": "@keyframes heartBeat { 0%, 100% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.3); } }",
  "jello": "@keyframes jello { 0%, 100% { transform: skewX(0deg) skewY(0deg); } 30% { transform: skewX(-12.5deg) skewY(-12.5deg); } 40% { transform: skewX(6.25deg) skewY(6.25deg); } 60% { transform: skewX(-3.125deg) skewY(-3.125deg); } 80% { transform: skewX(1.5625deg) skewY(1.5625deg); } }",
  "wobble": "@keyframes wobble { 0%, 100% { transform: translateX(0) rotate(0); } 15% { transform: translateX(-25%) rotate(-5deg); } 30% { transform: translateX(20%) rotate(3deg); } 45% { transform: translateX(-15%) rotate(-3deg); } 60% { transform: translateX(10%) rotate(2deg); } 75% { transform: translateX(-5%) rotate(-1deg); } }",
};

export default function AnimationGen() {
  const [selected, setSelected] = useState("bounce");
  const [duration, setDuration] = useState("1");
  const [timing, setTiming] = useState("ease");
  const [iterations, setIterations] = useState("infinite");
  const [playing, setPlaying] = useState(true);

  const animCSS = `animation: ${selected} ${duration}s ${timing} ${iterations};`;
  const fullCSS = `${ANIMS[selected]}\n\n.element {\n  ${animCSS}\n}`;
  const copy = () => navigator.clipboard.writeText(fullCSS);

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: Object.values(ANIMS).join("\n") }} />
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Animation Generator</h1>
        <p className="text-[var(--text-secondary)]">Choose an animation, customize it, copy the CSS</p>
      </section>

      <div className="flex justify-center p-8 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
        <div className="w-24 h-24 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold"
          style={playing ? { animation: `${selected} ${duration}s ${timing} ${iterations}` } : {}} key={selected + playing}>
          {selected}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold mb-3">Animations</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.keys(ANIMS).map(name => (
            <button key={name} onClick={() => { setSelected(name); setPlaying(true); }}
              className={`px-2 py-1.5 rounded text-xs font-bold ${selected === name ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/50"}`}>{name}</button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div><label className="text-xs text-[var(--text-secondary)]">Duration: {duration}s</label><input type="range" min={0.1} max={5} step={0.1} value={duration} onChange={e => setDuration(e.target.value)} className="w-full" /></div>
          <div>
            <label className="text-xs text-[var(--text-secondary)]">Timing</label>
            <select value={timing} onChange={e => setTiming(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-sm">
              {["ease","linear","ease-in","ease-out","ease-in-out"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)]">Iterations</label>
            <select value={iterations} onChange={e => setIterations(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-sm">
              {["infinite","1","2","3","5"].map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <button onClick={() => setPlaying(!playing)} className="mt-3 text-sm text-blue-400">{playing ? "Pause" : "Play"}</button>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold">CSS</label>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">{fullCSS}</pre>
      </div>
    </div>
  );
}
