import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Wordle - Free Unlimited Word Guessing Game",
  description: "Play unlimited Wordle free. Guess the 5-letter word in 6 tries. Green, yellow, gray hints. New word every game. No daily limit.",
  keywords: ["wordle", "wordle unlimited", "word game", "wordle free", "guess the word", "5 letter word game"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
