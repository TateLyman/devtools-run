"use client";
import { useState } from "react";
const CURSORS = ["auto","default","none","context-menu","help","pointer","progress","wait","cell","crosshair","text","vertical-text","alias","copy","move","no-drop","not-allowed","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out"];
export default function CursorPlayground() {
  const [selected, setSelected] = useState("pointer");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Cursor Playground</h1><p className="text-[var(--text-secondary)]">Hover each tile to see the cursor</p></section>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {CURSORS.map(c => (
          <button key={c} onClick={() => { setSelected(c); navigator.clipboard.writeText(`cursor: ${c};`); }}
            className={`bg-[var(--bg-secondary)] border rounded-lg p-3 text-center text-xs hover:scale-105 transition-transform ${selected === c ? "border-blue-500 bg-blue-500/10" : "border-[var(--border)]"}`}
            style={{ cursor: c }}>
            <div className="font-mono font-bold">{c}</div>
          </button>
        ))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
        <div className="text-sm text-[var(--text-secondary)]">Selected:</div>
        <code className="font-mono text-lg text-blue-400">cursor: {selected};</code>
        <div className="mt-2"><button onClick={() => navigator.clipboard.writeText(`cursor: ${selected};`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-bold">Copy CSS</button></div>
      </div>
    </div>
  );
}
