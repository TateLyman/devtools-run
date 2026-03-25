"use client";
import { useState, useEffect } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState("");
  useEffect(() => { const saved = localStorage.getItem("devtools-notes"); if (saved) setNotes(saved); }, []);
  useEffect(() => { localStorage.setItem("devtools-notes", notes); }, [notes]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Quick Notes</h1>
        <p className="text-gray-400 text-center mb-8">Saves automatically in your browser. No account needed.</p>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Start typing your notes..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-white h-96 resize-none text-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{notes.split(/\s+/).filter(w=>w).length} words</span>
          <span>Auto-saved locally</span>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/word-counter" className="text-purple-400 hover:underline">Word Counter</a>{" | "}
          <a href="/md-editor" className="text-purple-400 hover:underline">Markdown</a>{" | "}
          <a href="/pomodoro" className="text-purple-400 hover:underline">Pomodoro</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
