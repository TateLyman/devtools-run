import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Meditation Timer - Free Mindfulness Timer with Breathing Guide",
  description: "Simple meditation timer with breathing guide circle. Preset durations 1-20 minutes. Progress ring, breath phases. Free online meditation timer.",
  keywords: ["meditation timer", "mindfulness timer", "breathing exercise", "meditation app", "free meditation timer", "breathing timer"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
