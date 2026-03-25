import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Due Date Calculator - Pregnancy Due Date by LMP Free",
  description: "Calculate your due date from last menstrual period. See weeks, trimester, progress, milestones. Free pregnancy due date calculator.",
  keywords: ["due date calculator", "pregnancy calculator", "when is my due date", "pregnancy due date", "LMP calculator", "pregnancy weeks"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
