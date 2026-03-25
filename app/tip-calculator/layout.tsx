import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tip Calculator - Calculate Tip & Split Bill Online Free",
  description: "Calculate tip amount and split the bill between friends. Quick presets for 10-30%. Free online tip calculator with bill splitter.",
  keywords: ["tip calculator", "bill splitter", "calculate tip", "restaurant tip", "split bill calculator", "gratuity calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
