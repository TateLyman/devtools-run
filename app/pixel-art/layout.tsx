import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pixel Art Editor - Create Pixel Art Online Free",
  description: "Create pixel art in your browser. Draw, fill, pick colors, undo, and export as PNG. Multiple grid sizes from 8x8 to 64x64. Free online pixel art maker.",
  keywords: ["pixel art editor", "pixel art maker", "online pixel art", "pixel drawing", "8-bit art", "sprite editor", "pixel art creator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
