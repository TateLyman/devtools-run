import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Date Calculator - Days Between Dates, Add/Subtract Days",
  description: "Calculate days between two dates, add or subtract days from a date. Results in days, weeks, months, years. Free online date calculator.",
  keywords: ["date calculator", "days between dates", "add days", "subtract days", "date difference", "how many days between"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
