"use client";
import { useState } from "react";

const CODES: [number, string, string, string][] = [
  [100, "Continue", "The server received the request headers, continue sending the body", "info"],
  [101, "Switching Protocols", "The server is switching protocols as requested", "info"],
  [200, "OK", "The request was successful", "success"],
  [201, "Created", "A new resource was created", "success"],
  [204, "No Content", "Success, but no content to return", "success"],
  [206, "Partial Content", "Partial content delivered (range request)", "success"],
  [301, "Moved Permanently", "Resource has been permanently moved to a new URL", "redirect"],
  [302, "Found", "Resource temporarily at a different URL", "redirect"],
  [304, "Not Modified", "Resource has not changed since last request", "redirect"],
  [307, "Temporary Redirect", "Temporary redirect, keep original method", "redirect"],
  [308, "Permanent Redirect", "Permanent redirect, keep original method", "redirect"],
  [400, "Bad Request", "The request was malformed or invalid", "client"],
  [401, "Unauthorized", "Authentication is required", "client"],
  [403, "Forbidden", "You do not have permission to access this resource", "client"],
  [404, "Not Found", "The requested resource was not found", "client"],
  [405, "Method Not Allowed", "The HTTP method is not supported for this resource", "client"],
  [408, "Request Timeout", "The server timed out waiting for the request", "client"],
  [409, "Conflict", "The request conflicts with current state of the resource", "client"],
  [413, "Payload Too Large", "The request body is too large", "client"],
  [415, "Unsupported Media Type", "The media type is not supported", "client"],
  [422, "Unprocessable Entity", "The request is valid but cannot be processed", "client"],
  [429, "Too Many Requests", "Rate limit exceeded", "client"],
  [500, "Internal Server Error", "The server encountered an unexpected error", "server"],
  [502, "Bad Gateway", "The server received an invalid response from upstream", "server"],
  [503, "Service Unavailable", "The server is temporarily unable to handle requests", "server"],
  [504, "Gateway Timeout", "The upstream server timed out", "server"],
];

const COLORS: Record<string, string> = {
  info: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  redirect: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  client: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  server: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function HttpCodes() {
  const [search, setSearch] = useState("");

  const filtered = search ? CODES.filter(([code, name, desc]) =>
    String(code).includes(search) || name.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase())
  ) : CODES;

  const copy = (code: number) => navigator.clipboard.writeText(String(code));

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">HTTP Status Codes</h1>
        <p className="text-[var(--text-secondary)]">Complete reference guide</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code or description (e.g., 404, timeout, redirect)..."
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" />
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {[["1xx Info", "info"], ["2xx Success", "success"], ["3xx Redirect", "redirect"], ["4xx Client", "client"], ["5xx Server", "server"]].map(([label, type]) => (
          <button key={type} onClick={() => setSearch(type === "info" ? "1" : type === "success" ? "2" : type === "redirect" ? "3" : type === "client" ? "4" : "5")}
            className={`px-3 py-1 rounded text-sm border ${COLORS[type]}`}>{label}</button>
        ))}
        {search && <button onClick={() => setSearch("")} className="px-3 py-1 rounded text-sm border border-[var(--border)]">Clear</button>}
      </div>

      <div className="space-y-2">
        {filtered.map(([code, name, desc, type]) => (
          <div key={code} onClick={() => copy(code)} className={`rounded-xl p-4 border cursor-pointer hover:scale-[1.01] transition-transform ${COLORS[type]}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-mono w-16">{code}</span>
              <div>
                <div className="font-bold">{name}</div>
                <div className="text-sm opacity-70">{desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
