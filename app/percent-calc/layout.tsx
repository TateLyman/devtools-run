import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Percentage Calculator - What is X% of Y? Free Calculator",
  description: "Calculate percentages easily. What is X% of Y? X is what % of Y? Percentage increase/decrease. Tip calculator. Free percentage calculator.",
  keywords: ["percentage calculator", "percent calculator", "what is percent of", "percentage increase", "percentage decrease", "percent change"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
