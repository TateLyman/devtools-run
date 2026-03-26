"use client";
import { useState, useEffect } from "react";

type Entry = { id: string; name: string; amount: number; category: string };

const CATEGORIES = ["Housing", "Food", "Transport", "Entertainment", "Utilities", "Healthcare", "Shopping", "Savings", "Other"];
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280"];

export default function BudgetTracker() {
  const [income, setIncome] = useState<Entry[]>([]);
  const [expenses, setExpenses] = useState<Entry[]>([]);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const [tab, setTab] = useState<"income" | "expense">("expense");

  useEffect(() => {
    const saved = localStorage.getItem("budget-data");
    if (saved) {
      const d = JSON.parse(saved);
      setIncome(d.income || []);
      setExpenses(d.expenses || []);
    }
  }, []);

  useEffect(() => {
    if (income.length || expenses.length) {
      localStorage.setItem("budget-data", JSON.stringify({ income, expenses }));
    }
  }, [income, expenses]);

  const totalIncome = income.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  const byCategory = CATEGORIES.map((cat, i) => {
    const total = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
    return { cat, total, color: COLORS[i], pct: totalExpenses > 0 ? (total / totalExpenses * 100) : 0 };
  }).filter(c => c.total > 0);

  const addEntry = () => {
    if (!newName.trim() || !newAmount) return;
    const entry: Entry = { id: Date.now().toString(), name: newName.trim(), amount: parseFloat(newAmount), category: newCategory };
    if (tab === "income") setIncome([...income, entry]);
    else setExpenses([...expenses, entry]);
    setNewName(""); setNewAmount("");
  };

  const remove = (id: string, type: "income" | "expense") => {
    if (type === "income") setIncome(income.filter(e => e.id !== id));
    else setExpenses(expenses.filter(e => e.id !== id));
  };

  const exportCSV = () => {
    let csv = "Type,Name,Category,Amount\n";
    income.forEach(e => csv += `Income,${e.name},${e.category},${e.amount}\n`);
    expenses.forEach(e => csv += `Expense,${e.name},${e.category},${e.amount}\n`);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "budget.csv"; a.click();
  };

  const clearAll = () => { setIncome([]); setExpenses([]); localStorage.removeItem("budget-data"); };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Budget Tracker</h1>
        <p className="text-[var(--text-secondary)]">Track income & expenses. Data saved locally in your browser.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Income", value: totalIncome, color: "text-emerald-400" },
          { label: "Expenses", value: totalExpenses, color: "text-red-400" },
          { label: "Balance", value: balance, color: balance >= 0 ? "text-emerald-400" : "text-red-400" },
          { label: "Savings Rate", value: null, color: savingsRate >= 20 ? "text-emerald-400" : savingsRate >= 0 ? "text-yellow-400" : "text-red-400" },
        ].map((c, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
            <div className="text-xs text-[var(--text-secondary)] mb-1">{c.label}</div>
            <div className={`text-2xl font-bold ${c.color}`}>
              {c.value !== null ? `$${c.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${savingsRate.toFixed(1)}%`}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("expense")} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === "expense" ? "bg-red-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>+ Expense</button>
          <button onClick={() => setTab("income")} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === "income" ? "bg-emerald-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>+ Income</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Description" className="flex-1 min-w-[150px] bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
          <input value={newAmount} onChange={e => setNewAmount(e.target.value)} type="number" step="0.01" min="0" placeholder="Amount" className="w-28 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
          {tab === "expense" && (
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <button onClick={addEntry} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm">Add</button>
        </div>
      </div>

      {byCategory.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {byCategory.sort((a, b) => b.total - a.total).map(c => (
              <div key={c.cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c.color }} />{c.cat}</span>
                  <span className="text-[var(--text-secondary)]">${c.total.toFixed(2)} ({c.pct.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-[var(--bg-primary)] rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-bold text-lg mb-3 text-emerald-400">Income ({income.length})</h2>
          {income.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">No income added yet</p> : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {income.map(e => (
                <div key={e.id} className="flex justify-between items-center text-sm bg-[var(--bg-primary)] rounded-lg px-3 py-2">
                  <span>{e.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-mono">${e.amount.toFixed(2)}</span>
                    <button onClick={() => remove(e.id, "income")} className="text-red-400 hover:text-red-300 text-xs">x</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-bold text-lg mb-3 text-red-400">Expenses ({expenses.length})</h2>
          {expenses.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">No expenses added yet</p> : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {expenses.map(e => (
                <div key={e.id} className="flex justify-between items-center text-sm bg-[var(--bg-primary)] rounded-lg px-3 py-2">
                  <span>{e.name} <span className="text-xs text-[var(--text-secondary)]">({e.category})</span></span>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-mono">${e.amount.toFixed(2)}</span>
                    <button onClick={() => remove(e.id, "expense")} className="text-red-400 hover:text-red-300 text-xs">x</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button onClick={exportCSV} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Export CSV</button>
        <button onClick={clearAll} className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg text-sm font-bold border border-red-600/30">Clear All</button>
      </div>
    </div>
  );
}
