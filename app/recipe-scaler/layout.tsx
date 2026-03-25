import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Recipe Scaler - Scale Recipe Ingredients Up or Down Free",
  description: "Scale recipe ingredients for any number of servings. Automatic conversion with fraction display. Free online recipe multiplier and scaler.",
  keywords: ["recipe scaler", "recipe multiplier", "scale recipe", "recipe converter", "ingredient calculator", "recipe serving size"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
