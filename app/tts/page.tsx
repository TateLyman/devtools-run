"use client";
import { useState, useEffect } from "react";

export default function TTS() {
  const [text, setText] = useState("Hello! This is a free text to speech tool. Type anything and click Speak to hear it.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const load = () => { const v = speechSynthesis.getVoices(); if (v.length) setVoices(v); };
    load();
    speechSynthesis.onvoiceschanged = load;
  }, []);

  const speak = () => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voices[voiceIdx]) u.voice = voices[voiceIdx];
    u.rate = rate; u.pitch = pitch;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    speechSynthesis.speak(u);
  };

  const stop = () => { speechSynthesis.cancel(); setSpeaking(false); };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Text to Speech</h1>
        <p className="text-[var(--text-secondary)]">Convert text to spoken audio using your browser</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <textarea value={text} onChange={e => setText(e.target.value)} rows={6} placeholder="Type or paste text here..."
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-sm resize-none" />
        <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
          <span>{charCount} characters</span>
          <span>{wordCount} words</span>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm text-[var(--text-secondary)] block mb-1">Voice</label>
          <select value={voiceIdx} onChange={e => setVoiceIdx(Number(e.target.value))}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">
            {voices.map((v, i) => <option key={i} value={i}>{v.name} ({v.lang})</option>)}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-[var(--text-secondary)]">Speed: {rate.toFixed(1)}x</label>
            <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)]">Pitch: {pitch.toFixed(1)}</label>
            <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={e => setPitch(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={speak} disabled={!text || speaking} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-bold">
          {speaking ? "Speaking..." : "Speak"}
        </button>
        {speaking && <button onClick={stop} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold">Stop</button>}
      </div>

      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 text-center text-sm text-blue-400">
        Uses your browser built-in speech synthesis. No audio is sent to any server.
      </div>
    </div>
  );
}
