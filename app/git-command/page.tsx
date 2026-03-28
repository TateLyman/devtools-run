"use client";
import { useState } from "react";

interface GitOperation {
  name: string;
  description: string;
  options: { flag: string; label: string; type: "toggle" | "text"; placeholder?: string }[];
  build: (opts: Record<string, string | boolean>) => string;
}

const operations: GitOperation[] = [
  {
    name: "commit",
    description: "Create a new commit with staged changes",
    options: [
      { flag: "message", label: "Commit message", type: "text", placeholder: "feat: add new feature" },
      { flag: "--amend", label: "Amend last commit", type: "toggle" },
      { flag: "--no-edit", label: "No edit (keep message)", type: "toggle" },
      { flag: "-a", label: "Stage all tracked files (-a)", type: "toggle" },
      { flag: "--allow-empty", label: "Allow empty commit", type: "toggle" },
    ],
    build: (opts) => {
      let cmd = "git commit";
      if (opts["-a"]) cmd += " -a";
      if (opts["--amend"]) cmd += " --amend";
      if (opts["--no-edit"]) cmd += " --no-edit";
      if (opts["--allow-empty"]) cmd += " --allow-empty";
      if (opts.message && !(opts["--amend"] && opts["--no-edit"])) cmd += ` -m "${opts.message}"`;
      return cmd;
    },
  },
  {
    name: "branch",
    description: "Create, list, rename, or delete branches",
    options: [
      { flag: "name", label: "Branch name", type: "text", placeholder: "feature/my-branch" },
      { flag: "--delete", label: "Delete branch (-d)", type: "toggle" },
      { flag: "--force-delete", label: "Force delete (-D)", type: "toggle" },
      { flag: "--move", label: "Rename current branch (-m)", type: "toggle" },
      { flag: "--list", label: "List all branches", type: "toggle" },
      { flag: "-a", label: "Include remote branches (-a)", type: "toggle" },
    ],
    build: (opts) => {
      let cmd = "git branch";
      if (opts["--list"]) { cmd += opts["-a"] ? " -a" : ""; return cmd; }
      if (opts["--force-delete"]) return `git branch -D ${opts.name || "<branch>"}`;
      if (opts["--delete"]) return `git branch -d ${opts.name || "<branch>"}`;
      if (opts["--move"]) return `git branch -m ${opts.name || "<new-name>"}`;
      if (opts.name) cmd += ` ${opts.name}`;
      return cmd;
    },
  },
  {
    name: "reset",
    description: "Reset HEAD to a specific state",
    options: [
      { flag: "ref", label: "Commit/ref", type: "text", placeholder: "HEAD~1" },
      { flag: "--soft", label: "Soft (keep staged)", type: "toggle" },
      { flag: "--mixed", label: "Mixed (unstage, default)", type: "toggle" },
      { flag: "--hard", label: "Hard (discard all changes)", type: "toggle" },
    ],
    build: (opts) => {
      let cmd = "git reset";
      if (opts["--soft"]) cmd += " --soft";
      else if (opts["--hard"]) cmd += " --hard";
      else if (opts["--mixed"]) cmd += " --mixed";
      if (opts.ref) cmd += ` ${opts.ref}`;
      return cmd;
    },
  },
  {
    name: "rebase",
    description: "Reapply commits on top of another base",
    options: [
      { flag: "branch", label: "Base branch", type: "text", placeholder: "main" },
      { flag: "--interactive", label: "Interactive (-i)", type: "toggle" },
      { flag: "--onto", label: "Onto (new base)", type: "text", placeholder: "new-base" },
      { flag: "--abort", label: "Abort rebase", type: "toggle" },
      { flag: "--continue", label: "Continue rebase", type: "toggle" },
    ],
    build: (opts) => {
      if (opts["--abort"]) return "git rebase --abort";
      if (opts["--continue"]) return "git rebase --continue";
      let cmd = "git rebase";
      if (opts["--interactive"]) cmd += " -i";
      if (opts["--onto"]) cmd += ` --onto ${opts["--onto"]}`;
      if (opts.branch) cmd += ` ${opts.branch}`;
      return cmd;
    },
  },
  {
    name: "stash",
    description: "Stash changes for later use",
    options: [
      { flag: "message", label: "Stash message", type: "text", placeholder: "WIP: my feature" },
      { flag: "--pop", label: "Pop (apply & remove)", type: "toggle" },
      { flag: "--apply", label: "Apply (keep in stash)", type: "toggle" },
      { flag: "--list", label: "List stashes", type: "toggle" },
      { flag: "--drop", label: "Drop stash", type: "toggle" },
      { flag: "--include-untracked", label: "Include untracked (-u)", type: "toggle" },
    ],
    build: (opts) => {
      if (opts["--list"]) return "git stash list";
      if (opts["--pop"]) return "git stash pop";
      if (opts["--apply"]) return "git stash apply";
      if (opts["--drop"]) return "git stash drop";
      let cmd = "git stash";
      if (opts["--include-untracked"]) cmd += " -u";
      if (opts.message) cmd += ` -m "${opts.message}"`;
      return cmd;
    },
  },
  {
    name: "cherry-pick",
    description: "Apply specific commits from another branch",
    options: [
      { flag: "commit", label: "Commit hash(es)", type: "text", placeholder: "abc1234" },
      { flag: "--no-commit", label: "No commit (-n)", type: "toggle" },
      { flag: "--edit", label: "Edit message (-e)", type: "toggle" },
      { flag: "--abort", label: "Abort cherry-pick", type: "toggle" },
      { flag: "--continue", label: "Continue cherry-pick", type: "toggle" },
    ],
    build: (opts) => {
      if (opts["--abort"]) return "git cherry-pick --abort";
      if (opts["--continue"]) return "git cherry-pick --continue";
      let cmd = "git cherry-pick";
      if (opts["--no-commit"]) cmd += " -n";
      if (opts["--edit"]) cmd += " -e";
      cmd += ` ${opts.commit || "<commit-hash>"}`;
      return cmd;
    },
  },
  {
    name: "log",
    description: "View commit history with various formats",
    options: [
      { flag: "--oneline", label: "One line per commit", type: "toggle" },
      { flag: "--graph", label: "Show graph", type: "toggle" },
      { flag: "--all", label: "All branches", type: "toggle" },
      { flag: "-n", label: "Limit count", type: "text", placeholder: "10" },
      { flag: "--author", label: "Filter by author", type: "text", placeholder: "name" },
      { flag: "--since", label: "Since date", type: "text", placeholder: "2024-01-01" },
    ],
    build: (opts) => {
      let cmd = "git log";
      if (opts["--oneline"]) cmd += " --oneline";
      if (opts["--graph"]) cmd += " --graph";
      if (opts["--all"]) cmd += " --all";
      if (opts["-n"]) cmd += ` -n ${opts["-n"]}`;
      if (opts["--author"]) cmd += ` --author="${opts["--author"]}"`;
      if (opts["--since"]) cmd += ` --since="${opts["--since"]}"`;
      return cmd;
    },
  },
  {
    name: "diff",
    description: "Show changes between commits, working tree, etc.",
    options: [
      { flag: "--staged", label: "Staged changes only", type: "toggle" },
      { flag: "--stat", label: "Show stats summary", type: "toggle" },
      { flag: "--name-only", label: "Show file names only", type: "toggle" },
      { flag: "ref", label: "Compare with ref", type: "text", placeholder: "HEAD~1" },
      { flag: "file", label: "Specific file", type: "text", placeholder: "src/index.ts" },
    ],
    build: (opts) => {
      let cmd = "git diff";
      if (opts["--staged"]) cmd += " --staged";
      if (opts["--stat"]) cmd += " --stat";
      if (opts["--name-only"]) cmd += " --name-only";
      if (opts.ref) cmd += ` ${opts.ref}`;
      if (opts.file) cmd += ` -- ${opts.file}`;
      return cmd;
    },
  },
];

