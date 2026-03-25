import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "2048 Game - Play 2048 Online Free",
  description: "Play the classic 2048 puzzle game. Slide tiles, merge numbers, reach 2048. Score tracking. Arrow keys or on-screen buttons. Free online 2048.",
  keywords: ["2048", "2048 game", "play 2048", "2048 online", "2048 puzzle", "number puzzle game"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
