import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SQL Formatter - Beautify & Format SQL Queries Online Free",
  description: "Format and beautify SQL queries online. Auto-uppercase keywords, proper indentation. Supports SELECT, INSERT, UPDATE, DELETE, CREATE. Free SQL beautifier.",
  keywords: ["SQL formatter", "SQL beautifier", "format SQL online", "SQL pretty print", "SQL query formatter", "beautify SQL"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
