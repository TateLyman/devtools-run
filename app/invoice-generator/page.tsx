"use client";
import { useState } from "react";

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGenerator() {
  const [from, setFrom] = useState({ name: "", email: "", address: "" });
  const [to, setTo] = useState({ name: "", email: "", address: "" });
  const [invoiceNum, setInvoiceNum] = useState(`INV-${Date.now().toString(36).toUpperCase()}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: 1, rate: 0 }]);
  const [notes, setNotes] = useState("");
  const [tax, setTax] = useState(0);
  const [currency, setCurrency] = useState("USD");

  const addItem = () => setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof LineItem, value: string | number) => {
    const copy = [...items];
    (copy[i] as any)[field] = value;
    setItems(copy);
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal + taxAmount;

  const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", SOL: "◎", BTC: "₿", ETH: "Ξ" };
  const sym = symbols[currency] || "$";

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold mb-2">Invoice Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Create professional invoices for freelance work. Supports crypto payments. Free, no signup.
        </p>
      </div>

      <div className="bg-white text-black rounded-lg p-8 print:p-0 print:rounded-none" id="invoice">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex gap-2 items-center">
                <span className="font-medium">Invoice #:</span>
                <input value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} className="border-b border-gray-300 outline-none bg-transparent print:border-0" />
              </div>
              <div className="flex gap-2 items-center mt-1">
                <span className="font-medium">Date:</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-b border-gray-300 outline-none bg-transparent print:border-0" />
              </div>
              <div className="flex gap-2 items-center mt-1">
                <span className="font-medium">Due:</span>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border-b border-gray-300 outline-none bg-transparent print:border-0" />
              </div>
            </div>
          </div>
          <div className="text-right print:hidden">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
              {Object.keys(symbols).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">From</h3>
            <input value={from.name} onChange={(e) => setFrom({ ...from, name: e.target.value })} placeholder="Your Name / Business" className="w-full font-bold text-sm border-b border-gray-200 outline-none py-1 bg-transparent print:border-0" />
            <input value={from.email} onChange={(e) => setFrom({ ...from, email: e.target.value })} placeholder="email@example.com" className="w-full text-sm border-b border-gray-200 outline-none py-1 bg-transparent print:border-0" />
            <input value={from.address} onChange={(e) => setFrom({ ...from, address: e.target.value })} placeholder="Address" className="w-full text-sm border-b border-gray-200 outline-none py-1 bg-transparent print:border-0" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bill To</h3>
            <input value={to.name} onChange={(e) => setTo({ ...to, name: e.target.value })} placeholder="Client Name" className="w-full font-bold text-sm border-b border-gray-200 outline-none py-1 bg-transparent print:border-0" />
            <input value={to.email} onChange={(e) => setTo({ ...to, email: e.target.value })} placeholder="client@example.com" className="w-full text-sm border-b border-gray-200 outline-none py-1 bg-transparent print:border-0" />
            <input value={to.address} onChange={(e) => setTo({ ...to, address: e.target.value })} placeholder="Client Address" className="w-full text-sm border-b border-gray-200 outline-none py-1 bg-transparent print:border-0" />
          </div>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-gray-900 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
              <th className="py-2 w-1/2">Description</th>
              <th className="py-2 w-1/6 text-center">Qty</th>
              <th className="py-2 w-1/6 text-right">Rate</th>
              <th className="py-2 w-1/6 text-right">Amount</th>
              <th className="py-2 w-8 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-2">
                  <input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="Service description" className="w-full text-sm outline-none bg-transparent" />
                </td>
                <td className="py-2">
                  <input type="number" value={item.quantity} onChange={(e) => updateItem(i, "quantity", Number(e.target.value))} className="w-full text-sm text-center outline-none bg-transparent" min={1} />
                </td>
                <td className="py-2">
                  <input type="number" value={item.rate} onChange={(e) => updateItem(i, "rate", Number(e.target.value))} className="w-full text-sm text-right outline-none bg-transparent" min={0} step={0.01} />
                </td>
                <td className="py-2 text-sm text-right font-medium">
                  {sym}{(item.quantity * item.rate).toFixed(2)}
                </td>
                <td className="py-2 print:hidden">
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addItem} className="text-sm text-blue-600 hover:text-blue-800 mb-6 print:hidden">
          + Add Line Item
        </button>

        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{sym}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Tax
                <input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="w-12 text-center border-b border-gray-300 outline-none mx-1 bg-transparent print:border-0" min={0} max={100} />%
              </span>
              <span className="font-medium">{sym}{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-900 pt-2 text-lg font-bold">
              <span>Total</span>
              <span>{sym}{total.toFixed(2)} {currency}</span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Notes</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{notes}</p>
          </div>
        )}
      </div>

      <div className="print:hidden space-y-3">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, bank details, SOL wallet address..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-20 resize-none text-sm" />
        <div className="flex gap-3">
          <button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold">
            Print / Save PDF
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Tip: Use Print → Save as PDF for a professional PDF invoice. All data stays in your browser.
        </p>
      </div>
    </div>
  );
}
