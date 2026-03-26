"use client";
import { useState, useRef, useEffect } from "react";

function generateQR(text: string, size: number): string {
  // Use Google Charts API for QR generation
  return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(text)}&choe=UTF-8`;
}

export default function WifiPassword() {
  const [ssid, setSsid] = useState("MyNetwork");
  const [password, setPassword] = useState("mypassword123");
  const [encryption, setEncryption] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? "true" : "false"};;`;
  const qrUrl = generateQR(wifiString, 300);

  const download = () => {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `wifi-${ssid}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">WiFi QR Code Generator</h1>
        <p className="text-[var(--text-secondary)]">Create a QR code guests can scan to connect to your WiFi</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
        <div>
          <label className="text-sm text-[var(--text-secondary)] block mb-1">Network Name (SSID)</label>
          <input value={ssid} onChange={e => setSsid(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" placeholder="Your WiFi name" />
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)] block mb-1">Password</label>
          <div className="relative">
            <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? "text" : "password"}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 pr-16" placeholder="WiFi password" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400">{showPw ? "Hide" : "Show"}</button>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Encryption</label>
            <select value={encryption} onChange={e => setEncryption(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2">
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None (Open)</option>
            </select>
          </div>
          <label className="text-sm mt-5"><input type="checkbox" checked={hidden} onChange={e => setHidden(e.target.checked)} className="mr-1" />Hidden network</label>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-xl">
          <img src={qrUrl} alt="WiFi QR Code" className="w-64 h-64" />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={download} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Download QR</button>
        <button onClick={() => navigator.clipboard.writeText(wifiString)} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-6 py-2 rounded-lg font-bold hover:bg-[var(--bg-primary)]">Copy WiFi String</button>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 text-center text-sm text-blue-400">
        Your WiFi credentials are processed locally. Nothing is sent to any server except the QR image generation.
      </div>
    </div>
  );
}
