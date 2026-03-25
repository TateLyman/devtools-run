import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SQL to MongoDB Converter - Convert SQL Queries to Mongo Shell",
  description: "Convert SQL queries to MongoDB shell commands. Supports SELECT, INSERT, UPDATE, DELETE with WHERE, ORDER BY, LIMIT, LIKE, IN. Free SQL to MongoDB converter.",
  keywords: ["SQL to MongoDB", "convert SQL to Mongo", "MongoDB query converter", "SQL MongoDB translator", "NoSQL converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
