import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hex to Color Name - Find the Closest Color Name for Any Hex Code",
  description: "Find the color name for any hex code. Shows closest named CSS color, RGB values, HSL values. Free hex to color name finder.",
  keywords: ["hex to color name", "color name finder", "what color is", "hex color name", "CSS color names", "named colors"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
