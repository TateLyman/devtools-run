import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CSS Specificity Calculator - Compare Selector Specificity",
  description: "Calculate and compare CSS selector specificity. Enter selectors and see which one wins. Visual bar chart. Free online CSS specificity calculator.",
  keywords: ["CSS specificity", "specificity calculator", "CSS selector specificity", "specificity comparison", "CSS cascade"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
