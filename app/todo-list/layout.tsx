import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Todo List - Free Online Task Manager, No Signup",
  description: "Simple todo list that saves to your browser. Add tasks, check them off, clear completed. No signup needed. Free online todo list.",
  keywords: ["todo list", "task list", "free todo", "online todo", "task manager", "to do list app"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
