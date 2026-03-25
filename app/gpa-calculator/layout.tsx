import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "GPA Calculator - Calculate Your GPA Online Free",
  description: "Calculate your GPA based on grades and credit hours. Add unlimited courses. See cumulative GPA, quality points, and academic standing. Free GPA calculator.",
  keywords: ["GPA calculator", "grade point average", "calculate GPA", "college GPA", "GPA calculator online", "cumulative GPA"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
