"use client";
import { useState, useEffect } from "react";
type Snippet = { id: string; title: string; code: string; lang: string; tags: string[]; created: number };
export default function SnippetManager() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("javascript");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => { const s = localStorage.getItem("snippets"); if (s) setSnippets(JSON.parse(s)); }, []);
  useEffect(() => { if (snippets.length) localStorage.setItem("snippets", JSON.stringify(snippets)); }, [snippets]);

  const save = () => {
    if (!title || !code) return;
    const snippet: Snippet = { id: editing || Date.now().toString(), title, code, lang, tags: tags.split(",").map(t=>t.trim()).filter(Boolean), created: Date.now() };
    if (editing) { setSnippets(snippets.map(s => s.id === editing ? snippet : s)); setEditing(null); }
    else setSnippets([snippet, ...snippets]);
    setTitle(""); setCode(""); setTags("");
  };

  const edit = (s: Snippet) => { setTitle(s.title); setCode(s.code); setLang(s.lang); setTags(s.tags.join(", ")); setEditing(s.id); };
  const del = (id: string) => { setSnippets(snippets.filter(s => s.id !== id)); localStorage.setItem("snippets", JSON.stringify(snippets.filter(s => s.id !== id))); };
  const copy = (code: string) => navigator.clipboard.writeText(code);
  const exportAll = () => { const blob = new Blob([JSON.stringify(snippets, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "snippets.json"; a.click(); };

  const filtered = search ? snippets.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) || s.code.toLowerCase().includes(search.toLowerCase())) : snippets;

  return (
    <div className="space-y-4">
      <section className="text-center"><h1 className="text-4xl font-bold mb-1">Code Snippets</h1><p className="text-sm text-[var(--text-secondary)]">Save to browser. No signup. {snippets.length} snippets</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 space-y-2">
        <div className="flex gap-2"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Snippet title" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /><select value={lang} onChange={e=>setLang(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-2 text-sm">{["javascript","typescript","python","rust","go","html","css","sql","bash","json","other"].map(l=><option key={l}>{l}</option>)}</select></div>
        <textarea value={code} onChange={e=>setCode(e.target.value)} rows={5} placeholder="Paste code here..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none" />
        <div className="flex gap-2"><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Tags (comma separated)" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /><button onClick={save} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">{editing ? "Update" : "Save"}</button>{editing && <button onClick={() => { setEditing(null); setTitle(""); setCode(""); setTags(""); }} className="text-sm text-[var(--text-secondary)]">Cancel</button>}</div>
      </div>
      <div className="flex gap-2"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search snippets..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />{snippets.length > 0 && <button onClick={exportAll} className="text-xs text-blue-400">Export JSON</button>}</div>
      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <div><span className="font-bold text-sm">{s.title}</span><span className="text-xs text-[var(--text-secondary)] ml-2">{s.lang}</span>{s.tags.map(t => <span key={t} className="text-xs bg-blue-500/10 text-blue-400 rounded px-1 ml-1">{t}</span>)}</div>
              <div className="flex gap-2"><button onClick={()=>copy(s.code)} className="text-xs text-blue-400">Copy</button><button onClick={()=>edit(s)} className="text-xs text-yellow-400">Edit</button><button onClick={()=>del(s.id)} className="text-xs text-red-400">Del</button></div>
            </div>
            <pre className="font-mono text-xs text-emerald-400 bg-[var(--bg-primary)] rounded p-2 overflow-auto max-h-32">{s.code}</pre>
          </div>
        ))}
        {filtered.length === 0 && snippets.length === 0 && <div className="text-center text-sm text-[var(--text-secondary)] py-8">No snippets yet. Save your first one above!</div>}
        {filtered.length === 0 && snippets.length > 0 && <div className="text-center text-sm text-[var(--text-secondary)] py-4">No snippets match "{search}"</div>}
      </div>
    </div>
  );
}
