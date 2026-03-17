"use client";

import { useState, useEffect } from "react";

import AdSlot from "../components/AdSlot";

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState("");
  const [dateString, setDateString] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    setCurrentTimestamp(Math.floor(Date.now() / 1000));
    return () => clearInterval(interval);
  }, []);

  function timestampToDate(ts: string) {
    if (!ts.trim()) {
      setDateString("");
      return;
    }
    const num = parseInt(ts, 10);
    if (isNaN(num)) {
      setDateString("Invalid timestamp");
      return;
    }
    const ms = unit === "seconds" ? num * 1000 : num;
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setDateString("Invalid timestamp");
      return;
    }
    setDateString(
      `${date.toUTCString()}\n${date.toLocaleString()} (local)\n${date.toISOString()}`
    );
  }

  function dateToTimestamp(dateStr: string) {
    if (!dateStr.trim()) {
      setTimestamp("");
      return;
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      setTimestamp("Invalid date");
      return;
    }
    const ts =
      unit === "seconds"
        ? Math.floor(date.getTime() / 1000)
        : date.getTime();
    setTimestamp(String(ts));
  }

  function useCurrentTimestamp() {
    const now = unit === "seconds" ? Math.floor(Date.now() / 1000) : Date.now();
    const ts = String(now);
    setTimestamp(ts);
    timestampToDate(ts);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Unix Timestamp Converter</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Convert between Unix timestamps and human-readable dates. Supports
          seconds and milliseconds.
        </p>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 mb-6 flex items-center justify-between">
        <div>
          <span className="text-sm text-[var(--text-secondary)]">
            Current Unix Timestamp:
          </span>
          <span className="ml-2 font-mono text-lg text-[var(--accent)]">
            {currentTimestamp}
          </span>
        </div>
        <button
          onClick={useCurrentTimestamp}
          className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors"
        >
          Use Now
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium">Unit:</label>
        <button
          onClick={() => setUnit("seconds")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            unit === "seconds"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Seconds
        </button>
        <button
          onClick={() => setUnit("milliseconds")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            unit === "milliseconds"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--bg-tertiary)] border border-[var(--border)]"
          }`}
        >
          Milliseconds
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium mb-2">
            Timestamp &rarr; Human Date
          </h2>
          <input
            type="text"
            value={timestamp}
            onChange={(e) => {
              setTimestamp(e.target.value);
              timestampToDate(e.target.value);
            }}
            placeholder={
              unit === "seconds" ? "e.g. 1700000000" : "e.g. 1700000000000"
            }
          />
          {dateString && (
            <pre className="mt-3 text-sm">{dateString}</pre>
          )}
        </div>

        <div>
          <h2 className="text-sm font-medium mb-2">
            Human Date &rarr; Timestamp
          </h2>
          <input
            type="datetime-local"
            onChange={(e) => dateToTimestamp(e.target.value)}
            className="w-full"
          />
          <div className="mt-3">
            <input
              type="text"
              placeholder="Or type: 2024-01-15T12:00:00Z"
              onChange={(e) => dateToTimestamp(e.target.value)}
            />
          </div>
        </div>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Unix Timestamps
        </h2>
        <p>
          A Unix timestamp is the number of seconds (or milliseconds) since
          January 1, 1970 00:00:00 UTC (the Unix epoch). It is widely used in
          programming, APIs, and databases to represent points in time.
        </p>
      </section>
    </>
  );
}
