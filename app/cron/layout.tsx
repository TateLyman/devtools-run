import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Expression Parser - Explain Cron Schedules Online",
  description:
    "Free online cron expression parser. Enter a cron expression to get a human-readable description. Includes common presets for easy cron generation. No signup required.",
  keywords: [
    "cron expression parser",
    "cron schedule",
    "cron job",
    "cron expression explained",
    "cron generator",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/cron",
  },
};

export default function CronLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
