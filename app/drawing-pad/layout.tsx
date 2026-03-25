import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Drawing Pad - Free Online Drawing Tool & Sketchpad",
  description: "Draw anything online. Free drawing pad with colors, brush sizes, eraser. Download as PNG. Works on desktop and mobile. Free online sketchpad.",
  keywords: ["drawing pad", "online drawing", "sketchpad", "draw online", "free drawing tool", "digital drawing", "paint online"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
