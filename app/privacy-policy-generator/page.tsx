"use client";
import { useState } from "react";

export default function PrivacyPolicyGenerator() {
  const [config, setConfig] = useState({
    siteName: "",
    siteUrl: "",
    email: "",
    collectsEmail: true,
    collectsName: true,
    collectsUsage: true,
    usesCookies: true,
    usesAnalytics: true,
    usesAds: true,
    thirdPartySharing: false,
    childrenData: false,
    gdpr: true,
    ccpa: true,
    lastUpdated: new Date().toISOString().split("T")[0],
  });
  const [copied, setCopied] = useState(false);

  const generate = (): string => {
    const name = config.siteName || "[Your Site Name]";
    const url = config.siteUrl || "[Your URL]";
    const email = config.email || "[your@email.com]";

    let policy = `# Privacy Policy for ${name}\n\n`;
    policy += `**Last Updated:** ${config.lastUpdated}\n\n`;
    policy += `## Introduction\n\n`;
    policy += `${name} ("we", "us", or "our") operates ${url}. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service.\n\n`;

    policy += `## Information We Collect\n\n`;
    const collected: string[] = [];
    if (config.collectsEmail) collected.push("Email address");
    if (config.collectsName) collected.push("Name");
    if (config.collectsUsage) collected.push("Usage data (pages visited, time spent, browser type)");
    if (config.usesCookies) collected.push("Cookies and similar tracking technologies");
    if (collected.length > 0) {
      policy += `We may collect the following types of information:\n\n`;
      collected.forEach((c) => (policy += `- ${c}\n`));
      policy += `\n`;
    } else {
      policy += `We do not collect any personal information.\n\n`;
    }

    if (config.usesCookies) {
      policy += `## Cookies\n\n`;
      policy += `We use cookies and similar tracking technologies to track activity on our service. Cookies are files with a small amount of data. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.\n\n`;
    }

    if (config.usesAnalytics) {
      policy += `## Analytics\n\n`;
      policy += `We may use third-party service providers to monitor and analyze the use of our service (such as Google Analytics). These third parties may use cookies to help us analyze how users use the site.\n\n`;
    }

    if (config.usesAds) {
      policy += `## Advertising\n\n`;
      policy += `We may use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to provide relevant advertisements.\n\n`;
    }

    policy += `## How We Use Your Information\n\n`;
    policy += `We use collected information to:\n\n`;
    policy += `- Provide and maintain our service\n`;
    policy += `- Notify you about changes to our service\n`;
    policy += `- Provide customer support\n`;
    policy += `- Monitor usage of the service\n`;
    policy += `- Detect and prevent technical issues\n\n`;

    if (config.thirdPartySharing) {
      policy += `## Third-Party Sharing\n\n`;
      policy += `We may share your personal information with third-party service providers to facilitate our service, perform service-related services, or assist us in analyzing how our service is used.\n\n`;
    } else {
      policy += `## Third-Party Sharing\n\n`;
      policy += `We do not sell, trade, or rent your personal information to third parties.\n\n`;
    }

    if (config.gdpr) {
      policy += `## GDPR Rights (EU Users)\n\n`;
      policy += `If you are a resident of the European Economic Area (EEA), you have certain data protection rights:\n\n`;
      policy += `- The right to access your personal data\n`;
      policy += `- The right to rectification\n`;
      policy += `- The right to erasure\n`;
      policy += `- The right to restrict processing\n`;
      policy += `- The right to data portability\n`;
      policy += `- The right to object\n\n`;
      policy += `To exercise these rights, please contact us at ${email}.\n\n`;
    }

    if (config.ccpa) {
      policy += `## CCPA Rights (California Users)\n\n`;
      policy += `California residents have the right to:\n\n`;
      policy += `- Know what personal data is collected\n`;
      policy += `- Know whether personal data is sold or disclosed\n`;
      policy += `- Say no to the sale of personal data\n`;
      policy += `- Access their personal data\n`;
      policy += `- Equal service and price, even if they exercise their privacy rights\n\n`;
    }

    if (config.childrenData) {
      policy += `## Children's Privacy\n\n`;
      policy += `Our service does not address anyone under the age of 13. We do not knowingly collect personal information from children under 13.\n\n`;
    }

    policy += `## Changes to This Policy\n\n`;
    policy += `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.\n\n`;

    policy += `## Contact Us\n\n`;
    policy += `If you have any questions about this Privacy Policy, please contact us at ${email}.\n`;

    return policy;
  };

  const output = generate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Privacy Policy Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate a privacy policy for your website or app. GDPR and CCPA compliant. Customize and download. Free privacy policy generator.
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
            <h3 className="font-bold text-sm">Data Collection</h3>
            {[
              { key: "collectsEmail", label: "Collects email addresses" },
              { key: "collectsName", label: "Collects names" },
              { key: "collectsUsage", label: "Collects usage data" },
              { key: "usesCookies", label: "Uses cookies" },
              { key: "usesAnalytics", label: "Uses analytics (GA, etc.)" },
              { key: "usesAds", label: "Shows advertisements" },
              { key: "thirdPartySharing", label: "Shares data with third parties" },
              { key: "childrenData", label: "May be used by children" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={(config as any)[key]} onChange={() => setConfig({ ...config, [key]: !(config as any)[key] })} className="accent-purple-500" />
                {label}
              </label>
            ))}
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-sm">Compliance</h3>
            {[
              { key: "gdpr", label: "GDPR (EU users)" },
              { key: "ccpa", label: "CCPA (California users)" },
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
            <label className="text-sm font-medium">Generated Policy</label>
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-4 text-xs text-white overflow-auto max-h-[600px] whitespace-pre-wrap">{output}</pre>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        This generator creates a basic privacy policy template. For legal compliance, consult a qualified attorney.
      </p>
    </div>
  );
}
