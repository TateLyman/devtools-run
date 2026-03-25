import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Electricity Cost Calculator - How Much Does It Cost to Run?",
  description: "Calculate how much an appliance costs to run. Enter watts, hours, rate. See daily, monthly, yearly electricity cost. Appliance presets. Free electricity calculator.",
  keywords: ["electricity cost calculator", "electric bill calculator", "how much electricity", "kWh calculator", "energy cost", "power consumption calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
