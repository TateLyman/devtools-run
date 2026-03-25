import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Speech to Text - Free Online Voice Transcription",
  description: "Convert speech to text using your microphone. Supports 13+ languages, continuous mode, instant transcription. Free, browser-based, no data sent to servers.",
  keywords: ["speech to text", "voice to text", "transcription", "dictation", "voice typing", "speech recognition", "free transcription"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
