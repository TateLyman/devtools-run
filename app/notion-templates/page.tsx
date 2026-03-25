"use client";

const TEMPLATES = [
  { name: "Developer Portfolio", price: "Free", desc: "Clean portfolio template with projects, skills, and contact.", dl: "https://t.me/solscanitbot" },
  { name: "Startup Launch Checklist", price: "0.05 SOL", desc: "150-item checklist for launching a product. Legal, tech, marketing.", dl: "/sol-pay/checkout?to=NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr&amount=0.05&label=Notion+Template" },
  { name: "Content Calendar", price: "0.05 SOL", desc: "Plan and track content across 5 platforms. Auto-status tracking.", dl: "/sol-pay/checkout?to=NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr&amount=0.05&label=Content+Calendar" },
  { name: "Bug Tracker", price: "Free", desc: "Track bugs with priority, status, assignee. Kanban view.", dl: "https://t.me/solscanitbot" },
  { name: "Freelance CRM", price: "0.1 SOL", desc: "Track clients, projects, invoices, and payments. Pipeline view.", dl: "/sol-pay/checkout?to=NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr&amount=0.1&label=Freelance+CRM" },
  { name: "Crypto Trading Journal", price: "0.05 SOL", desc: "Log trades, track PnL, review strategies. Weekly analysis.", dl: "/sol-pay/checkout?to=NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr&amount=0.05&label=Trading+Journal" },
];

export default function NotionTemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Notion Templates</h1>
        <p className="text-gray-400 text-center mb-8">Ready-to-use Notion templates for devs, freelancers, and traders.</p>
        <div className="space-y-4">
          {TEMPLATES.map((t, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </div>
              <a href={t.dl} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${t.price === "Free" ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}`}>
                {t.price === "Free" ? "Get Free" : t.price}
              </a>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/store" className="text-purple-400 hover:underline">Digital Store</a>{" | "}
          <a href="/templates" className="text-purple-400 hover:underline">Code Templates</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
