import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Online Notepad - Free Text Editor, No Signup, Auto-Save",
  description: "Free online notepad with auto-save. Write notes, code, or anything. Saves to your browser. No signup needed. Free online text editor.",
  keywords: ["online notepad", "free notepad", "text editor online", "quick notes", "browser notepad", "no signup notepad"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
