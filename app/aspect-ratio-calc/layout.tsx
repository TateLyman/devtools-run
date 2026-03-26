import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Aspect Ratio Calculator - Calculate Width & Height Free",
  description: "Calculate aspect ratios. Enter width and height, get ratio. Scale dimensions while maintaining ratio. Common ratios: 16:9, 4:3, 1:1. Free calculator.",
  keywords: ["aspect ratio calculator", "calculate aspect ratio", "16:9 calculator", "resize aspect ratio", "width height calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
