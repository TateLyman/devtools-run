"use client";
import { useState } from "react";

function explainField(value: string, field: string, names?: string[]): string {
  if (value === "*") return `every ${field}`;
  if (value.includes("/")) { const [, step] = value.split("/"); return `every ${step} ${field}s`; }
  if (value.includes(",")) { const parts = value.split(",").map(v => names ? names[parseInt(v)] || v : v); return `${field} ${parts.join(", ")}`; }
  if (value.includes("-")) { const [a, b] = value.split("-"); return `${field}s ${names ? names[parseInt(a)] || a : a} through ${names ? names[parseInt(b)] || b : b}`; }
  return `at ${field} ${names ? names[parseInt(value)] || value : value}`;
}

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

function explain(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return "Invalid cron expression (need 5 fields: min hour day month weekday)";
  const [min, hour, dom, mon, dow] = parts;

  const pieces: string[] = [];
  
  if (min === "0" && hour === "0" && dom === "*" && mon === "*" && dow === "*") return "At midnight every day";
  if (min === "0" && hour === "*" && dom === "*" && mon === "*" && dow === "*") return "At the start of every hour";
  if (min.includes("/") && hour === "*" && dom === "*" && mon === "*" && dow === "*") return `Every ${min.split("/")[1]} minutes`;
  
  // Minute
  if (min === "*") pieces.push("Every minute");
  else if (min.includes("/")) pieces.push(`Every ${min.split("/")[1]} minutes`);
  else pieces.push(`At minute ${min}`);

  // Hour
  if (hour !== "*") {
    if (hour.includes("/")) pieces.push(`every ${hour.split("/")[1]} hours`);
    else { const h = parseInt(hour); pieces.push(`past hour ${h > 12 ? h - 12 + " PM" : h + " AM"}`); }
  }

  // Day of month
  if (dom !== "*") {
    if (dom.includes("/")) pieces.push(`every ${dom.split("/")[1]} days`);
    else pieces.push(`on day ${dom} of the month`);
  }

  // Month
  if (mon !== "*") {
    const m = mon.split(",").map(v => MONTHS[parseInt(v)] || v).join(", ");
    pieces.push(`in ${m}`);
  }

  // Day of week
  if (dow !== "*") {
    const d = dow.split(",").map(v => DAYS[parseInt(v)] || v).join(", ");
    pieces.push(`on ${d}`);
  }

  return pieces.join(" ");
}

const EXAMPLES = [
  ["*/5 * * * *", "Every 5 minutes"],
  ["0 * * * *", "Every hour"],
  ["0 0 * * *", "Daily at midnight"],
  ["0 9 * * 1-5", "Weekdays at 9 AM"],
  ["0 0 1 * *", "1st of every month"],
  ["30 4 * * 0", "Sunday at 4:30 AM"],
  ["0 */6 * * *", "Every 6 hours"],
  ["0 0 * * 0", "Weekly on Sunday"],
];

export default function CronExplain() {
  const [cron, setCron] = useState("*/5 * * * *");

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Cron Expression Explainer</h1>
        <p className="text-[var(--text-secondary)]">Paste a cron expression to see what it means</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <input value={cron} onChange={e => setCron(e.target.value)}
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-xl text-center" placeholder="* * * * *" />
        <div className="flex justify-center gap-8 mt-3 text-xs text-[var(--text-secondary)]">
          {["Minute","Hour","Day","Month","Weekday"].map((l, i) => (
            <div key={l} className="text-center">
              <div className="font-mono text-lg text-white">{cron.trim().split(/\s+/)[i] || "*"}</div>
              <div>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 text-center">
        <div className="text-sm text-[var(--text-secondary)]">This cron means:</div>
        <div className="text-xl font-bold text-blue-400 mt-1">{explain(cron)}</div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Common Cron Expressions</h2>
        <div className="space-y-2">
          {EXAMPLES.map(([expr, desc]) => (
            <button key={expr} onClick={() => setCron(expr)}
              className={`w-full flex justify-between items-center bg-[var(--bg-primary)] rounded-lg px-4 py-2 text-sm hover:border-blue-500/50 border border-transparent ${cron === expr ? "border-blue-500/50" : ""}`}>
              <code className="font-mono">{expr}</code>
              <span className="text-[var(--text-secondary)]">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Cron Syntax Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
              <th className="py-2 pr-4">Symbol</th><th className="py-2 pr-4">Meaning</th><th className="py-2">Example</th>
            </tr></thead>
            <tbody>
              {[
                ["*", "Every value", "* (every minute)"],
                ["*/N", "Every N", "*/5 (every 5 minutes)"],
                ["N", "Specific value", "30 (at minute 30)"],
                ["N,M", "List", "1,15 (1st and 15th)"],
                ["N-M", "Range", "1-5 (Monday to Friday)"],
              ].map(([sym, mean, ex]) => (
                <tr key={sym} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4 font-mono font-bold">{sym}</td>
                  <td className="py-2 pr-4">{mean}</td>
                  <td className="py-2 text-[var(--text-secondary)]">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
