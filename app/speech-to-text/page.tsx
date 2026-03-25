"use client";
import { useState, useRef, useCallback } from "react";

export default function SpeechToText() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [continuous, setContinuous] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText((prev) => {
        // If continuous, append new results
        if (continuous && event.results[event.results.length - 1].isFinal) {
          return prev + transcript + " ";
        }
        return transcript;
      });
    };

    recognition.onstart = () => { setListening(true); setError(""); };
    recognition.onend = () => {
      setListening(false);
      if (continuous && recognitionRef.current) {
        try { recognition.start(); } catch {}
      }
    };
    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") setError("Microphone access denied. Please allow microphone access.");
      else if (event.error !== "aborted") setError(`Error: ${event.error}`);
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, continuous]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const languages = [
    { code: "en-US", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "es-ES", label: "Spanish" },
    { code: "fr-FR", label: "French" },
    { code: "de-DE", label: "German" },
    { code: "it-IT", label: "Italian" },
    { code: "pt-BR", label: "Portuguese (BR)" },
    { code: "ja-JP", label: "Japanese" },
    { code: "ko-KR", label: "Korean" },
    { code: "zh-CN", label: "Chinese (Simplified)" },
    { code: "hi-IN", label: "Hindi" },
    { code: "ar-SA", label: "Arabic" },
    { code: "ru-RU", label: "Russian" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Speech to Text</h1>
        <p className="text-[var(--text-secondary)]">
          Convert speech to text using your microphone. Supports 13+ languages. Free, runs in your browser, no data sent to servers.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
          {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={continuous} onChange={(e) => setContinuous(e.target.checked)} className="accent-purple-500" />
          Continuous mode
        </label>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>
      )}

      <div className="flex justify-center">
        {!listening ? (
          <button onClick={startListening} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            Start Recording
          </button>
        ) : (
          <button onClick={stopListening} className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 animate-pulse">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
            Stop Recording
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Transcribed text will appear here..."
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-64 resize-none text-sm"
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          {text && <button onClick={handleCopy} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">{copied ? "Copied!" : "Copy"}</button>}
          {text && <button onClick={() => setText("")} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">Clear</button>}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
        <span>{wordCount} words</span>
        <span>{text.length} characters</span>
      </div>
    </div>
  );
}
