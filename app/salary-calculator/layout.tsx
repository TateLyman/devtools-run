import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Salary Calculator - Annual to Hourly, Tax Estimate Online Free",
  description: "Convert between annual, monthly, biweekly, weekly, daily, and hourly pay rates. Estimate federal tax and take-home pay. Free salary calculator.",
  keywords: ["salary calculator", "annual to hourly", "hourly to annual", "take home pay", "salary conversion", "pay calculator", "after tax salary"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
