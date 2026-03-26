import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pixel Art Editor - Draw Pixel Art Online Free",
  description: "Create pixel art in your browser. Choose grid size, colors, draw with mouse. Export as PNG. Free online pixel art editor.",
  keywords: ["pixel art editor", "pixel art maker", "draw pixel art", "pixel editor online", "8 bit art", "sprite editor"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
