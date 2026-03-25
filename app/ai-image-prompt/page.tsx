"use client";
import { useState } from "react";

const styles = [
  "photorealistic", "cinematic", "anime", "watercolor", "oil painting", "digital art",
  "pixel art", "3D render", "sketch", "minimalist", "surreal", "cyberpunk",
  "steampunk", "fantasy", "sci-fi", "vintage", "pop art", "abstract",
];

const subjects = [
  "portrait", "landscape", "architecture", "nature", "animal", "food",
  "vehicle", "character", "scene", "object", "abstract concept",
];

const moods = [
  "dramatic", "peaceful", "mysterious", "energetic", "melancholic",
  "joyful", "dark", "ethereal", "warm", "cold", "nostalgic",
];

const lightings = [
  "golden hour", "blue hour", "studio lighting", "neon lights",
  "candlelight", "moonlight", "backlit", "rim lighting",
  "volumetric lighting", "natural light", "dramatic shadows",
];

export default function AIImagePrompt() {
  const [subject, setSubject] = useState("a lone astronaut");
  const [style, setStyle] = useState("cinematic");
  const [mood, setMood] = useState("dramatic");
  const [lighting, setLighting] = useState("volumetric lighting");
  const [details, setDetails] = useState("detailed, 8k, ultra sharp");
  const [negative, setNegative] = useState("blurry, low quality, distorted");
  const [copied, setCopied] = useState(false);

  const prompt = `${subject}, ${style} style, ${mood} mood, ${lighting}, ${details}`;
  const fullPrompt = negative ? `${prompt}\n\nNegative prompt: ${negative}` : prompt;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">AI Image Prompt Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate detailed prompts for Midjourney, DALL-E, Stable Diffusion. Choose style, mood, lighting, and details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Describe what you want to see..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          </div>

          <div>
            <label className="block text-sm mb-1">Art Style</label>
            <div className="flex flex-wrap gap-1">
              {styles.map((s) => (
                <button key={s} onClick={() => setStyle(s)} className={`px-2 py-1 rounded text-xs ${style === s ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400 hover:text-white"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Mood</label>
            <div className="flex flex-wrap gap-1">
              {moods.map((m) => (
                <button key={m} onClick={() => setMood(m)} className={`px-2 py-1 rounded text-xs ${mood === m ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400 hover:text-white"}`}>{m}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Lighting</label>
            <div className="flex flex-wrap gap-1">
              {lightings.map((l) => (
                <button key={l} onClick={() => setLighting(l)} className={`px-2 py-1 rounded text-xs ${lighting === l ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400 hover:text-white"}`}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Extra Details</label>
            <input value={details} onChange={(e) => setDetails(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          </div>

          <div>
            <label className="block text-sm mb-1">Negative Prompt</label>
            <input value={negative} onChange={(e) => setNegative(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Generated Prompt</label>
            <button onClick={() => { navigator.clipboard.writeText(fullPrompt); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 min-h-[200px]">
            <p className="text-white text-sm">{prompt}</p>
            {negative && (
              <p className="text-red-400/70 text-sm mt-4">Negative: {negative}</p>
            )}
          </div>

          <div className="mt-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
            <h3 className="font-bold text-white mb-1">Tips</h3>
            <ul className="space-y-1">
              <li>Be specific: "a red 1967 Mustang" beats "a car"</li>
              <li>Add camera details: "35mm lens, f/1.4, shallow depth of field"</li>
              <li>Reference artists: "in the style of Studio Ghibli"</li>
              <li>Use quality tags: "masterpiece, best quality, highly detailed"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