export default function GitCommandGenerator() {
  const [selectedOp, setSelectedOp] = useState(0);
  const [opts, setOpts] = useState<Record<string, string | boolean>>({});
  const [copied, setCopied] = useState(false);

  const op = operations[selectedOp];
  const command = op.build(opts);

  const toggleOpt = (flag: string) => {
    setOpts((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const setTextOpt = (flag: string, value: string) => {
    setOpts((prev) => ({ ...prev, [flag]: value }));
  };

  const selectOp = (i: number) => {
    setSelectedOp(i);
    setOpts({});
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Git Command Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Build Git commands visually. Select an operation, configure flags, and copy the generated command. Never forget a Git flag again.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {operations.map((o, i) => (
          <button
            key={o.name}
            onClick={() => selectOp(i)}
            className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
              selectedOp === i
                ? "bg-purple-600 text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]"
            }`}
          >
            {o.name}
          </button>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
        <p className="text-sm text-[var(--text-secondary)] mb-4">{op.description}</p>
        <div className="space-y-3">
          {op.options.map((opt) => (
            <div key={opt.flag} className="flex items-center gap-3">
              {opt.type === "toggle" ? (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!opts[opt.flag]}
                    onChange={() => toggleOpt(opt.flag)}
                    className="accent-purple-500"
                  />
                  <span className="text-white">{opt.label}</span>
                  <code className="text-xs text-[var(--text-secondary)]">{opt.flag}</code>
                </label>
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <label className="text-sm text-white whitespace-nowrap min-w-[120px]">{opt.label}:</label>
                  <input
                    type="text"
                    value={(opts[opt.flag] as string) || ""}
                    onChange={(e) => setTextOpt(opt.flag, e.target.value)}
                    placeholder={opt.placeholder}
                    className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1.5 text-white text-sm font-mono"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-purple-400">Generated Command</span>
          <button onClick={copy} className="text-xs text-[var(--text-secondary)] hover:text-white">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <code className="text-lg text-emerald-400 font-mono break-all select-all">{command}</code>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">Tips</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Select an operation from the tabs above and configure options</li>
          <li>The command updates in real-time as you toggle flags</li>
          <li>Use <strong>reset --soft</strong> to undo a commit but keep changes staged</li>
          <li>Use <strong>stash -u</strong> to include untracked files in your stash</li>
          <li>Use <strong>log --oneline --graph --all</strong> for a nice history overview</li>
        </ul>
      </div>
    </div>
  );
}
