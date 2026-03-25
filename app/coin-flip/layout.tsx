import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Coin Flip - Flip a Coin Online | Heads or Tails",
  description: "Flip a coin online. Truly random, track history and statistics. Multiple coins. Free virtual coin flipper. Heads or tails?",
  keywords: ["coin flip", "flip a coin", "heads or tails", "online coin toss", "virtual coin flip", "random coin flip"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
