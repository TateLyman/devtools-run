"use client";
import { useState } from "react";

export default function TermsGenerator() {
  const [config, setConfig] = useState({
    siteName: "", siteUrl: "", email: "",
    isApp: false, hasAccounts: true, hasPayments: false,
    hasUserContent: true, lastUpdated: new Date().toISOString().split("T")[0],
  });
  const [copied, setCopied] = useState(false);

  const name = config.siteName || "[Your Site]";
  const url = config.siteUrl || "[Your URL]";
  const email = config.email || "[your@email.com]";

  const terms = `# Terms of Service for ${name}

**Last Updated:** ${config.lastUpdated}

## 1. Acceptance of Terms

By accessing or using ${name} (${url}), you agree to be bound by these Terms of Service. If you do not agree, do not use the service.

## 2. Description of Service

${name} provides ${config.isApp ? "a software application" : "an online platform"} and related services. We reserve the right to modify, suspend, or discontinue any part of the service at any time.

## 3. Use of Service

You agree to use the service only for lawful purposes. You must not:

- Violate any applicable laws or regulations
- Infringe on the rights of others
- Transmit harmful code, viruses, or malware
- Attempt to gain unauthorized access to our systems
- Use the service to send spam or unsolicited messages
- Interfere with or disrupt the service

${config.hasAccounts ? `## 4. User Accounts

You may need to create an account to access certain features. You are responsible for:

- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Notifying us immediately of any unauthorized access

We reserve the right to suspend or terminate accounts that violate these terms.
` : ""}
${config.hasUserContent ? `## ${config.hasAccounts ? "5" : "4"}. User Content

You retain ownership of content you submit to ${name}. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content as part of the service.

You are solely responsible for your content and must not submit content that is illegal, offensive, or infringes on others' rights.
` : ""}
${config.hasPayments ? `## ${config.hasAccounts ? (config.hasUserContent ? "6" : "5") : "4"}. Payments and Refunds

Certain features may require payment. All payments are processed through third-party payment providers. Prices are subject to change with notice.

Refund requests will be handled on a case-by-case basis. Contact ${email} for refund inquiries.
` : ""}
## Intellectual Property

All content, features, and functionality of ${name} (excluding user content) are owned by us and protected by intellectual property laws.

## Limitation of Liability

${name} is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the service.

## Indemnification

You agree to indemnify and hold harmless ${name} and its operators from any claims, damages, or expenses arising from your use of the service or violation of these terms.

## Governing Law

These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.

## Changes to Terms

We reserve the right to update these terms at any time. Changes will be posted on this page with an updated date. Continued use of the service constitutes acceptance of the new terms.

## Contact

For questions about these Terms of Service, contact us at ${email}.`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Terms of Service Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate terms of service for your website or app. Customize sections for accounts, payments, user content. Free ToS generator.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <input value={config.siteName} onChange={(e) => setConfig({ ...config, siteName: e.target.value })} placeholder="Website/App Name" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            <input value={config.siteUrl} onChange={(e) => setConfig({ ...config, siteUrl: e.target.value })} placeholder="https://yoursite.com" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm font-mono" />
            <input value={config.email} onChange={(e) => setConfig({ ...config, email: e.target.value })} placeholder="Contact email" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            {[
              { key: "isApp", label: "This is a mobile/desktop app" },
              { key: "hasAccounts", label: "Users create accounts" },
              { key: "hasPayments", label: "Has paid features" },
              { key: "hasUserContent", label: "Users submit content" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={(config as any)[key]} onChange={() => setConfig({ ...config, [key]: !(config as any)[key] })} className="accent-purple-500" />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Terms of Service</label>
            <button onClick={() => { navigator.clipboard.writeText(terms); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-4 text-xs text-white overflow-auto max-h-[600px] whitespace-pre-wrap">{terms}</pre>
        </div>
      </div>
    </div>
  );
}
