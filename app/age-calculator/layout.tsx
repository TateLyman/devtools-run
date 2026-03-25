import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Age Calculator - Calculate Your Exact Age Online Free",
  description: "Calculate your exact age in years, months, and days. See total days lived, hours, minutes, days until next birthday, zodiac sign. Free online age calculator.",
  keywords: ["age calculator", "calculate age", "how old am I", "exact age calculator", "birthday calculator", "date of birth calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
