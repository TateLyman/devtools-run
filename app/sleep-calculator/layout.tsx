import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sleep Calculator - Best Time to Sleep & Wake Up",
  description: "Calculate the best time to sleep or wake up based on 90-minute sleep cycles. Wake up refreshed. 4-6 sleep cycle options. Free sleep calculator.",
  keywords: ["sleep calculator", "sleep cycle calculator", "when to sleep", "when to wake up", "best time to sleep", "sleep cycles"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
