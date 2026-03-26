import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Focus Timer - Pomodoro Timer with Break Reminders Free",
  description: "Focus timer with customizable work/break intervals. Pomodoro technique. Sound alerts. Session counter. Free focus and productivity timer.",
  keywords: ["focus timer", "pomodoro timer", "productivity timer", "work timer", "study timer", "break timer"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
