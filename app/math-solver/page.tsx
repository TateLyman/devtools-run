"use client";
import { useState } from "react";

function solve(expression: string): { result: string; steps: string[] } {
  const steps: string[] = [];
  try {
    steps.push(`Expression: ${expression}`);
    // Sanitize — only allow math characters
    const sanitized = expression.replace(/[^0-9+\-*/().%^ ]/g, "").replace(/\^/g, "**");
    steps.push(`Simplified: ${sanitized}`);
    const result = Function(`"use strict"; return (${sanitized})`)();
    steps.push(`Result: ${result}`);
    return { result: String(result), steps };
  } catch (e: any) {
    return { result: "Error: " + e.message, steps: ["Invalid expression"] };
  }
}

// Quadratic solver
function solveQuadratic(a: number, b: number, c: number): { x1: string; x2: string; discriminant: number } {
  const d = b * b - 4 * a * c;
  if (d > 0) return { x1: ((-b + Math.sqrt(d)) / (2 * a)).toFixed(4), x2: ((-b - Math.sqrt(d)) / (2 * a)).toFixed(4), discriminant: d };
  if (d === 0) return { x1: (-b / (2 * a)).toFixed(4), x2: (-b / (2 * a)).toFixed(4), discriminant: d };
  const real = (-b / (2 * a)).toFixed(4);
  const imag = (Math.sqrt(-d) / (2 * a)).toFixed(4);
  return { x1: `${real} + ${imag}i`, x2: `${real} - ${imag}i`, discriminant: d };
}

export default function MathSolver() {
  const [mode, setMode] = useState<"calc" | "quadratic">("calc");
  const [expression, setExpression] = useState("(5 + 3) * 2 - 10 / 5");
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");

  const calcResult = mode === "calc" ? solve(expression) : null;
  const quadResult = mode === "quadratic" ? solveQuadratic(Number(a), Number(b), Number(c)) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Math Solver</h1>
        <p className="text-[var(--text-secondary)]">Solve math expressions and quadratic equations. Step-by-step solutions. Free online math calculator.</p>
      </div>
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex gap-2 justify-center">
          <button onClick={() => setMode("calc")} className={`px-4 py-2 rounded text-sm ${mode === "calc" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>Calculator</button>
          <button onClick={() => setMode("quadratic")} className={`px-4 py-2 rounded text-sm ${mode === "quadratic" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>Quadratic (ax² + bx + c)</button>
        </div>

        {mode === "calc" ? (
          <>
            <input value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="Enter math expression..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white text-lg font-mono text-center" />
            {calcResult && (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
                <p className="text-xs text-gray-400 mb-1">Result</p>
                <p className="text-4xl font-bold text-emerald-400 font-mono">{calcResult.result}</p>
              </div>
            )}
            <div className="flex gap-2 flex-wrap justify-center">
              {["2 + 2", "sqrt(144)", "2^10", "100 / 7", "(3.14 * 5^2)", "1024 * 768"].map((ex) => (
                <button key={ex} onClick={() => setExpression(ex)} className="px-2 py-1 rounded text-xs bg-[var(--bg-secondary)] text-gray-400 hover:text-white font-mono">{ex}</button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-sm text-gray-400">Solve ax² + bx + c = 0</p>
            <div className="flex gap-2 items-center justify-center">
              <input value={a} onChange={(e) => setA(e.target.value)} className="w-16 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-white text-center font-mono" />
              <span className="text-gray-400">x² +</span>
              <input value={b} onChange={(e) => setB(e.target.value)} className="w-16 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-white text-center font-mono" />
              <span className="text-gray-400">x +</span>
              <input value={c} onChange={(e) => setC(e.target.value)} className="w-16 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-white text-center font-mono" />
              <span className="text-gray-400">= 0</span>
            </div>
            {quadResult && (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 space-y-2 text-center">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-gray-400">x₁</p><p className="text-xl font-bold text-emerald-400 font-mono">{quadResult.x1}</p></div>
                  <div><p className="text-xs text-gray-400">x₂</p><p className="text-xl font-bold text-emerald-400 font-mono">{quadResult.x2}</p></div>
                </div>
                <p className="text-xs text-gray-400">Discriminant (Δ): <span className={quadResult.discriminant >= 0 ? "text-emerald-400" : "text-yellow-400"}>{quadResult.discriminant}</span>
                  {quadResult.discriminant > 0 ? " — two real roots" : quadResult.discriminant === 0 ? " — one repeated root" : " — complex roots"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
