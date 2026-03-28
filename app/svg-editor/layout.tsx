import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online SVG Editor — Create and Edit SVG Files",
  description:
    "Draw rectangles, circles, lines, and text on a visual SVG canvas. Import existing SVGs, export as SVG or PNG. Free online SVG editor with no signup.",
  keywords: [
    "SVG editor",
    "SVG drawing tool",
    "create SVG online",
    "edit SVG",
    "SVG to PNG",
    "free SVG editor",
    "online SVG creator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
