import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mortgage Calculator - Calculate Monthly Payments Online Free",
  description: "Calculate your monthly mortgage payment, total interest, and loan summary. Includes property tax and insurance. Free online mortgage calculator.",
  keywords: ["mortgage calculator", "home loan calculator", "monthly payment calculator", "mortgage estimator", "house payment calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
