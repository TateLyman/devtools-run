import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Resume Builder - Create Professional Resume Online",
  description: "Build a professional resume in minutes. Choose from modern, classic, or minimal templates. Free, no signup, runs entirely in your browser. Export as text.",
  keywords: ["resume builder", "free resume builder", "resume maker", "CV builder", "resume template", "professional resume"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
