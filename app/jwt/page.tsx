"use client";

import { useState } from "react";

import AdSlot from "../components/AdSlot";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  try {
    return decodeURIComponent(
      Array.from(atob(base64), (c) =>
        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      ).join("")
    );
  } catch {
    return atob(base64);
  }
}

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT: expected 3 parts separated by dots");

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  const signature = parts[2];

  return { header, payload, signature };
}

function formatTimestamp(ts: number): string {
  try {
    const ms = ts < 1e12 ? ts * 1000 : ts;
    return new Date(ms).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function JwtDecoderPage() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState("");

  function handleDecode() {
    if (!input.trim()) return;
    try {
      const result = decodeJwt(input);
      setDecoded(result);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setDecoded(null);
    }
  }

  function handleInputChange(value: string) {
    setInput(value);
    if (!value.trim()) {
      setDecoded(null);
      setError("");
      return;
    }
    try {
      const result = decodeJwt(value);
      setDecoded(result);
      setError("");
    } catch {
      // Don't show error while typing
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">JWT Decoder</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Paste a JSON Web Token to decode and inspect the header, payload, and
          signature.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Paste JWT Token
        </label>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          spellCheck={false}
        />
        <button
          onClick={handleDecode}
          className="mt-3 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
        >
          Decode
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--error)] bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      {decoded && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
            <h2 className="text-sm font-medium text-[var(--accent)] mb-2">
              Header
            </h2>
            <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
            <h2 className="text-sm font-medium text-[var(--accent)] mb-2">
              Payload
            </h2>
            <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
            {typeof decoded.payload.exp === "number" && (
              <div className="mt-3 text-xs text-[var(--text-secondary)]">
                <span className="font-medium">Expires:</span>{" "}
                {formatTimestamp(decoded.payload.exp)}
                {Date.now() > decoded.payload.exp * 1000 ? (
                  <span className="text-[var(--error)] ml-2">(expired)</span>
                ) : (
                  <span className="text-[var(--success)] ml-2">(valid)</span>
                )}
              </div>
            )}
            {typeof decoded.payload.iat === "number" && (
              <div className="text-xs text-[var(--text-secondary)]">
                <span className="font-medium">Issued:</span>{" "}
                {formatTimestamp(decoded.payload.iat)}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
            <h2 className="text-sm font-medium text-[var(--accent)] mb-2">
              Signature
            </h2>
            <code className="text-sm break-all text-[var(--text-secondary)]">
              {decoded.signature}
            </code>
          </div>
        </div>
      )}

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">About JWT Tokens</h2>
        <p>
          JSON Web Tokens (JWTs) are a compact, URL-safe means of representing
          claims between two parties. This tool decodes the header and payload
          of a JWT without verifying the signature. Never share sensitive JWTs
          publicly.
        </p>
      </section>
    </>
  );
}
