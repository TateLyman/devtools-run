"use client";
import { useState } from "react";

export default function NumberConverter() {
  const [decimal, setDecimal] = useState("255");
  const [binary, setBinary] = useState("11111111");
  const [hex, setHex] = useState("FF");
  const [octal, setOctal] = useState("377");

  const update = (value: string, base: number) => {
    const n = parseInt(value, base);
    if (isNaN(n) || n < 0) return;
    setDecimal(n.toString(10));
    setBinary(n.toString(2));
    setHex(n.toString(16).toUpperCase());
    setOctal(n.toString(8));
  };

  const copy = (t: string) => navigator.clipboard.writeText(t);

  const fields = [
    { label: "Decimal (Base 10)", value: decimal, setter: (v: string) => { setDecimal(v); update(v, 10); }, placeholder: "e.g. 255", prefix: "" },
    { label: "Binary (Base 2)", value: binary, setter: (v: string) => { setBinary(v); update(v, 2); }, placeholder: "e.g. 11111111", prefix: "0b" },
    { label: "Hexadecimal (Base 16)", value: hex, setter: (v: string) => { setHex(v.toUpperCase()); update(v, 16); }, placeholder: "e.g. FF", prefix: "0x" },
    { label: "Octal (Base 8)", value: octal, setter: (v: string) => { setOctal(v); update(v, 8); }, placeholder: "e.g. 377", prefix: "0o" },
  ];

  const n = parseInt(decimal) || 0;
  const bits = Math.max(Math.ceil(Math.log2(n + 1)), 8);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Number Base Converter</h1>
        <p className="text-[var(--text-secondary)]">Convert between binary, hex, octal, and decimal</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(f => (
          <div key={f.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold">{f.label}</label>
              <button onClick={() => copy(f.value)} className="text-xs text-blue-400">Copy</button>
            </div>
            <div className="flex items-center gap-1">
              {f.prefix && <span className="text-sm text-[var(--text-secondary)] font-mono">{f.prefix}</span>}
              <input value={f.value} onChange={e => f.setter(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-lg" placeholder={f.placeholder} />
            </div>
          </div>
        ))}
      </div>

      {n > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-bold text-lg mb-3">Bit Visualization ({bits} bits)</h2>
          <div className="flex flex-wrap gap-1 justify-center">
            {n.toString(2).padStart(bits, "0").split("").map((bit, i) => (
              <div key={i} className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono font-bold ${bit === "1" ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>
                {bit}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 justify-center mt-1">
            {n.toString(2).padStart(bits, "0").split("").map((_, i) => (
              <div key={i} className="w-8 text-center text-xs text-[var(--text-secondary)]">{bits - 1 - i}</div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Common Values</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
              <th className="py-2 pr-4">Decimal</th><th className="py-2 pr-4">Binary</th><th className="py-2 pr-4">Hex</th><th className="py-2">Description</th>
            </tr></thead>
            <tbody>
              {[[0,"0","0","Zero"],[1,"1","1","One"],[8,"1000","8","Byte boundary"],[10,"1010","A","Ten"],[16,"10000","10","Hex 10"],[32,"100000","20","Space (ASCII)"],[64,"1000000","40","@ (ASCII)"],[127,"1111111","7F","Max signed byte"],[128,"10000000","80","Min unsigned byte high"],[255,"11111111","FF","Max byte"],[256,"100000000","100","Byte overflow"],[1024,"10000000000","400","1 KB"],[65535,"1111111111111111","FFFF","Max 16-bit"]].map(([d, b, h, desc]) => (
                <tr key={d as number} className={`border-b border-[var(--border)] ${String(d) === decimal ? "bg-blue-500/10 text-blue-400" : ""}`}>
                  <td className="py-1.5 pr-4 font-mono">{d as number}</td>
                  <td className="py-1.5 pr-4 font-mono">{b as string}</td>
                  <td className="py-1.5 pr-4 font-mono">{h as string}</td>
                  <td className="py-1.5 text-[var(--text-secondary)]">{desc as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
