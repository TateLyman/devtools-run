import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Flashcard Maker - Create & Study Flashcards Online Free",
  description: "Create and study flashcards. Add questions, flip to reveal answers, shuffle. Free online flashcard maker and study tool.",
  keywords: ["flashcard maker", "flashcards online", "study flashcards", "flashcard generator", "free flashcards", "study tool"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
