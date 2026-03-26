import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Morse Code Translator - Text to Morse & Morse to Text Free",
  description: "Translate text to Morse code and Morse code to text instantly. Play audio, copy dots and dashes. Free Morse code translator & decoder.",
  keywords: ["morse code translator", "morse code decoder", "text to morse", "morse to text", "morse code converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
