import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "BMI Calculator - Calculate Body Mass Index Online Free",
  description: "Calculate your BMI instantly. Imperial and metric units. See your BMI category and healthy weight range. Free online BMI calculator.",
  keywords: ["BMI calculator", "body mass index", "BMI chart", "calculate BMI", "healthy weight calculator", "weight calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
