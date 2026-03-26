"use client";
import { useState } from "react";
export default function EmailSig() {
  const [name, setName] = useState("John Doe");
  const [title, setTitle] = useState("Software Engineer");
  const [company, setCompany] = useState("Acme Inc");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [email, setEmail] = useState("john@acme.com");
  const [website, setWebsite] = useState("acme.com");
  const [color, setColor] = useState("#3b82f6");

  const html = `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;color:#333"><tr><td style="padding-right:15px;border-right:3px solid ${color}"><strong style="font-size:16px;color:${color}">${name}</strong><br><span style="color:#666">${title}</span><br><strong>${company}</strong></td><td style="padding-left:15px">${phone ? `<div>📱 ${phone}</div>` : ""}${email ? `<div>✉️ <a href="mailto:${email}" style="color:${color}">${email}</a></div>` : ""}${website ? `<div>🌐 <a href="https://${website}" style="color:${color}">${website}</a></div>` : ""}</td></tr></table>`;

  const copy = () => navigator.clipboard.writeText(html);

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Email Signature Generator</h1><p className="text-[var(--text-secondary)]">Create professional HTML email signatures</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 grid gap-3 md:grid-cols-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Job Title" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
        <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
        <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
        <div className="flex items-center gap-2"><label className="text-sm">Color:</label><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" /></div>
      </div>
      <div className="bg-white rounded-xl p-6"><div dangerouslySetInnerHTML={{ __html: html }} /></div>
      <div className="flex justify-center"><button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Copy HTML</button></div>
    </div>
  );
}
