"use client";
import { useState } from "react";
const RULES: Record<string, string> = {
  "Force HTTPS": "RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
  "Redirect www to non-www": "RewriteEngine On\nRewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]\nRewriteRule ^(.*)$ https://%1/$1 [R=301,L]",
  "Redirect non-www to www": "RewriteEngine On\nRewriteCond %{HTTP_HOST} !^www\\. [NC]\nRewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]",
  "Custom 404 Page": "ErrorDocument 404 /404.html",
  "Enable GZIP": "<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json\n</IfModule>",
  "Browser Caching": "<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/jpg \"access plus 1 year\"\n  ExpiresByType image/png \"access plus 1 year\"\n  ExpiresByType text/css \"access plus 1 month\"\n  ExpiresByType application/javascript \"access plus 1 month\"\n</IfModule>",
  "Block IP": "Deny from 123.456.789.0",
  "Security Headers": "Header set X-Content-Type-Options \"nosniff\"\nHeader set X-Frame-Options \"SAMEORIGIN\"\nHeader set X-XSS-Protection \"1; mode=block\"\nHeader set Referrer-Policy \"strict-origin-when-cross-origin\"",
  "Disable Directory Listing": "Options -Indexes",
  "Block Hot Linking": "RewriteEngine On\nRewriteCond %{HTTP_REFERER} !^$\nRewriteCond %{HTTP_REFERER} !^https?://(www\\.)?yourdomain\\.com [NC]\nRewriteRule \\.(jpg|jpeg|png|gif|svg)$ - [F,NC,L]",
};
export default function HtaccessGen() {
  const [selected, setSelected] = useState<string[]>(["Force HTTPS"]);
  const toggle = (r: string) => setSelected(selected.includes(r) ? selected.filter(s => s !== r) : [...selected, r]);
  const output = selected.map(r => `# ${r}\n${RULES[r]}`).join("\n\n");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">.htaccess Generator</h1><p className="text-[var(--text-secondary)]">Generate Apache .htaccess rules</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 space-y-2">
        {Object.keys(RULES).map(r => (<label key={r} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--bg-primary)] rounded px-2 py-1"><input type="checkbox" checked={selected.includes(r)} onChange={() => toggle(r)} />{r}</label>))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2"><label className="text-sm font-bold">.htaccess</label><button onClick={() => navigator.clipboard.writeText(output)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div>
        <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">{output || "Select rules above"}</pre>
      </div>
    </div>
  );
}
