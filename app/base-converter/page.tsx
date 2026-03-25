"use client";
import { useState } from "react";

export default function BaseConverterPage() {
  const [input, setInput] = useState("255");
  const [base, setBase] = useState(10);
  const dec = parseInt(input, base) || 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Number Base Converter</h1>
        <p className="text-gray-400 text-center mb-8">Convert between binary, octal, decimal, and hexadecimal.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="flex gap-2 mb-4">
            {[{n:"Binary",b:2},{n:"Octal",b:8},{n:"Decimal",b:10},{n:"Hex",b:16}].map(({n,b})=>(
              <button key={b} onClick={()=>{setBase(b);setInput(dec.toString(b));}} className={`flex-1 py-2 rounded-lg text-sm font-bold ${base===b?"bg-purple-600":"bg-gray-800 hover:bg-gray-700"}`}>{n}</button>
            ))}
          </div>
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-xl text-center mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3"><div className="text-xs text-gray-400">Binary (base 2)</div><div className="font-mono text-green-400 break-all">{dec.toString(2)}</div></div>
            <div className="bg-gray-800 rounded-lg p-3"><div className="text-xs text-gray-400">Octal (base 8)</div><div className="font-mono text-blue-400">{dec.toString(8)}</div></div>
            <div className="bg-gray-800 rounded-lg p-3"><div className="text-xs text-gray-400">Decimal (base 10)</div><div className="font-mono text-purple-400">{dec}</div></div>
            <div className="bg-gray-800 rounded-lg p-3"><div className="text-xs text-gray-400">Hexadecimal (base 16)</div><div className="font-mono text-yellow-400">{dec.toString(16).toUpperCase()}</div></div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/number-base" className="text-purple-400 hover:underline">Number Base Tool</a>{" | "}
          <a href="/calculator" className="text-purple-400 hover:underline">Calculator</a>{" | "}
          <a href="/convert/binary-to-decimal" className="text-purple-400 hover:underline">Binary/Decimal</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
