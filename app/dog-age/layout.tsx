import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dog Age Calculator - Convert Dog Years to Human Years",
  description: "Convert dog years to human years based on breed size. Small, medium, large, giant breeds age differently. Accurate dog age calculator. Free online tool.",
  keywords: ["dog age calculator", "dog years to human years", "how old is my dog", "dog age converter", "pet age calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
