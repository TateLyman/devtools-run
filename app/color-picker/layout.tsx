import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Color Picker - HEX, RGB, HSL Color Picker Online Free",
  description: "Pick any color and get HEX, RGB, HSL, RGBA, CSS, and Tailwind values. Generate shades. Click to copy. Free online color picker tool.",
  keywords: ["color picker", "hex color picker", "RGB color picker", "online color picker", "color selector", "pick color from screen"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
