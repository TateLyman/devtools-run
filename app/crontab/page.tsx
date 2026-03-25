"use client";
import { useState } from "react";

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (need 5 fields)";

  const [min, hour, dom, month, dow] = parts;

  const descPart = (val: string, unit: string, names?: string[]): string => {
    if (val === "*") return `every ${unit}`;
    if (val.includes("/")) {
      const [, step] = val.split("/");
      return `every ${step} ${unit}s`;
    }
    if (val.includes(",")) return `${unit}s ${val}`;
    if (val.includes("-")) {
      const [a, b] = val.split("-");
      return `${unit}s ${names ? names[+a] : a} through ${names ? names[+b] : b}`;
    }
    return names ? `${unit} ${names[+val] || val}` : `${unit} ${val}`;
  };

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const pieces: string[] = [];
  pieces.push(descPart(min, "minute"));
  pieces.push(descPart(hour, "hour"));
  if (dom !== "*") pieces.push(`on day ${dom} of month`);
  if (month !== "*") pieces.push(`in ${descPart(month, "month", months)}`);
  if (dow !== "*") pieces.push(`on ${descPart(dow, "day", days)}`);

  return pieces.join(", ");
}

function getNextRuns(expr: string, count: number = 5): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minExpr, hourExpr, domExpr, monthExpr, dowExpr] = parts;

  const matches = (val: string, n: number): boolean => {
    if (val === "*") return true;
    if (val.includes("/")) {
      const [base, step] = val.split("/");
      const start = base === "*" ? 0 : +base;
      return (n - start) % +step === 0 && n >= start;
    }
    if (val.includes(",")) return val.split(",").map(Number).includes(n);
    if (val.includes("-")) {
      const [a, b] = val.split("-").map(Number);
      return n >= a && n <= b;
    }
    return +val === n;
  };

  const runs: string[] = [];
  const now = new Date();
  const check = new Date(now);
  check.setSeconds(0);
  check.setMilliseconds(0);
  check.setMinutes(check.getMinutes() + 1);

  for (let i = 0; i < 525600 && runs.length < count; i++) {
    const m = check.getMinutes();
    const h = check.getHours();
    const d = check.getDate();
    const mo = check.getMonth() + 1;
    const dw = check.getDay();

    if (matches(minExpr, m) && matches(hourExpr, h) && matches(domExpr, d) && matches(monthExpr, mo) && matches(dowExpr, dw)) {
      runs.push(check.toLocaleString());
    }
    check.setMinutes(check.getMinutes() + 1);
  }

  return runs;
}

const presets: Record<string, { expr: string; label: string }> = {
  everyMin: { expr: "* * * * *", label: "Every minute" },
  every5: { expr: "*/5 * * * *", label: "Every 5 minutes" },
  every15: { expr: "*/15 * * * *", label: "Every 15 minutes" },
  hourly: { expr: "0 * * * *", label: "Every hour" },
  daily: { expr: "0 0 * * *", label: "Daily at midnight" },
  daily9: { expr: "0 9 * * *", label: "Daily at 9 AM" },
  weekly: { expr: "0 0 * * 1", label: "Every Monday midnight" },
  monthly: { expr: "0 0 1 * *", label: "1st of every month" },
  weekdays: { expr: "0 9 * * 1-5", label: "Weekdays at 9 AM" },
  biweekly: { expr: "0 0 1,15 * *", label: "1st and 15th" },
};

export default function Crontab() {
  const [expr, setExpr] = useState("*/5 * * * *");

  const description = describeCron(expr);
  const nextRuns = getNextRuns(expr);
  const parts = expr.trim().split(/\s+/);
  const labels = ["minute", "hour", "day (month)", "month", "day (week)"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Crontab Generator & Explainer</h1>
        <p className="text-[var(--text-secondary)]">
          Build, explain, and test cron expressions. See next run times. Presets for common schedules. Free cron expression tool.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-4 py-3 text-white text-2xl font-mono text-center tracking-widest"
          placeholder="* * * * *"
        />
        <div className="flex justify-center gap-8 mt-3 text-xs text-[var(--text-secondary)]">
          {parts.slice(0, 5).map((p, i) => (
            <div key={i} className="text-center">
              <div className="font-mono text-white text-lg">{p}</div>
              <div>{labels[i]}</div>
            </div>
          ))}
        </div>
        <p className="text-center mt-4 text-purple-400 font-medium">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <h2 className="font-bold mb-3">Common Presets</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(presets).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setExpr(v.expr)}
                className={`text-left px-3 py-2 rounded text-sm ${expr === v.expr ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white"}`}
              >
                <div className="font-mono text-xs">{v.expr}</div>
                <div className="text-xs mt-0.5">{v.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <h2 className="font-bold mb-3">Next 5 Runs</h2>
          {nextRuns.length > 0 ? (
            <div className="space-y-2">
              {nextRuns.map((run, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-purple-400 font-mono w-4">{i + 1}.</span>
                  <span className="text-white">{run}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-400 text-sm">Could not calculate next runs. Check your expression.</p>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">Cron Syntax Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
          <div><span className="text-white">*</span> any value</div>
          <div><span className="text-white">,</span> list (1,3,5)</div>
          <div><span className="text-white">-</span> range (1-5)</div>
          <div><span className="text-white">/</span> step (*/5)</div>
          <div><span className="text-white">0-59</span> minutes</div>
          <div><span className="text-white">0-23</span> hours</div>
          <div><span className="text-white">1-31</span> day/month</div>
          <div><span className="text-white">1-12</span> month</div>
          <div><span className="text-white">0-6</span> day/week</div>
          <div><span className="text-white">0</span> = Sunday</div>
        </div>
      </div>
    </div>
  );
}
