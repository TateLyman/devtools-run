import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Color Blindness Simulator - Test Accessibility of Your Colors",
  description: "See how your colors look to people with color blindness. Protanopia, deuteranopia, tritanopia, achromatopsia simulation. Free accessibility tool.",
  keywords: ["color blindness simulator", "color blindness test", "accessibility colors", "color vision deficiency", "protanopia simulator", "deuteranopia test"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
