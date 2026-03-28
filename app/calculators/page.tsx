import Link from "next/link";

const calculators = [
  { href: "/bmi-calculator", name: "BMI Calculator", desc: "Calculate your Body Mass Index with imperial or metric units." },
  { href: "/mortgage-calculator", name: "Mortgage Calculator", desc: "Calculate monthly payments, total interest, and amortization schedule." },
  { href: "/percentage-calculator", name: "Percentage Calculator", desc: "Calculate percentages, percentage change, and percentage of a number." },
  { href: "/tip-calculator", name: "Tip Calculator", desc: "Calculate tip amount and split the bill between multiple people." },
  { href: "/loan-calculator", name: "Loan Calculator", desc: "Calculate monthly loan payments, total interest, and payoff schedule." },
  { href: "/calorie-calculator", name: "Calorie Calculator", desc: "Calculate daily calorie needs based on age, weight, height, and activity level." },
  { href: "/bmr-calculator", name: "BMR Calculator", desc: "Calculate your Basal Metabolic Rate — calories burned at rest." },
  { href: "/age-calculator", name: "Age Calculator", desc: "Calculate exact age in years, months, and days from any date." },
  { href: "/aspect-ratio-calc", name: "Aspect Ratio Calculator", desc: "Calculate dimensions from aspect ratios for images and video." },
  { href: "/sol-calc", name: "SOL/USD Calculator", desc: "Convert between Solana (SOL) and USD with live prices." },
];

export default function CalculatorsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Free Online Calculators</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          BMI, mortgage, percentage, tip, loan, calorie calculators and more. All free, all instant, no signup required.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 hover:border-emerald-500/50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">
              {calc.name}
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">{calc.desc}</p>
          </Link>
        ))}
      </div>

      <div className="text-center text-sm text-[var(--text-secondary)]">
        <p>Browse our <Link href="/image-tools" className="text-[var(--accent)] hover:underline">Image Tools</Link>, <Link href="/pdf-tools" className="text-[var(--accent)] hover:underline">PDF Tools</Link>, or all <Link href="/" className="text-[var(--accent)] hover:underline">500+ free tools</Link>.</p>
      </div>
    </div>
  );
}
