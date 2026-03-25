"use client";
import { useState } from "react";

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState("");

  const click = (v: string) => {
    if (v === "C") { setDisplay("0"); setPrev(""); return; }
    if (v === "=") { try { setDisplay(String(eval(display))); } catch { setDisplay("Error"); } return; }
    if (v === "⌫") { setDisplay(display.length > 1 ? display.slice(0, -1) : "0"); return; }
    setDisplay(display === "0" && !"+-*/.".includes(v) ? v : display + v);
  };

  const buttons = ["C", "⌫", "%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-sm mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Calculator</h1>
        <div className="bg-gray-900 rounded-2xl p-4">
          <div className="bg-gray-800 rounded-xl p-4 mb-4 text-right">
            <div className="text-3xl font-bold font-mono truncate">{display}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {buttons.map((b, i) => (
              <button key={i} onClick={() => click(b)}
                className={`py-4 rounded-xl font-bold text-lg transition-colors ${
                  b === "=" ? "bg-purple-600 hover:bg-purple-700 col-span-1" :
                  "+-*/".includes(b) ? "bg-gray-700 hover:bg-gray-600 text-purple-400" :
                  b === "C" ? "bg-red-600/20 hover:bg-red-600/40 text-red-400" :
                  b === "0" ? "col-span-1 bg-gray-800 hover:bg-gray-700" :
                  "bg-gray-800 hover:bg-gray-700"
                }`}>{b}</button>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/sol-usd" className="text-purple-400 hover:underline">SOL/USD</a>{" | "}
          <a href="/staking-calc" className="text-purple-400 hover:underline">Staking Calc</a>{" | "}
          <a href="/number-base" className="text-purple-400 hover:underline">Number Base</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
