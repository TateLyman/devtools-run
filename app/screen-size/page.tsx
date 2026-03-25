"use client";
import { useState, useEffect } from "react";

export default function ScreenSizePage() {
  const [size, setSize] = useState({ w: 0, h: 0, dpr: 1, orientation: "" });

  useEffect(() => {
    function update() {
      setSize({
        w: window.innerWidth, h: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
        orientation: window.innerWidth > window.innerHeight ? "Landscape" : "Portrait",
      });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const breakpoint = size.w < 640 ? "sm (Mobile)" : size.w < 768 ? "md (Tablet)" : size.w < 1024 ? "lg (Small Laptop)" : size.w < 1280 ? "xl (Desktop)" : "2xl (Large Desktop)";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Screen Size Checker</h1>
        <p className="text-gray-400 text-center mb-8">See your current viewport size, DPR, and Tailwind breakpoint.</p>
        <div className="bg-gray-900 rounded-xl p-8 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-3xl font-extrabold text-purple-400">{size.w}</div>
              <div className="text-xs text-gray-400">Width (px)</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-3xl font-extrabold text-blue-400">{size.h}</div>
              <div className="text-xs text-gray-400">Height (px)</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-3xl font-extrabold text-green-400">{size.dpr}x</div>
              <div className="text-xs text-gray-400">Device Pixel Ratio</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-xl font-extrabold text-yellow-400">{size.orientation}</div>
              <div className="text-xs text-gray-400">Orientation</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-400">Tailwind Breakpoint</div>
            <div className="text-xl font-bold text-purple-400">{breakpoint}</div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">Resize your browser to see values update in real-time</div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/tailwind-colors" className="text-purple-400 hover:underline">Tailwind Colors</a>{" | "}
          <a href="/css-minify" className="text-purple-400 hover:underline">CSS Minify</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/box-shadow" className="text-purple-400 hover:underline">Box Shadow</a>{" | "}
          <a href="/useragent" className="text-purple-400 hover:underline">User Agent</a>
        </div>
      </div>
    </div>
  );
}
