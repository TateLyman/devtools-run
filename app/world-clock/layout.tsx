import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "World Clock - Current Time in Cities Around the World",
  description: "See the current time in cities around the world. 18 time zones, day/night indicators, customizable city list. Free online world clock.",
  keywords: ["world clock", "time zones", "current time", "world time", "time zone converter", "international clock"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
