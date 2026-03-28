import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Git Command Generator - Build Git Commands Visually Free",
  description: "Visual Git command builder. Select operations like merge, rebase, reset, cherry-pick and generate the correct git command with flags. Free online Git command generator.",
  keywords: ["git command generator", "git command builder", "git commands", "git cheat sheet", "visual git", "git rebase command", "git merge command", "git reset"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
