"use client";
import { useState } from "react";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState(0);
  const [deg, setDeg] = useState(true);

  const toRad = (x: number) => deg ? (x * Math.PI) / 180 : x;

  const handleNumber = (n: string) => {
    setDisplay((prev) => (prev === "0" || prev === "Error" ? n : prev + n));
  };

  const handleOperator = (op: string) => {
    setEquation(display + " " + op + " ");
    setDisplay("0");
  };

  const handleEquals = () => {
    try {
      const expr = equation + display;
      // Safe evaluation using Function constructor with math context
      const result = Function(
        "Math", "sin", "cos", "tan", "log", "sqrt", "abs", "PI", "E", "pow",
        `"use strict"; return (${expr
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/\^/g, "**")
          .replace(/π/g, "Math.PI")
          .replace(/e(?![xp])/g, "Math.E")
        });`
      )(Math, Math.sin, Math.cos, Math.tan, Math.log, Math.sqrt, Math.abs, Math.PI, Math.E, Math.pow);
      const resultStr = Number.isFinite(result) ? String(parseFloat(result.toPrecision(12))) : "Error";
      setHistory((h) => [`${expr} = ${resultStr}`, ...h].slice(0, 20));
      setDisplay(resultStr);
      setEquation("");
    } catch {
      setDisplay("Error");
      setEquation("");
    }
  };

  const handleFunction = (fn: string) => {
    const num = parseFloat(display);
    let result: number;
    switch (fn) {
      case "sin": result = Math.sin(toRad(num)); break;
      case "cos": result = Math.cos(toRad(num)); break;
      case "tan": result = Math.tan(toRad(num)); break;
      case "asin": result = deg ? Math.asin(num) * 180 / Math.PI : Math.asin(num); break;
      case "acos": result = deg ? Math.acos(num) * 180 / Math.PI : Math.acos(num); break;
      case "atan": result = deg ? Math.atan(num) * 180 / Math.PI : Math.atan(num); break;
      case "ln": result = Math.log(num); break;
      case "log": result = Math.log10(num); break;
      case "sqrt": result = Math.sqrt(num); break;
      case "cbrt": result = Math.cbrt(num); break;
      case "abs": result = Math.abs(num); break;
      case "x2": result = num * num; break;
      case "x3": result = num * num * num; break;
      case "1/x": result = 1 / num; break;
      case "!": result = factorial(num); break;
      case "%": result = num / 100; break;
      case "+/-": result = -num; break;
      case "exp": result = Math.exp(num); break;
      default: return;
    }
    setDisplay(Number.isFinite(result) ? String(parseFloat(result.toPrecision(12))) : "Error");
  };

  const factorial = (n: number): number => {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const clear = () => { setDisplay("0"); setEquation(""); };
  const backspace = () => setDisplay((prev) => prev.length > 1 ? prev.slice(0, -1) : "0");

  const btn = (label: string, onClick: () => void, className = "") => (
    <button onClick={onClick} className={`rounded p-2 text-sm font-bold transition-colors ${className}`}>{label}</button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Scientific Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Full scientific calculator with trigonometry, logarithms, factorials, and more. Memory functions and calculation history.
        </p>
      </div>

      <div className="max-w-sm mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-right mb-1 text-xs text-gray-400 h-5 overflow-hidden">{equation}</div>
          <div className="text-right text-3xl font-mono text-white font-bold overflow-auto">{display}</div>
          <div className="flex justify-between mt-2">
            <button onClick={() => setDeg(!deg)} className="text-xs text-purple-400">{deg ? "DEG" : "RAD"}</button>
            <span className="text-xs text-gray-500">M: {memory}</span>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
          <div className="grid grid-cols-5 gap-1.5">
            {btn("sin", () => handleFunction("sin"), "bg-gray-700 hover:bg-gray-600 text-purple-300")}
            {btn("cos", () => handleFunction("cos"), "bg-gray-700 hover:bg-gray-600 text-purple-300")}
            {btn("tan", () => handleFunction("tan"), "bg-gray-700 hover:bg-gray-600 text-purple-300")}
            {btn("ln", () => handleFunction("ln"), "bg-gray-700 hover:bg-gray-600 text-purple-300")}
            {btn("log", () => handleFunction("log"), "bg-gray-700 hover:bg-gray-600 text-purple-300")}

            {btn("x²", () => handleFunction("x2"), "bg-gray-700 hover:bg-gray-600 text-purple-300")}
            {btn("√", () => handleFunction("sqrt"), "bg-gray-700 hover:bg-gray-600 text-purple-300")}
            {btn("x!", () => handleFunction("!"), "bg-gray-700 hover:bg-gray-600 text-purple-300")}
            {btn("π", () => setDisplay(String(Math.PI)), "bg-gray-700 hover:bg-gray-600 text-purple-300")}
            {btn("e", () => setDisplay(String(Math.E)), "bg-gray-700 hover:bg-gray-600 text-purple-300")}

            {btn("MC", () => setMemory(0), "bg-gray-800 hover:bg-gray-700 text-gray-300")}
            {btn("MR", () => setDisplay(String(memory)), "bg-gray-800 hover:bg-gray-700 text-gray-300")}
            {btn("M+", () => setMemory(memory + parseFloat(display)), "bg-gray-800 hover:bg-gray-700 text-gray-300")}
            {btn("M-", () => setMemory(memory - parseFloat(display)), "bg-gray-800 hover:bg-gray-700 text-gray-300")}
            {btn("^", () => handleOperator("**"), "bg-gray-700 hover:bg-gray-600 text-orange-300")}

            {btn("C", clear, "bg-red-600/30 hover:bg-red-600/50 text-red-400")}
            {btn("⌫", backspace, "bg-gray-800 hover:bg-gray-700 text-gray-300")}
            {btn("%", () => handleFunction("%"), "bg-gray-700 hover:bg-gray-600 text-orange-300")}
            {btn("÷", () => handleOperator("÷"), "bg-purple-600/30 hover:bg-purple-600/50 text-purple-300")}
            {btn("±", () => handleFunction("+/-"), "bg-gray-700 hover:bg-gray-600 text-gray-300")}

            {btn("7", () => handleNumber("7"), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("8", () => handleNumber("8"), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("9", () => handleNumber("9"), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("×", () => handleOperator("×"), "bg-purple-600/30 hover:bg-purple-600/50 text-purple-300")}
            {btn("(", () => handleNumber("("), "bg-gray-700 hover:bg-gray-600 text-gray-300")}

            {btn("4", () => handleNumber("4"), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("5", () => handleNumber("5"), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("6", () => handleNumber("6"), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("-", () => handleOperator("-"), "bg-purple-600/30 hover:bg-purple-600/50 text-purple-300")}
            {btn(")", () => handleNumber(")"), "bg-gray-700 hover:bg-gray-600 text-gray-300")}

            {btn("1", () => handleNumber("1"), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("2", () => handleNumber("2"), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("3", () => handleNumber("3"), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("+", () => handleOperator("+"), "bg-purple-600/30 hover:bg-purple-600/50 text-purple-300")}
            {btn("=", handleEquals, "bg-purple-600 hover:bg-purple-700 text-white row-span-2")}

            {btn("0", () => handleNumber("0"), "bg-gray-800 hover:bg-gray-700 text-white col-span-2")}
            {btn(".", () => handleNumber("."), "bg-gray-800 hover:bg-gray-700 text-white")}
            {btn("1/x", () => handleFunction("1/x"), "bg-gray-700 hover:bg-gray-600 text-gray-300")}
          </div>
        </div>

        {history.length > 0 && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
            <h3 className="font-bold text-xs mb-1">History</h3>
            <div className="max-h-24 overflow-auto space-y-0.5">
              {history.map((h, i) => (
                <div key={i} className="text-xs font-mono text-gray-400">{h}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
