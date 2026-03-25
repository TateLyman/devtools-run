import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Text to Speech - Free Online TTS Converter",
  description: "Convert text to speech online for free. Multiple voices, adjustable speed and pitch. Works offline, no signup. Browser-based text-to-speech tool.",
  keywords: ["text to speech", "TTS", "text to speech online", "free TTS", "speech synthesis", "read text aloud", "voice generator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
