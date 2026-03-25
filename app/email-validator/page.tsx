"use client";
import { useState } from "react";

function validateEmail(email: string): { valid: boolean; checks: { name: string; pass: boolean; detail: string }[] } {
  const checks: { name: string; pass: boolean; detail: string }[] = [];
  const trimmed = email.trim();

  // Basic format
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  checks.push({ name: "Valid format", pass: basicRegex.test(trimmed), detail: basicRegex.test(trimmed) ? "Matches email pattern" : "Does not match basic email format" });

  // Has @ symbol
  const hasAt = trimmed.includes("@");
  checks.push({ name: "Contains @", pass: hasAt, detail: hasAt ? "Found @ symbol" : "Missing @ symbol" });

  // Has domain
  const parts = trimmed.split("@");
  const hasDomain = parts.length === 2 && parts[1].includes(".");
  checks.push({ name: "Has domain", pass: hasDomain, detail: hasDomain ? `Domain: ${parts[1]}` : "No valid domain found" });

  // No spaces
  const noSpaces = !trimmed.includes(" ");
  checks.push({ name: "No spaces", pass: noSpaces, detail: noSpaces ? "No whitespace found" : "Contains spaces" });

  // TLD check
  const tld = parts[1]?.split(".").pop() || "";
  const validTLD = tld.length >= 2 && tld.length <= 10;
  checks.push({ name: "Valid TLD", pass: validTLD, detail: validTLD ? `.${tld}` : "Invalid top-level domain" });

  // Local part check
  const localPart = parts[0] || "";
  const validLocal = localPart.length > 0 && localPart.length <= 64;
  checks.push({ name: "Valid local part", pass: validLocal, detail: validLocal ? `${localPart.length} chars` : "Local part too long or empty" });

  // No consecutive dots
  const noConsecutiveDots = !trimmed.includes("..");
  checks.push({ name: "No consecutive dots", pass: noConsecutiveDots, detail: noConsecutiveDots ? "Clean" : "Contains consecutive dots" });

  // Common provider detection
  const domain = parts[1]?.toLowerCase() || "";
  const providers: Record<string, string> = {
    "gmail.com": "Google Gmail",
    "outlook.com": "Microsoft Outlook",
    "hotmail.com": "Microsoft Hotmail",
    "yahoo.com": "Yahoo Mail",
    "protonmail.com": "ProtonMail",
    "icloud.com": "Apple iCloud",
    "aol.com": "AOL Mail",
    "zoho.com": "Zoho Mail",
  };
  const provider = providers[domain];
  if (provider) {
    checks.push({ name: "Provider", pass: true, detail: provider });
  }

  // Disposable email check
  const disposable = ["mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email", "10minutemail.com", "yopmail.com", "trashmail.com"];
  const isDisposable = disposable.includes(domain);
  checks.push({ name: "Not disposable", pass: !isDisposable, detail: isDisposable ? "Disposable/temporary email detected" : "Appears to be a real email provider" });

  const valid = checks.slice(0, 5).every((c) => c.pass);
  return { valid, checks };
}

export default function EmailValidator() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ReturnType<typeof validateEmail> | null>(null);
  const [bulk, setBulk] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [bulkResults, setBulkResults] = useState<{ email: string; valid: boolean }[]>([]);

  const validate = () => {
    if (bulk) {
      const emails = bulkInput.split("\n").filter(Boolean).map((e) => e.trim());
      setBulkResults(emails.map((e) => ({ email: e, valid: validateEmail(e).valid })));
    } else {
      setResult(validateEmail(email));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Email Validator</h1>
        <p className="text-[var(--text-secondary)]">
          Validate email addresses instantly. Check format, domain, TLD, and detect disposable emails. Bulk validation supported.
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setBulk(false)} className={`px-3 py-1.5 rounded text-sm ${!bulk ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Single</button>
        <button onClick={() => setBulk(true)} className={`px-3 py-1.5 rounded text-sm ${bulk ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Bulk</button>
      </div>

      {!bulk ? (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && validate()}
              placeholder="Enter email address..."
              className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white"
              type="email"
            />
            <button onClick={validate} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-bold">Validate</button>
          </div>

          {result && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
              <div className={`text-center text-lg font-bold ${result.valid ? "text-emerald-400" : "text-red-400"}`}>
                {result.valid ? "Valid Email" : "Invalid Email"}
              </div>
              <div className="space-y-1.5">
                {result.checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={check.pass ? "text-emerald-400" : "text-red-400"}>{check.pass ? "✓" : "✗"}</span>
                    <span className="text-gray-400 w-36">{check.name}</span>
                    <span className="text-white">{check.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="One email per line..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-32 resize-none font-mono text-sm"
          />
          <button onClick={validate} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold">Validate All</button>

          {bulkResults.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex gap-4 text-sm mb-3">
                <span className="text-emerald-400">{bulkResults.filter((r) => r.valid).length} valid</span>
                <span className="text-red-400">{bulkResults.filter((r) => !r.valid).length} invalid</span>
              </div>
              <div className="max-h-48 overflow-auto space-y-1">
                {bulkResults.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-mono">
                    <span className={r.valid ? "text-emerald-400" : "text-red-400"}>{r.valid ? "✓" : "✗"}</span>
                    <span className="text-white">{r.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
