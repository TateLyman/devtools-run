"use client";
import { useState } from "react";

function ipToNum(ip: string): number {
  const p = ip.split(".").map(Number);
  return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0;
}
function numToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}
function numToBin(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].map(o => o.toString(2).padStart(8, "0")).join(".");
}

export default function SubnetCalc() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);

  const valid = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip) && ip.split(".").every(o => Number(o) >= 0 && Number(o) <= 255);
  const ipNum = valid ? ipToNum(ip) : 0;
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcard = (~mask) >>> 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
  const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? totalHosts : Math.max(totalHosts - 2, 0);

  const ipClass = ipNum < 0x80000000 ? "A" : ipNum < 0xC0000000 ? "B" : ipNum < 0xE0000000 ? "C" : ipNum < 0xF0000000 ? "D" : "E";
  const isPrivate = (ipNum >= ipToNum("10.0.0.0") && ipNum <= ipToNum("10.255.255.255")) ||
    (ipNum >= ipToNum("172.16.0.0") && ipNum <= ipToNum("172.31.255.255")) ||
    (ipNum >= ipToNum("192.168.0.0") && ipNum <= ipToNum("192.168.255.255"));

  const copy = (t: string) => navigator.clipboard.writeText(t);

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{value}</span>
        <button onClick={() => copy(value)} className="text-xs text-blue-400 hover:text-blue-300">Copy</button>
      </div>
    </div>
  );

  const commonSubnets = [8, 16, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Subnet Calculator</h1>
        <p className="text-[var(--text-secondary)]">Calculate IP subnets, CIDR notation, host ranges & more</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-[var(--text-secondary)] block mb-1">IP Address</label>
            <input value={ip} onChange={e => setIp(e.target.value)} className={`w-full bg-[var(--bg-primary)] border rounded-lg px-3 py-2 font-mono ${valid ? "border-[var(--border)]" : "border-red-500"}`} />
          </div>
          <div className="w-32">
            <label className="text-sm text-[var(--text-secondary)] block mb-1">CIDR (/{cidr})</label>
            <input type="range" min={0} max={32} value={cidr} onChange={e => setCidr(Number(e.target.value))} className="w-full" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">/{cidr}</div>
        </div>
      </div>

      {valid && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-bold text-lg mb-3">Network Details</h2>
              <Row label="Network Address" value={numToIp(network)} />
              <Row label="Broadcast Address" value={numToIp(broadcast)} />
              <Row label="First Usable Host" value={numToIp(firstHost)} />
              <Row label="Last Usable Host" value={numToIp(lastHost)} />
              <Row label="Total Addresses" value={totalHosts.toLocaleString()} />
              <Row label="Usable Hosts" value={usableHosts.toLocaleString()} />
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-bold text-lg mb-3">Masks & Info</h2>
              <Row label="Subnet Mask" value={numToIp(mask)} />
              <Row label="Wildcard Mask" value={numToIp(wildcard)} />
              <Row label="CIDR Notation" value={`${numToIp(network)}/${cidr}`} />
              <Row label="IP Class" value={`Class ${ipClass}`} />
              <Row label="IP Type" value={isPrivate ? "Private" : "Public"} />
              <Row label="Binary Mask" value={numToBin(mask)} />
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="font-bold text-lg mb-3">Common Subnets Reference</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
                    <th className="py-2 pr-4">CIDR</th><th className="py-2 pr-4">Subnet Mask</th><th className="py-2 pr-4">Addresses</th><th className="py-2">Usable Hosts</th>
                  </tr>
                </thead>
                <tbody>
                  {commonSubnets.map(c => {
                    const m = c === 0 ? 0 : (~0 << (32 - c)) >>> 0;
                    const t = Math.pow(2, 32 - c);
                    return (
                      <tr key={c} className={`border-b border-[var(--border)] ${c === cidr ? "bg-blue-500/10 text-blue-400" : ""}`}>
                        <td className="py-2 pr-4 font-mono">/{c}</td>
                        <td className="py-2 pr-4 font-mono">{numToIp(m)}</td>
                        <td className="py-2 pr-4">{t.toLocaleString()}</td>
                        <td className="py-2">{c >= 31 ? t : Math.max(t - 2, 0).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
