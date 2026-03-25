import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rock Paper Scissors - Play Online Free Against Computer",
  description: "Play Rock Paper Scissors against the computer. Track wins, losses, draws. Animated gameplay. Free online RPS game.",
  keywords: ["rock paper scissors", "RPS game", "rock paper scissors online", "play RPS", "rock paper scissors game"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
