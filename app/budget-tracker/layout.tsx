import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Budget Tracker - Free Monthly Budget Planner & Expense Calculator",
  description: "Track your monthly budget free. Add income & expenses, see spending by category, get savings rate. No signup. Free budget tracker & expense calculator.",
  keywords: ["budget tracker", "budget planner", "expense tracker", "monthly budget", "savings calculator", "budget calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
