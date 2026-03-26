import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ASCII Art Text Generator - Convert Text to ASCII Art Free",
  description: "Convert text to ASCII art using block letters. Multiple styles. Copy and paste. Free ASCII art text generator for comments, readmes, banners.",
  keywords: ["ASCII art generator", "text to ASCII art", "ASCII text", "block letters", "figlet", "ASCII banner"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
