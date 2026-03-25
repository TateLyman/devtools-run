import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Loan Calculator - Calculate Monthly Payments & Interest Online",
  description: "Calculate monthly loan payments, total interest, and total cost. Works for auto loans, personal loans, student loans. Free online loan calculator.",
  keywords: ["loan calculator", "car loan calculator", "personal loan calculator", "student loan calculator", "monthly payment calculator", "loan interest calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
