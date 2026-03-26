import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Minesweeper - Free Online Minesweeper Game (Classic)",
  description: "Play Minesweeper free online. Classic minesweeper with Easy, Medium, Hard modes. Timer, flag counter, first-click safety. No download needed.",
  keywords: ["minesweeper", "minesweeper online", "free minesweeper", "minesweeper game", "play minesweeper"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
