import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Calorie Calculator - Daily Calories, BMR, TDEE & Macros Free",
  description: "Calculate daily calorie needs. BMR, TDEE, macro split (protein, carbs, fat). Mifflin-St Jeor equation. Lose, maintain, or gain. Free calorie calculator.",
  keywords: ["calorie calculator", "TDEE calculator", "BMR calculator", "macro calculator", "how many calories", "daily calorie needs"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
