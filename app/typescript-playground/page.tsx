"use client";
import { useState } from "react";

export default function TypeScriptPlayground() {
  const [code, setCode] = useState(`// TypeScript Playground
interface User {
  name: string;
  age: number;
  email: string;
  active: boolean;
}

function greet(user: User): string {
  return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

const user: User = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  active: true
};

console.log(greet(user));
console.log("User:", JSON.stringify(user, null, 2));
`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const run = () => {
    setError("");
    setOutput("");

    // Capture console.log output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map((a) => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" "));
    };

    try {
      // Strip TypeScript types for execution
      let jsCode = code
        .replace(/:\s*\w+(\[\])?\s*(?=[=,;)\n{])/g, "") // Remove type annotations
        .replace(/interface\s+\w+\s*\{[^}]*\}/g, "") // Remove interfaces
        .replace(/type\s+\w+\s*=\s*[^;]+;/g, "") // Remove type aliases
        .replace(/<\w+>/g, "") // Remove generic parameters
        .replace(/as\s+\w+/g, "") // Remove type assertions
        .replace(/\?\./g, "?.") // Keep optional chaining
        .replace(/^\s*export\s+/gm, "") // Remove export
        .replace(/^\s*import\s+.*$/gm, ""); // Remove imports

      const fn = new Function(jsCode);
      fn();
      setOutput(logs.join("\n"));
    } catch (e: any) {
      setError(e.message);
    }

    console.log = originalLog;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">TypeScript Playground</h1>
        <p className="text-[var(--text-secondary)]">
          Write and run TypeScript code in your browser. Strips types and executes as JavaScript. Free online TS playground.
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={run} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-bold text-sm">▶ Run</button>
        <button onClick={() => setCode("")} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Clear</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-1 block">Code</label>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[450px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Output</label>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 h-[450px] overflow-auto">
            {error ? (
              <pre className="text-red-400 font-mono text-sm">{error}</pre>
            ) : (
              <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">{output || "// Click Run to execute"}</pre>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Note: TypeScript types are stripped before execution. Complex type-level operations are not supported. For full TypeScript, use the official <a href="https://www.typescriptlang.org/play" className="text-purple-400" target="_blank">TypeScript Playground</a>.
      </p>
    </div>
  );
}
