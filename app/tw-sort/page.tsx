"use client";
import { useState } from "react";
const ORDER = ["container","block","inline","flex","grid","hidden","visible","invisible","static","fixed","absolute","relative","sticky","top","right","bottom","left","z","m","mx","my","mt","mr","mb","ml","p","px","py","pt","pr","pb","pl","w","min-w","max-w","h","min-h","max-h","text","font","leading","tracking","text-left","text-center","text-right","whitespace","break","overflow","rounded","border","border-t","border-r","border-b","border-l","bg","from","via","to","shadow","opacity","ring","blur","filter","transition","duration","ease","delay","animate","cursor","select","resize","appearance","outline","fill","stroke","sr-only","not-sr-only","gap","items","justify","self","place","col","row","order"];
function sortClasses(input: string): string {
  const classes = input.trim().split(/\s+/).filter(Boolean);
  return classes.sort((a, b) => {
    const prefixA = a.replace(/^(.*?)-.*/, "$1").replace(/^(hover|focus|active|group-hover|dark|sm|md|lg|xl|2xl):/, "");
    const prefixB = b.replace(/^(.*?)-.*/, "$1").replace(/^(hover|focus|active|group-hover|dark|sm|md|lg|xl|2xl):/, "");
    const idxA = ORDER.findIndex(o => prefixA.startsWith(o));
    const idxB = ORDER.findIndex(o => prefixB.startsWith(o));
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  }).join(" ");
}
export default function TwSort() {
  const [input, setInput] = useState("text-white p-4 flex bg-blue-500 rounded-lg shadow-lg items-center justify-between font-bold hover:bg-blue-600 mx-auto max-w-2xl border border-gray-200 mt-8 gap-4 transition-all duration-300");
  const sorted = sortClasses(input);
  const changed = input.trim() !== sorted;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Tailwind Class Sorter</h1><p className="text-[var(--text-secondary)]">Sort classes in recommended order</p></section>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><label className="text-sm font-bold block mb-2">Input ({input.trim().split(/\s+/).length} classes)</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" /></div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Sorted {changed && <span className="text-emerald-400">(reordered)</span>}</label><button onClick={() => navigator.clipboard.writeText(sorted)} className="text-xs text-blue-400">Copy</button></div><textarea value={sorted} readOnly rows={6} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none text-emerald-400" /></div>
      </div>
    </div>
  );
}
