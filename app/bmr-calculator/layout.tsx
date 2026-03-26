import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "BMR Calculator - Basal Metabolic Rate & TDEE Free",
  description: "Calculate BMR and TDEE. Mifflin-St Jeor equation. Enter age, weight, height, activity level. See daily calorie needs. Free BMR calculator.",
  keywords: ["BMR calculator", "basal metabolic rate", "TDEE calculator", "daily calories", "calorie calculator", "metabolic rate"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
