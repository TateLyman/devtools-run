"use client";

import { useState, useCallback } from "react";

type PermSet = { read: boolean; write: boolean; execute: boolean };

function permToNum(p: PermSet): number {
  return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
}

function numToPerm(n: number): PermSet {
  return {
    read: (n & 4) !== 0,
    write: (n & 2) !== 0,
    execute: (n & 1) !== 0,
  };
}

function permToSymbolic(p: PermSet): string {
  return (p.read ? "r" : "-") + (p.write ? "w" : "-") + (p.execute ? "x" : "-");
}

export default function ChmodPage() {
  const [owner, setOwner] = useState<PermSet>({ read: true, write: true, execute: true });
  const [group, setGroup] = useState<PermSet>({ read: true, write: false, execute: true });
  const [other, setOther] = useState<PermSet>({ read: true, write: false, execute: true });
  const [numericInput, setNumericInput] = useState("755");

  const numericValue = `${permToNum(owner)}${permToNum(group)}${permToNum(other)}`;
  const symbolic = `-${permToSymbolic(owner)}${permToSymbolic(group)}${permToSymbolic(other)}`;

  const handleNumericChange = useCallback((val: string) => {
    setNumericInput(val);
    const clean = val.replace(/[^0-7]/g, "").slice(0, 3);
    if (clean.length === 3) {
      setOwner(numToPerm(parseInt(clean[0])));
      setGroup(numToPerm(parseInt(clean[1])));
      setOther(numToPerm(parseInt(clean[2])));
    }
  }, []);

  function handleCheckbox(
    who: "owner" | "group" | "other",
    perm: "read" | "write" | "execute",
    checked: boolean
  ) {
    const setters = { owner: setOwner, group: setGroup, other: setOther };
    setters[who]((prev) => {
      const next = { ...prev, [perm]: checked };
      // Update numeric input to stay in sync
      const o = who === "owner" ? next : owner;
      const g = who === "group" ? next : group;
      const ot = who === "other" ? next : other;
      setNumericInput(`${permToNum(o)}${permToNum(g)}${permToNum(ot)}`);
      return next;
    });
  }

  function copyNumeric() {
    navigator.clipboard.writeText(numericValue);
  }

  function copySymbolic() {
    navigator.clipboard.writeText(symbolic);
  }

  function copyCommand() {
    navigator.clipboard.writeText(`chmod ${numericValue}`);
  }

  const groups = [
    { label: "Owner", key: "owner" as const, state: owner },
    { label: "Group", key: "group" as const, state: group },
    { label: "Other", key: "other" as const, state: other },
  ];
  const perms = ["read", "write", "execute"] as const;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Unix Permissions Calculator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Toggle permissions or type a numeric value. See chmod notation in
          real-time.
        </p>
      </div>

      <div className="ad-slot mb-6">
        <span>Ad Space</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Checkboxes */}
        <div>
          <label className="block text-sm font-medium mb-3">Permissions</label>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 text-xs font-medium text-[var(--text-secondary)] border-b border-[var(--border)] px-4 py-2">
              <span></span>
              <span className="text-center">Read</span>
              <span className="text-center">Write</span>
              <span className="text-center">Execute</span>
            </div>
            {groups.map(({ label, key, state }) => (
              <div
                key={key}
                className="grid grid-cols-4 items-center px-4 py-3 border-b border-[var(--border)] last:border-b-0"
              >
                <span className="text-sm font-medium">{label}</span>
                {perms.map((p) => (
                  <label key={p} className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={state[p]}
                      onChange={(e) => handleCheckbox(key, p, e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Numeric (octal)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={numericInput}
                onChange={(e) => handleNumericChange(e.target.value)}
                maxLength={3}
                className="font-mono text-2xl text-center tracking-[0.3em]"
                style={{ maxWidth: 120 }}
              />
              <button
                onClick={copyNumeric}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Symbolic
            </label>
            <div className="flex items-center gap-2">
              <code className="text-lg font-mono bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2">
                {symbolic}
              </code>
              <button
                onClick={copySymbolic}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              chmod Command
            </label>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2">
                chmod {numericValue} &lt;file&gt;
              </code>
              <button
                onClick={copyCommand}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Common presets */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Common Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {["644", "755", "700", "777", "600", "444"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleNumericChange(preset)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] text-xs font-mono transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About chmod Calculator
        </h2>
        <p>
          Calculate Unix file permissions interactively. Click checkboxes to
          toggle read, write, and execute for owner, group, and other, or type a
          numeric value like 755 to see the corresponding permissions. All
          processing runs in your browser.
        </p>
      </section>
    </>
  );
}
