"use client";
import { useState, useEffect } from "react";

interface Task { id: string; text: string; done: boolean; }

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => { try { const s = localStorage.getItem("devtools-todo"); if (s) setTasks(JSON.parse(s)); } catch {} }, []);
  useEffect(() => { localStorage.setItem("devtools-todo", JSON.stringify(tasks)); }, [tasks]);

  const add = () => { if (!input.trim()) return; setTasks([...tasks, { id: Date.now().toString(36), text: input.trim(), done: false }]); setInput(""); };
  const toggle = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Quick Todo</h1>
        <p className="text-gray-400 text-center mb-8">Simple task list. Saves in your browser.</p>
        <div className="flex gap-2 mb-6">
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Add a task..." onKeyDown={e=>e.key==="Enter"&&add()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          <button onClick={add} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold">Add</button>
        </div>
        <div className="space-y-2">
          {tasks.map(t => (
            <div key={t.id} className="flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-3">
              <button onClick={()=>toggle(t.id)} className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${t.done?"bg-green-500 border-green-500":"border-gray-600"}`}>
                {t.done && <span className="text-xs">&#x2713;</span>}
              </button>
              <span className={`flex-1 ${t.done?"line-through text-gray-500":""}`}>{t.text}</span>
              <button onClick={()=>remove(t.id)} className="text-gray-500 hover:text-red-400 text-sm">&#x2715;</button>
            </div>
          ))}
          {tasks.length===0 && <div className="text-center text-gray-500 py-8">No tasks yet. Add one above.</div>}
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">{tasks.filter(t=>t.done).length}/{tasks.length} completed</div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/notes" className="text-purple-400 hover:underline">Notes</a>{" | "}
          <a href="/pomodoro" className="text-purple-400 hover:underline">Pomodoro</a>{" | "}
          <a href="/daily" className="text-purple-400 hover:underline">Daily Tip</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
