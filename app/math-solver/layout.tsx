import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Math Solver - Solve Equations & Expressions Online Free",
  description: "Solve math expressions and quadratic equations. Step-by-step solutions. Supports +, -, *, /, ^, sqrt, parentheses. Free online math solver.",
  keywords: ["math solver", "equation solver", "quadratic solver", "math calculator", "solve equation online", "algebra calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
