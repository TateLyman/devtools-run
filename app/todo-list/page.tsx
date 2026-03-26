"use client";
import { useState, useEffect } from "react";

type Todo = { id: string; text: string; done: boolean; created: number };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all"|"active"|"done">("all");

  useEffect(() => { const s = localStorage.getItem("todos"); if (s) setTodos(JSON.parse(s)); }, []);
  useEffect(() => { if (todos.length) localStorage.setItem("todos", JSON.stringify(todos)); }, [todos]);

  const add = () => {
    if (!input.trim()) return;
    setTodos([{ id: Date.now().toString(), text: input.trim(), done: false, created: Date.now() }, ...todos]);
    setInput("");
  };

  const toggle = (id: string) => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => setTodos(todos.filter(t => t.id !== id));
  const clearDone = () => { setTodos(todos.filter(t => !t.done)); localStorage.setItem("todos", JSON.stringify(todos.filter(t => !t.done))); };

  const filtered = filter === "all" ? todos : filter === "active" ? todos.filter(t => !t.done) : todos.filter(t => t.done);
  const active = todos.filter(t => !t.done).length;

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <section className="text-center"><h1 className="text-4xl font-bold mb-1">Todo List</h1><p className="text-sm text-[var(--text-secondary)]">Saves to your browser. No signup.</p></section>

      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
          className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2" placeholder="What needs to be done?" />
        <button onClick={add} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">Add</button>
      </div>

      <div className="flex gap-2 justify-center">
        {(["all","active","done"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded text-sm capitalize ${filter === f ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-1">
        {filtered.map(t => (
          <div key={t.id} className={`flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 ${t.done ? "opacity-50" : ""}`}>
            <button onClick={() => toggle(t.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${t.done ? "bg-emerald-600 border-emerald-600" : "border-[var(--border)]"}`}>
              {t.done && <span className="text-white text-xs">✓</span>}
            </button>
            <span className={`flex-1 text-sm ${t.done ? "line-through" : ""}`}>{t.text}</span>
            <button onClick={() => remove(t.id)} className="text-red-400 text-xs hover:text-red-300">×</button>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center text-sm text-[var(--text-secondary)] py-4">{filter === "all" ? "No tasks yet" : `No ${filter} tasks`}</div>}
      </div>

      <div className="flex justify-between text-xs text-[var(--text-secondary)]">
        <span>{active} item{active !== 1 ? "s" : ""} left</span>
        {todos.some(t => t.done) && <button onClick={clearDone} className="text-red-400 hover:text-red-300">Clear completed</button>}
      </div>
    </div>
  );
}
