"use client";

const SECTIONS = [
  { name: "VS Code", shortcuts: [
    ["Cmd/Ctrl + P", "Quick file open"],
    ["Cmd/Ctrl + Shift + P", "Command palette"],
    ["Cmd/Ctrl + D", "Select next occurrence"],
    ["Cmd/Ctrl + Shift + L", "Select all occurrences"],
    ["Alt + Up/Down", "Move line up/down"],
    ["Cmd/Ctrl + /", "Toggle comment"],
    ["Cmd/Ctrl + B", "Toggle sidebar"],
    ["Cmd/Ctrl + `", "Toggle terminal"],
    ["Cmd/Ctrl + Shift + K", "Delete line"],
    ["Cmd/Ctrl + J", "Toggle panel"],
  ]},
  { name: "Terminal / Bash", shortcuts: [
    ["Ctrl + C", "Kill process"],
    ["Ctrl + Z", "Suspend process"],
    ["Ctrl + D", "Exit shell"],
    ["Ctrl + L", "Clear screen"],
    ["Ctrl + R", "Search history"],
    ["Ctrl + A", "Go to start of line"],
    ["Ctrl + E", "Go to end of line"],
    ["Ctrl + W", "Delete word before cursor"],
    ["Tab", "Auto-complete"],
    ["!!", "Repeat last command"],
  ]},
  { name: "Chrome DevTools", shortcuts: [
    ["F12 / Cmd+Opt+I", "Open DevTools"],
    ["Cmd/Ctrl + Shift + C", "Inspect element"],
    ["Cmd/Ctrl + Shift + J", "Open console"],
    ["Cmd/Ctrl + Shift + M", "Toggle device mode"],
    ["Cmd/Ctrl + [", "Previous panel"],
    ["Cmd/Ctrl + ]", "Next panel"],
    ["Ctrl + L", "Clear console"],
    ["Esc", "Toggle console drawer"],
  ]},
  { name: "Git", shortcuts: [
    ["git add .", "Stage all changes"],
    ["git commit -m 'msg'", "Commit with message"],
    ["git push", "Push to remote"],
    ["git pull", "Pull from remote"],
    ["git stash", "Stash changes"],
    ["git stash pop", "Restore stash"],
    ["git log --oneline", "Compact history"],
    ["git diff", "Show changes"],
  ]},
  { name: "Mac", shortcuts: [
    ["Cmd + Space", "Spotlight search"],
    ["Cmd + Tab", "Switch apps"],
    ["Cmd + Q", "Quit app"],
    ["Cmd + W", "Close window/tab"],
    ["Cmd + Shift + 3", "Screenshot full"],
    ["Cmd + Shift + 4", "Screenshot area"],
    ["Cmd + Shift + 5", "Screen record"],
    ["Cmd + ,", "App preferences"],
  ]},
];

export default function ShortcutsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Keyboard Shortcuts</h1>
        <p className="text-gray-400 text-center mb-8">Essential shortcuts for developers. Click any to copy.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5">
              <h2 className="font-bold text-purple-400 mb-3">{s.name}</h2>
              {s.shortcuts.map(([key, desc], j) => (
                <div key={j} className="flex justify-between py-1.5 border-b border-gray-800 last:border-0 cursor-pointer hover:bg-gray-800 rounded px-2"
                  onClick={() => navigator?.clipboard?.writeText(key)}>
                  <kbd className="text-xs bg-gray-800 px-2 py-0.5 rounded font-mono text-green-400">{key}</kbd>
                  <span className="text-xs text-gray-400">{desc}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/cheatsheet/git" className="text-purple-400 hover:underline">Git Cheatsheet</a>{" | "}
          <a href="/cheatsheet/bash" className="text-purple-400 hover:underline">Bash</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
