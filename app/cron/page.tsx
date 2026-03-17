"use client";

import { useState } from "react";

import AdSlot from "../components/AdSlot";

interface Preset {
  label: string;
  expression: string;
}

const PRESETS: Preset[] = [
  { label: "Every minute", expression: "* * * * *" },
  { label: "Every 5 minutes", expression: "*/5 * * * *" },
  { label: "Every 15 minutes", expression: "*/15 * * * *" },
  { label: "Every hour", expression: "0 * * * *" },
  { label: "Every day at midnight", expression: "0 0 * * *" },
  { label: "Every day at noon", expression: "0 12 * * *" },
  { label: "Every Monday at 9am", expression: "0 9 * * 1" },
  { label: "Every weekday at 9am", expression: "0 9 * * 1-5" },
  { label: "Every Sunday at midnight", expression: "0 0 * * 0" },
  { label: "First day of every month", expression: "0 0 1 * *" },
  { label: "Every January 1st", expression: "0 0 1 1 *" },
];

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

function parseField(
  field: string,
  min: number,
  max: number,
  names?: string[]
): string {
  if (field === "*") return "every";

  // Step values: */n or n/m
  if (field.includes("/")) {
    const [range, step] = field.split("/");
    if (range === "*") {
      return `every ${step}`;
    }
    return `every ${step} starting at ${range}`;
  }

  // Range: n-m
  if (field.includes("-") && !field.includes(",")) {
    const [start, end] = field.split("-");
    const startLabel = names ? names[parseInt(start)] || start : start;
    const endLabel = names ? names[parseInt(end)] || end : end;
    return `${startLabel} through ${endLabel}`;
  }

  // List: n,m,o
  if (field.includes(",")) {
    const items = field.split(",").map((item) => {
      const trimmed = item.trim();
      return names ? names[parseInt(trimmed)] || trimmed : trimmed;
    });
    return items.join(", ");
  }

  // Single value
  if (names && !isNaN(parseInt(field))) {
    const idx = parseInt(field);
    if (idx >= min && idx <= max && names[idx]) {
      return names[idx];
    }
  }

  return field;
}

function describeCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 5) {
    return "Invalid cron expression. Expected 5 fields: minute hour day-of-month month day-of-week";
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  const segments: string[] = [];

  // Minute
  if (minute === "*") {
    segments.push("every minute");
  } else if (minute.includes("/")) {
    const step = minute.split("/")[1];
    segments.push(`every ${step} minute${parseInt(step) > 1 ? "s" : ""}`);
  } else {
    segments.push(`at minute ${minute}`);
  }

  // Hour
  if (hour === "*") {
    if (minute !== "*" && !minute.includes("/")) {
      segments.push("of every hour");
    }
  } else if (hour.includes("/")) {
    const step = hour.split("/")[1];
    segments.push(`every ${step} hour${parseInt(step) > 1 ? "s" : ""}`);
  } else if (hour.includes("-")) {
    const parsed = parseField(hour, 0, 23);
    segments.push(`during hours ${parsed}`);
  } else if (hour.includes(",")) {
    segments.push(`at hours ${hour}`);
  } else {
    const h = parseInt(hour);
    const ampm = h === 0 ? "12:00 AM" : h < 12 ? `${h}:00 AM` : h === 12 ? "12:00 PM" : `${h - 12}:00 PM`;
    // Rewrite minute into the time
    if (minute !== "*" && !minute.includes("/")) {
      const m = minute.padStart(2, "0");
      const timeStr =
        h === 0
          ? `12:${m} AM`
          : h < 12
          ? `${h}:${m} AM`
          : h === 12
          ? `12:${m} PM`
          : `${h - 12}:${m} PM`;
      // Replace last segment
      segments.pop();
      segments.push(`at ${timeStr}`);
    } else {
      segments.push(`during the ${ampm} hour`);
    }
  }

  // Day of month
  if (dayOfMonth !== "*") {
    const parsed = parseField(dayOfMonth, 1, 31);
    segments.push(`on day ${parsed} of the month`);
  }

  // Month
  if (month !== "*") {
    const parsed = parseField(month, 1, 12, MONTH_NAMES);
    segments.push(`in ${parsed}`);
  }

  // Day of week
  if (dayOfWeek !== "*") {
    const parsed = parseField(dayOfWeek, 0, 7, DAY_NAMES);
    segments.push(`on ${parsed}`);
  }

  // Capitalize first letter
  const result = segments.join(", ");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function getNextRuns(expression: string, count: number): string[] {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minuteField, hourField, domField, monthField, dowField] = parts;
  const results: string[] = [];
  const now = new Date();
  const check = new Date(now);
  check.setSeconds(0);
  check.setMilliseconds(0);
  check.setMinutes(check.getMinutes() + 1);

  function matchesField(value: number, field: string, min: number, max: number): boolean {
    if (field === "*") return true;
    if (field.includes("/")) {
      const [range, step] = field.split("/");
      const stepNum = parseInt(step);
      const start = range === "*" ? min : parseInt(range);
      return (value - start) >= 0 && (value - start) % stepNum === 0;
    }
    if (field.includes(",")) {
      return field.split(",").map((s) => parseInt(s.trim())).includes(value);
    }
    if (field.includes("-")) {
      const [start, end] = field.split("-").map((s) => parseInt(s));
      return value >= start && value <= end;
    }
    return value === parseInt(field);
  }

  let iterations = 0;
  while (results.length < count && iterations < 525960) {
    const min = check.getMinutes();
    const hr = check.getHours();
    const dom = check.getDate();
    const mon = check.getMonth() + 1;
    const dow = check.getDay();

    if (
      matchesField(min, minuteField, 0, 59) &&
      matchesField(hr, hourField, 0, 23) &&
      matchesField(dom, domField, 1, 31) &&
      matchesField(mon, monthField, 1, 12) &&
      matchesField(dow, dowField, 0, 7)
    ) {
      results.push(
        check.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    }

    check.setMinutes(check.getMinutes() + 1);
    iterations++;
  }

  return results;
}

export default function CronParserPage() {
  const [expression, setExpression] = useState("0 9 * * 1-5");
  const [description, setDescription] = useState(
    describeCron("0 9 * * 1-5")
  );
  const [nextRuns, setNextRuns] = useState<string[]>(
    getNextRuns("0 9 * * 1-5", 5)
  );
  const [error, setError] = useState("");

  function parse(expr: string) {
    setExpression(expr);
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) {
      setError(
        "Invalid cron expression. Expected 5 fields: minute hour day-of-month month day-of-week"
      );
      setDescription("");
      setNextRuns([]);
      return;
    }
    try {
      const desc = describeCron(expr);
      setDescription(desc);
      setNextRuns(getNextRuns(expr, 5));
      setError("");
    } catch (e) {
      setError("Failed to parse: " + (e as Error).message);
      setDescription("");
      setNextRuns([]);
    }
  }

  function applyPreset(preset: Preset) {
    parse(preset.expression);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Cron Expression Parser</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Enter a cron expression to get a human-readable description and see
          upcoming run times. Runs entirely in your browser.
        </p>
      </div>

      <div className="space-y-6">
        {/* Expression input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Cron Expression
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => parse(e.target.value)}
              placeholder="* * * * *"
              spellCheck={false}
              className="flex-1 font-mono text-lg"
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-[var(--text-secondary)] font-mono">
            <span>minute</span>
            <span>hour</span>
            <span>day(month)</span>
            <span>month</span>
            <span>day(week)</span>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
            {error}
          </div>
        )}

        {/* Human-readable description */}
        {description && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-[var(--accent)] font-medium">
              {description}
            </div>
          </div>
        )}

        {/* Next run times */}
        {nextRuns.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Next 5 Run Times
            </label>
            <div className="space-y-1">
              {nextRuns.map((run, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-mono"
                >
                  {run}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Presets */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Common Presets
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.expression}
                onClick={() => applyPreset(preset)}
                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors text-left ${
                  expression === preset.expression
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]"
                }`}
              >
                <span>{preset.label}</span>
                <span className="font-mono text-xs text-[var(--text-secondary)]">
                  {preset.expression}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Cron Expressions
        </h2>
        <p>
          Cron expressions are used to schedule recurring tasks in Unix-like
          systems. A standard cron expression has five fields: minute (0-59),
          hour (0-23), day of month (1-31), month (1-12), and day of week
          (0-7, where both 0 and 7 represent Sunday). Special characters
          include * (any), / (step), - (range), and , (list).
        </p>
      </section>
    </>
  );
}
