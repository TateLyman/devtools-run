"use client";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    color: "gray",
    features: [
      "500+ tools",
      "Unlimited usage",
      "Browser-based processing",
      "No signup required",
    ],
    limits: [
      "Ads shown",
      "Single file processing",
      "Standard quality exports",
    ],
    cta: null,
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "/month",
    color: "purple",
    popular: true,
    features: [
      "Everything in Free",
      "No ads anywhere",
      "Batch processing (50+ files)",
      "Maximum quality exports",
      "Priority processing speed",
      "Early access to new tools",
    ],
    limits: [],
    cta: { label: "Get Pro", href: "/api/stripe-checkout?product=tools-pro" },
    solPrice: "0.03 SOL/month",
  },
  {
    name: "API Access",
    price: "$29.99",
    period: "/month",
    color: "blue",
    features: [
      "Everything in Pro",
      "REST API access",
      "1,000 API calls/month",
      "Image compression API",
      "PDF merge/split API",
      "QR code generation API",
      "Webhook notifications",
    ],
    limits: [],
    cta: { label: "Get API Access", href: "/api/stripe-checkout?product=api-pro" },
    solPrice: "0.2 SOL/month",
  },
];

export default function ProPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Upgrade to Pro</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Remove ads, unlock batch processing, and get API access. All free tools stay free forever.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-6 flex flex-col ${
              plan.popular
                ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/20"
                : "border-[var(--border)] bg-[var(--bg-secondary)]"
            }`}
          >
            {plan.popular && (
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                Most Popular
              </span>
            )}
            <h2 className="text-xl font-bold text-white">{plan.name}</h2>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-white">{plan.price}</span>
              <span className="text-[var(--text-secondary)] text-sm">{plan.period}</span>
            </div>

            <ul className="space-y-2 text-sm flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">+</span>
                  <span className="text-[var(--text-secondary)]">{f}</span>
                </li>
              ))}
              {plan.limits.map((l) => (
                <li key={l} className="flex items-start gap-2">
                  <span className="text-gray-600 mt-0.5">-</span>
                  <span className="text-gray-500">{l}</span>
                </li>
              ))}
            </ul>

            {plan.cta ? (
              <div className="mt-6 space-y-2">
                <a
                  href={plan.cta.href}
                  className={`block w-full text-center py-2.5 rounded-lg font-bold text-white transition-colors ${
                    plan.color === "purple"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {plan.cta.label}
                </a>
                {plan.solPrice && (
                  <p className="text-center text-xs text-[var(--text-secondary)]">
                    or pay with <span className="text-[var(--accent)]">{plan.solPrice}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6">
                <Link
                  href="/"
                  className="block w-full text-center py-2.5 rounded-lg font-bold text-white bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Use Free Tools
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-white">Will free tools stay free?</h3>
            <p className="text-[var(--text-secondary)] mt-1">Yes, always. All 500+ tools are free forever with unlimited usage. Pro just removes ads and adds batch/API features.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Can I pay with crypto?</h3>
            <p className="text-[var(--text-secondary)] mt-1">Yes! We accept SOL (Solana) payments. Send to our wallet and message us to activate your subscription.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Do I need an account?</h3>
            <p className="text-[var(--text-secondary)] mt-1">No. Free tools work without any account. Pro features are activated via a simple email-based license key.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">What payment methods do you accept?</h3>
            <p className="text-[var(--text-secondary)] mt-1">Credit/debit cards (via Stripe), SOL (Solana), and Telegram Stars (via our Telegram bot).</p>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-[var(--text-secondary)]">
        <p>Questions? <Link href="/hire" className="text-[var(--accent)] hover:underline">Contact us</Link> or reach out on <a href="https://t.me/solscanitbot" className="text-[var(--accent)] hover:underline">Telegram</a>.</p>
      </div>
    </div>
  );
}
