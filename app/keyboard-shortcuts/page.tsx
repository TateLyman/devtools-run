"use client";
import { useState } from "react";

const APPS: Record<string, [string, string][]> = {
  "VS Code": [
    ["Ctrl+P", "Quick Open file"],["Ctrl+Shift+P", "Command Palette"],["Ctrl+B", "Toggle sidebar"],
    ["Ctrl+`", "Toggle terminal"],["Ctrl+/", "Toggle comment"],["Ctrl+D", "Select next occurrence"],
    ["Ctrl+Shift+L", "Select all occurrences"],["Alt+Up/Down", "Move line up/down"],
    ["Ctrl+Shift+K", "Delete line"],["Ctrl+L", "Select line"],["Ctrl+H", "Find and replace"],
    ["Ctrl+Shift+F", "Search across files"],["F12", "Go to definition"],["Ctrl+Space", "Trigger IntelliSense"],
    ["Ctrl+K Ctrl+S", "Keyboard shortcuts"],["Ctrl+,", "Settings"],
  ],
  "Chrome": [
    ["Ctrl+T", "New tab"],["Ctrl+W", "Close tab"],["Ctrl+Shift+T", "Reopen closed tab"],
    ["Ctrl+L", "Focus address bar"],["Ctrl+R", "Reload page"],["Ctrl+Shift+R", "Hard reload"],
    ["Ctrl+D", "Bookmark page"],["Ctrl+Shift+I", "DevTools"],["Ctrl+Shift+J", "Console"],
    ["Ctrl+Tab", "Next tab"],["Ctrl+Shift+Tab", "Previous tab"],["Ctrl+1-8", "Switch to tab N"],
    ["F11", "Fullscreen"],["Ctrl+F", "Find in page"],["Ctrl+Shift+Delete", "Clear data"],
  ],
  "Mac": [
    ["Cmd+C", "Copy"],["Cmd+V", "Paste"],["Cmd+X", "Cut"],["Cmd+Z", "Undo"],
    ["Cmd+Shift+Z", "Redo"],["Cmd+A", "Select all"],["Cmd+S", "Save"],["Cmd+Q", "Quit app"],
    ["Cmd+W", "Close window"],["Cmd+Tab", "Switch apps"],["Cmd+Space", "Spotlight"],
    ["Cmd+Shift+3", "Screenshot (full)"],["Cmd+Shift+4", "Screenshot (area)"],
    ["Cmd+Option+Esc", "Force quit"],["Ctrl+Cmd+Space", "Emoji picker"],
  ],
  "Windows": [
    ["Ctrl+C", "Copy"],["Ctrl+V", "Paste"],["Ctrl+X", "Cut"],["Ctrl+Z", "Undo"],
    ["Ctrl+Y", "Redo"],["Ctrl+A", "Select all"],["Ctrl+S", "Save"],["Alt+F4", "Close window"],
    ["Alt+Tab", "Switch apps"],["Win+E", "File Explorer"],["Win+L", "Lock screen"],
    ["Win+D", "Show desktop"],["PrtSc", "Screenshot"],["Win+Shift+S", "Snipping tool"],
    ["Win+.", "Emoji picker"],["Ctrl+Shift+Esc", "Task Manager"],
  ],
};

export default function KeyboardShortcuts() {
  const [app, setApp] = useState("VS Code");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const copy = (s: string) => { navigator.clipboard.writeText(s); setCopied(s); setTimeout(() => setCopied(""), 800); };

  const items = APPS[app].filter(([key, desc]) => !search || key.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Keyboard Shortcuts</h1>
        <p className="text-[var(--text-secondary)]">Quick reference {copied && <span className="text-emerald-400">Copied {copied}!</span>}</p>
      </section>

      <div className="flex justify-center gap-2 flex-wrap">
        {Object.keys(APPS).map(a => (
          <button key={a} onClick={() => setApp(a)} className={`px-4 py-2 rounded-lg text-sm font-bold ${app === a ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{a}</button>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search shortcuts..."
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" />
      </div>

      <div className="space-y-1">
        {items.map(([key, desc]) => (
          <div key={key} onClick={() => copy(key)} className="flex justify-between items-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2 cursor-pointer hover:border-blue-500/50">
            <kbd className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-sm text-blue-400">{key}</kbd>
            <span className="text-sm text-[var(--text-secondary)]">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
