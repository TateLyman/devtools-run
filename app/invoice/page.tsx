"use client";
import { useState } from "react";

export default function InvoicePage() {
  const [from, setFrom] = useState("Your Business Name");
  const [to, setTo] = useState("Client Name");
  const [items, setItems] = useState([{ desc: "Web Development Services", qty: 1, price: 500 }]);
  const [wallet, setWallet] = useState("");
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  function addItem() { setItems([...items, { desc: "", qty: 1, price: 0 }]); }

  function print() { window.print(); }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Invoice Generator</h1>
        <p className="text-gray-400 text-center mb-8">Create professional invoices. Accept payment in SOL or fiat.</p>
        <div className="bg-white text-black rounded-xl p-8 mb-6" id="invoice">
          <div className="flex justify-between mb-8">
            <div>
              <div className="text-2xl font-bold">INVOICE</div>
              <div className="text-gray-500 text-sm">#{Date.now().toString(36).toUpperCase()}</div>
              <div className="text-gray-500 text-sm">{new Date().toLocaleDateString()}</div>
            </div>
            <div className="text-right">
              <input type="text" value={from} onChange={e => setFrom(e.target.value)}
                className="font-bold text-right bg-transparent border-b border-dashed border-gray-300 outline-none" />
            </div>
          </div>
          <div className="mb-6">
            <div className="text-xs text-gray-500 uppercase mb-1">Bill To</div>
            <input type="text" value={to} onChange={e => setTo(e.target.value)}
              className="font-bold bg-transparent border-b border-dashed border-gray-300 outline-none" />
          </div>
          <table className="w-full mb-6 text-sm">
            <thead><tr className="border-b-2 border-gray-200">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2 w-16">Qty</th>
              <th className="text-right py-2 w-24">Price</th>
              <th className="text-right py-2 w-24">Total</th>
            </tr></thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2"><input type="text" value={item.desc} onChange={e => { const n=[...items]; n[i].desc=e.target.value; setItems(n); }}
                    className="w-full bg-transparent outline-none" /></td>
                  <td className="py-2 text-right"><input type="number" value={item.qty} onChange={e => { const n=[...items]; n[i].qty=parseInt(e.target.value)||0; setItems(n); }}
                    className="w-16 text-right bg-transparent outline-none" /></td>
                  <td className="py-2 text-right"><input type="number" value={item.price} onChange={e => { const n=[...items]; n[i].price=parseFloat(e.target.value)||0; setItems(n); }}
                    className="w-24 text-right bg-transparent outline-none" /></td>
                  <td className="py-2 text-right font-bold">${(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addItem} className="text-xs text-blue-600 hover:underline mb-4">+ Add item</button>
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-2xl font-extrabold">${total.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Total Due</div>
            </div>
          </div>
          {wallet && (
            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-xs text-gray-500">Pay with SOL to:</div>
              <div className="font-mono text-sm">{wallet}</div>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">SOL wallet for payment (optional)</label>
            <input type="text" value={wallet} onChange={e => setWallet(e.target.value)} placeholder="Your Solana address"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={print} className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold">Print / Save PDF</button>
            {wallet && <a href={`/sol-pay/checkout?to=${wallet}&amount=${(total/150).toFixed(4)}&label=Invoice+Payment&fee=NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr&feePct=0.02`}
              className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold text-center">Send SOL Payment Link</a>}
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/sol-pay" className="text-purple-400 hover:underline">Payment Buttons</a>{" | "}
          <a href="/bio" className="text-purple-400 hover:underline">Link in Bio</a>{" | "}
          <a href="/qr" className="text-purple-400 hover:underline">QR Code</a>{" | "}
          <a href="/md-editor" className="text-purple-400 hover:underline">Markdown</a>
        </div>
      </div>
    </div>
  );
}
