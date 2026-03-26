import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sudoku - Free Online Sudoku Puzzle Game",
  description: "Play Sudoku free online. Easy, Medium, Hard puzzles. Auto-check, hints, pencil marks. New puzzle every game. No download.",
  keywords: ["sudoku", "sudoku online", "free sudoku", "sudoku puzzle", "play sudoku", "sudoku game"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
