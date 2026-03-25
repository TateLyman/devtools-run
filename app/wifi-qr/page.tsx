"use client";
import { useState } from "react";

export default function WifiQR() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const [hidden, setHidden] = useState(false);

  const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? "true" : "false"};;`;
  const qrUrl = ssid ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(wifiString)}` : "";

  const download = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.download = `wifi-${ssid}.png`;
    a.href = qrUrl;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">WiFi QR Code Generator</h1>
        <p className="text-[var(--text-secondary)]">Generate a QR code for your WiFi. Guests scan it to connect instantly — no typing passwords. Free WiFi QR maker.</p>
      </div>
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm mb-1">Network Name (SSID)</label>
            <input value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Your WiFi name" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="WiFi password" type="password" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Encryption</label>
              <select value={encryption} onChange={(e) => setEncryption(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="accent-purple-500" />
                Hidden network
              </label>
            </div>
          </div>
        </div>
        {qrUrl && (
          <div className="text-center space-y-3">
            <div className="bg-white p-6 rounded-xl inline-block">
              <img src={qrUrl} alt="WiFi QR Code" width={300} height={300} />
            </div>
            <p className="text-xs text-gray-400">Scan with your phone camera to connect to <strong className="text-white">{ssid}</strong></p>
            <button onClick={download} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded font-bold">Download QR Code</button>
          </div>
        )}
        <p className="text-xs text-gray-500 text-center">Your WiFi credentials are NOT sent to any server. The QR is generated using a public QR API with the WiFi connection string.</p>
      </div>
    </div>
  );
}
