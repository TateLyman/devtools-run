import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Zodiac Sign Calculator - Find Your Star Sign Free",
  description: "Find your zodiac sign by birthday. See element, ruling planet, personality traits. All 12 zodiac signs. Free zodiac calculator.",
  keywords: ["zodiac sign calculator", "what is my zodiac sign", "star sign", "horoscope sign", "zodiac birthday", "astrology sign calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
