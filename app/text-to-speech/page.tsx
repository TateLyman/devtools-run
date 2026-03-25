"use client";
import { useState, useEffect } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices();
      setVoices(v);
      if (v.length && !selectedVoice) setSelectedVoice(v[0].name);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.cancel(); };
  }, []);

  const speak = () => {
    if (!text.trim()) return;
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utter);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  const pause = () => speechSynthesis.pause();
  const resume = () => speechSynthesis.resume();

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedTime = Math.ceil(wordCount / (150 * rate));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text to Speech</h1>
        <p className="text-[var(--text-secondary)]">
          Convert text to speech using your browser's built-in voices. Adjust speed and pitch. Free, works offline.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter or paste text to speak..."
        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-48 resize-none text-sm"
      />

      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        <span>{charCount} chars</span>
        <span>·</span>
        <span>{wordCount} words</span>
        <span>·</span>
        <span>~{estimatedTime} min</span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm mb-1">Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Speed: {rate.toFixed(1)}x</label>
          <input type="range" min={0.25} max={4} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-purple-500" />
        </div>

        <div>
          <label className="block text-sm mb-1">Pitch: {pitch.toFixed(1)}</label>
          <input type="range" min={0} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full accent-purple-500" />
        </div>
      </div>

      <div className="flex gap-3">
        {!speaking ? (
          <button onClick={speak} disabled={!text.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold text-lg">
            Speak
          </button>
        ) : (
          <>
            <button onClick={stop} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-bold">Stop</button>
            <button onClick={pause} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded">Pause</button>
            <button onClick={resume} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded">Resume</button>
          </>
        )}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">Tips</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Uses your browser's built-in speech synthesis — no data sent anywhere</li>
          <li>Works completely offline</li>
          <li>Available voices depend on your OS and browser</li>
          <li>Great for proofreading — hearing text reveals errors you miss when reading</li>
        </ul>
      </div>
    </div>
  );
}
