import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "What is My Screen Resolution? - Free Screen Size Detector",
  description: "Detect your screen resolution, viewport size, device pixel ratio, and color depth instantly. Free screen resolution checker tool.",
  keywords: ["screen resolution", "what is my screen resolution", "screen size", "viewport size", "display resolution", "pixel ratio"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
