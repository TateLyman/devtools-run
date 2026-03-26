import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Color Contrast Checker - WCAG AA/AAA Accessibility Free",
  description: "Check color contrast ratio for WCAG AA and AAA compliance. Text and background color checker. Free accessibility contrast checker tool.",
  keywords: ["color contrast checker", "WCAG contrast", "accessibility contrast", "contrast ratio", "AA AAA compliance", "color accessibility"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
