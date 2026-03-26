import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Electricity Cost Calculator - How Much Does It Cost to Run?",
  description: "Calculate electricity cost for any appliance. Enter watts, hours, rate. See daily, monthly, yearly cost. Free electricity cost calculator.",
  keywords: ["electricity cost calculator", "power cost", "energy cost calculator", "appliance cost", "watts to dollars", "electricity bill calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
