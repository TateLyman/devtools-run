"use client";
import { useState } from "react";

const ANIMATIONS = [
  { name: "Fade In", css: "@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n.fade-in { animation: fadeIn 0.5s ease-in; }", preview: "animate-[fadeIn_1s_ease-in_infinite]" },
  { name: "Slide Up", css: "@keyframes slideUp {\n  from { transform: translateY(20px); opacity: 0; }\n  to { transform: translateY(0); opacity: 1; }\n}\n.slide-up { animation: slideUp 0.5s ease-out; }", preview: "animate-[slideUp_1s_ease-out_infinite]" },
  { name: "Bounce", css: "@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }\n}\n.bounce { animation: bounce 1s ease-in-out infinite; }", preview: "animate-bounce" },
  { name: "Pulse", css: "@keyframes pulse {\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0.5; }\n}\n.pulse { animation: pulse 2s ease-in-out infinite; }", preview: "animate-pulse" },
  { name: "Spin", css: "@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n.spin { animation: spin 1s linear infinite; }", preview: "animate-spin" },
  { name: "Shake", css: "@keyframes shake {\n  0%, 100% { transform: translateX(0); }\n  25% { transform: translateX(-5px); }\n  75% { transform: translateX(5px); }\n}\n.shake { animation: shake 0.5s ease-in-out; }", preview: "animate-[shake_0.5s_ease-in-out_infinite]" },
  { name: "Scale In", css: "@keyframes scaleIn {\n  from { transform: scale(0); }\n  to { transform: scale(1); }\n}\n.scale-in { animation: scaleIn 0.3s ease-out; }", preview: "animate-[scaleIn_1s_ease-out_infinite]" },
  { name: "Flip", css: "@keyframes flip {\n  from { transform: perspective(400px) rotateY(0); }\n  to { transform: perspective(400px) rotateY(360deg); }\n}\n.flip { animation: flip 1s ease-in-out; }", preview: "animate-[flip_2s_ease-in-out_infinite]" },
];

export default function AnimationsPage() {
  const [copied, setCopied] = useState("");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">CSS Animations</h1>
        <p className="text-gray-400 text-center mb-8">Copy-paste CSS animations. Click any to copy the code.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {ANIMATIONS.map((a, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5 cursor-pointer hover:bg-gray-800" onClick={() => { navigator.clipboard.writeText(a.css); setCopied(a.name); setTimeout(() => setCopied(""), 1500); }}>
              <div className="flex justify-between mb-3">
                <h3 className="font-bold">{a.name}</h3>
                <span className="text-xs text-green-400">{copied === a.name ? "Copied!" : "Click to copy"}</span>
              </div>
              <div className="flex justify-center mb-3">
                <div className={`w-12 h-12 bg-purple-600 rounded-lg ${a.preview}`} />
              </div>
              <pre className="bg-gray-800 rounded-lg p-3 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre">{a.css}</pre>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/box-shadow" className="text-purple-400 hover:underline">Box Shadow</a>{" | "}
          <a href="/tailwind-colors" className="text-purple-400 hover:underline">Tailwind</a>{" | "}
          <a href="/css-minify" className="text-purple-400 hover:underline">CSS Minify</a>
        </div>
      </div>
    </div>
  );
}
