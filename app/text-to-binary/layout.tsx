import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Text to Binary Converter - Binary, Hex, Octal, Morse Code Free",
  description: "Convert text to binary, hexadecimal, octal, or Morse code and back. Free online text encoding and decoding tool.",
  keywords: ["text to binary", "binary converter", "text to hex", "morse code translator", "binary to text", "hex converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
