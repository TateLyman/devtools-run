import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Crontab Generator - Build & Explain Cron Expressions Online",
  description: "Build, explain, and test cron expressions. See next run times instantly. 10 common presets. Free online crontab generator and explainer tool.",
  keywords: ["crontab generator", "cron expression", "cron builder", "crontab guru", "cron schedule", "cron job", "crontab explainer"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
