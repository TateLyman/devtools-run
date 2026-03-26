"use client";
import { useState } from "react";

const SECTIONS = [
  { title: "Setup", items: [
    ["git init", "Initialize a new Git repository"],
    ["git clone <url>", "Clone a repository"],
    ["git config --global user.name \"Name\"", "Set your name"],
    ["git config --global user.email \"email\"", "Set your email"],
  ]},
  { title: "Basic Workflow", items: [
    ["git status", "Check working directory status"],
    ["git add <file>", "Stage a file"],
    ["git add .", "Stage all changes"],
    ["git commit -m \"message\"", "Commit staged changes"],
    ["git push", "Push to remote"],
    ["git pull", "Pull from remote"],
    ["git fetch", "Download remote changes without merging"],
  ]},
  { title: "Branching", items: [
    ["git branch", "List branches"],
    ["git branch <name>", "Create a branch"],
    ["git checkout <branch>", "Switch to a branch"],
    ["git checkout -b <name>", "Create and switch to branch"],
    ["git merge <branch>", "Merge branch into current"],
    ["git branch -d <name>", "Delete a branch"],
    ["git branch -m <old> <new>", "Rename a branch"],
  ]},
  { title: "History & Diff", items: [
    ["git log", "View commit history"],
    ["git log --oneline", "Compact history"],
    ["git log --graph", "Visual branch history"],
    ["git diff", "Show unstaged changes"],
    ["git diff --staged", "Show staged changes"],
    ["git show <commit>", "Show commit details"],
    ["git blame <file>", "Show who changed each line"],
  ]},
  { title: "Undoing Changes", items: [
    ["git restore <file>", "Discard working directory changes"],
    ["git restore --staged <file>", "Unstage a file"],
    ["git reset HEAD~1", "Undo last commit (keep changes)"],
    ["git reset --hard HEAD~1", "Undo last commit (discard changes)"],
    ["git revert <commit>", "Create a new commit that undoes changes"],
    ["git stash", "Temporarily save changes"],
    ["git stash pop", "Restore stashed changes"],
  ]},
  { title: "Remote", items: [
    ["git remote -v", "List remotes"],
    ["git remote add origin <url>", "Add a remote"],
    ["git push -u origin <branch>", "Push and set upstream"],
    ["git push origin --delete <branch>", "Delete remote branch"],
    ["git pull --rebase", "Pull with rebase"],
  ]},
  { title: "Advanced", items: [
    ["git rebase <branch>", "Rebase current branch"],
    ["git cherry-pick <commit>", "Apply a specific commit"],
    ["git tag <name>", "Create a tag"],
    ["git reflog", "View reference log"],
    ["git clean -fd", "Remove untracked files"],
    ["git bisect start", "Binary search for a bug"],
  ]},
];

export default function GitCheat() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const copy = (t: string) => { navigator.clipboard.writeText(t); setCopied(t); setTimeout(() => setCopied(""), 800); };

  const filtered = search ? SECTIONS.map(s => ({
    ...s, items: s.items.filter(([cmd, desc]) => cmd.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase()))
  })).filter(s => s.items.length > 0) : SECTIONS;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Git Cheatsheet</h1>
        <p className="text-[var(--text-secondary)]">Essential Git commands {copied && <span className="text-emerald-400">Copied!</span>}</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search commands..."
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" />
      </div>

      {filtered.map(section => (
        <div key={section.title} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">{section.title}</h2>
          <div className="space-y-1">
            {section.items.map(([cmd, desc]) => (
              <div key={cmd} className="flex items-center gap-3 bg-[var(--bg-primary)] rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-blue-500/50 border border-transparent" onClick={() => copy(cmd)}>
                <code className="text-emerald-400 font-mono flex-1">{cmd}</code>
                <span className="text-[var(--text-secondary)] text-xs hidden md:block">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
