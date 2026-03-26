import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Savings Goal Calculator - How Long to Save? Free Calculator",
  description: "Calculate how long to reach your savings goal. Enter target amount, monthly savings, and interest rate. See timeline and total saved. Free calculator.",
  keywords: ["savings goal calculator", "how long to save", "savings calculator", "financial goal calculator", "save money calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
