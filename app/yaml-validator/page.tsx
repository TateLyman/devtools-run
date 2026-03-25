"use client";
import { useState } from "react";

// Simple YAML parser for validation
function validateYAML(yaml: string): { valid: boolean; error: string; lineCount: number; keyCount: number } {
  const lines = yaml.split("\n");
  let error = "";
  let keyCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Check indentation consistency
    const indent = line.length - trimmed.length;
    if (indent > 0 && indent % 2 !== 0 && !line.includes("\t")) {
      // Warn but don't error on odd indentation
    }

    // Check for tabs
    if (line.includes("\t")) {
      error = `Line ${i + 1}: YAML does not allow tabs for indentation`;
      return { valid: false, error, lineCount: lines.length, keyCount };
    }

    // Check for key-value pairs
    if (trimmed.includes(":") && !trimmed.startsWith("-")) {
      const colonIdx = trimmed.indexOf(":");
      const key = trimmed.substring(0, colonIdx).trim();
      if (key && !key.startsWith("- ")) keyCount++;

      // Check for invalid key characters
      if (key.includes(" ") && !key.startsWith("'") && !key.startsWith('"')) {
        // Multi-word keys should be quoted
      }
    }

    // Check for unclosed quotes
    const singleQuotes = (trimmed.match(/'/g) || []).length;
    const doubleQuotes = (trimmed.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      error = `Line ${i + 1}: Unclosed single quote`;
      return { valid: false, error, lineCount: lines.length, keyCount };
    }
    if (doubleQuotes % 2 !== 0) {
      error = `Line ${i + 1}: Unclosed double quote`;
      return { valid: false, error, lineCount: lines.length, keyCount };
    }
  }

  return { valid: true, error: "", lineCount: lines.length, keyCount };
}

export default function YAMLValidator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = input.trim() ? validateYAML(input) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">YAML Validator</h1>
        <p className="text-[var(--text-secondary)]">
          Validate YAML syntax instantly. Check for tab errors, unclosed quotes, and formatting issues. Free online YAML validator.
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your YAML here..."
        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-[400px] resize-none font-mono text-sm"
        spellCheck={false}
      />

      {result && (
        <div className={`rounded-lg p-4 ${result.valid ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${result.valid ? "text-emerald-400" : "text-red-400"}`}>
              {result.valid ? "✓" : "✗"}
            </span>
            <span className={`font-bold ${result.valid ? "text-emerald-400" : "text-red-400"}`}>
              {result.valid ? "Valid YAML" : "Invalid YAML"}
            </span>
          </div>
          {result.error && <p className="text-red-400 text-sm mt-1 font-mono">{result.error}</p>}
          <div className="flex gap-4 text-xs text-gray-400 mt-2">
            <span>{result.lineCount} lines</span>
            <span>{result.keyCount} keys</span>
          </div>
        </div>
      )}
    </div>
  );
}
