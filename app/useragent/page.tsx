"use client";
import { useState, useEffect } from "react";

export default function UserAgentPage() {
  const [ua, setUa] = useState("");

  useEffect(() => { setUa(navigator.userAgent); }, []);

  const info = (() => {
    const u = ua.toLowerCase();
    const browser = u.includes("firefox") ? "Firefox" : u.includes("edg") ? "Edge" : u.includes("chrome") ? "Chrome" : u.includes("safari") ? "Safari" : "Unknown";
    const os = u.includes("windows") ? "Windows" : u.includes("mac") ? "macOS" : u.includes("linux") ? "Linux" : u.includes("android") ? "Android" : u.includes("iphone") ? "iOS" : "Unknown";
    const mobile = u.includes("mobile") || u.includes("android") || u.includes("iphone");
    return { browser, os, mobile };
  })();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">What Is My User Agent</h1>
        <p className="text-gray-400 text-center mb-8">See your browser's user agent string and parsed details.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="text-sm text-gray-400 mb-2">Your User Agent</div>
          <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-green-400 break-all">{ua}</div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{info.browser}</div>
            <div className="text-xs text-gray-400">Browser</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{info.os}</div>
            <div className="text-xs text-gray-400">OS</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{info.mobile ? "Mobile" : "Desktop"}</div>
            <div className="text-xs text-gray-400">Device</div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/ip" className="text-purple-400 hover:underline">My IP</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/hash" className="text-purple-400 hover:underline">Hash</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/password" className="text-purple-400 hover:underline">Password</a>
        </div>
      </div>
    </div>
  );
}
