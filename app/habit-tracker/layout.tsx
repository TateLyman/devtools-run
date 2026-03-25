import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Habit Tracker - Track Daily Habits & Build Streaks Free",
  description: "Track daily habits and build streaks. 7-day history visualization. Data saved in browser. Add custom habits. Free online habit tracker.",
  keywords: ["habit tracker", "daily habit tracker", "streak tracker", "habit builder", "free habit tracker", "daily routine tracker"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
