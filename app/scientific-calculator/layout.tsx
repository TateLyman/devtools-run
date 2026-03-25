import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Scientific Calculator - Free Online Calculator with Trig & Log",
  description: "Full scientific calculator with trigonometry (sin, cos, tan), logarithms, factorials, memory functions, and calculation history. Free online calculator.",
  keywords: ["scientific calculator", "online calculator", "trig calculator", "math calculator", "free calculator", "scientific calculator online"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
