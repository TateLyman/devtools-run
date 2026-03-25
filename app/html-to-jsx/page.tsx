"use client";
import { useState } from "react";

function htmlToJsx(html: string): string {
  let jsx = html;

  // Self-closing tags
  jsx = jsx.replace(/<(img|br|hr|input|meta|link|area|base|col|embed|source|track|wbr)([^>]*?)(?<!\/)>/gi, "<$1$2 />");

  // class → className
  jsx = jsx.replace(/\bclass=/g, "className=");

  // for → htmlFor
  jsx = jsx.replace(/\bfor=/g, "htmlFor=");

  // tabindex → tabIndex
  jsx = jsx.replace(/\btabindex=/g, "tabIndex=");

  // onclick → onClick, onchange → onChange, etc.
  jsx = jsx.replace(/\bon([a-z]+)=/gi, (_, event) => `on${event.charAt(0).toUpperCase() + event.slice(1)}=`);

  // style string → object
  jsx = jsx.replace(/style="([^"]*)"/g, (_, styleStr: string) => {
    const pairs = styleStr.split(";").filter(Boolean).map((pair: string) => {
      const [prop, ...valueParts] = pair.split(":");
      const value = valueParts.join(":").trim();
      const camelProp = prop.trim().replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
      const numValue = /^\d+px$/.test(value) ? parseInt(value) : `"${value}"`;
      return `${camelProp}: ${numValue}`;
    });
    return `style={{${pairs.join(", ")}}}`;
  });

  // colspan → colSpan, rowspan → rowSpan
  jsx = jsx.replace(/\bcolspan=/g, "colSpan=");
  jsx = jsx.replace(/\browspan=/g, "rowSpan=");

  // charset → charSet
  jsx = jsx.replace(/\bcharset=/g, "charSet=");

  // maxlength → maxLength
  jsx = jsx.replace(/\bmaxlength=/g, "maxLength=");

  // readonly → readOnly
  jsx = jsx.replace(/\breadonly\b/g, "readOnly");

  // autocomplete → autoComplete
  jsx = jsx.replace(/\bautocomplete=/g, "autoComplete=");

  // autofocus → autoFocus
  jsx = jsx.replace(/\bautofocus\b/g, "autoFocus");

  // crossorigin → crossOrigin
  jsx = jsx.replace(/\bcrossorigin=/g, "crossOrigin=");

  // Boolean attributes
  jsx = jsx.replace(/\bchecked(?!=)/g, "checked={true}");
  jsx = jsx.replace(/\bdisabled(?!=)/g, "disabled={true}");
  jsx = jsx.replace(/\bselected(?!=)/g, "selected={true}");

  // Remove HTML comments
  jsx = jsx.replace(/<!--[\s\S]*?-->/g, "{/* $& */}");

  return jsx;
}

export default function HtmlToJsx() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = htmlToJsx(input);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleHTML = `<div class="container" style="margin-top: 20px; padding: 10px;">
  <label for="name">Name:</label>
  <input type="text" tabindex="1" maxlength="50" autofocus readonly />
  <img src="logo.png" class="logo" onclick="handleClick()">
  <br>
  <table>
    <tr>
      <td colspan="2">Cell</td>
    </tr>
  </table>
  <!-- This is a comment -->
  <button disabled class="btn" style="background-color: blue; font-size: 14px;">Submit</button>
</div>`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">HTML to JSX Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert HTML to valid JSX/React code. Handles className, style objects, self-closing tags, event handlers, and more.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">HTML Input</label>
            <button onClick={() => setInput(sampleHTML)} className="text-xs text-purple-400 hover:text-purple-300">Load Example</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML here..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">JSX Output</label>
            <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[400px] resize-none font-mono text-sm"
          />
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">Conversions Applied</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <span><code>class</code> → <code>className</code></span>
          <span><code>for</code> → <code>htmlFor</code></span>
          <span><code>onclick</code> → <code>onClick</code></span>
          <span><code>style=""</code> → <code>style={"{{}}"}</code></span>
          <span><code>tabindex</code> → <code>tabIndex</code></span>
          <span><code>maxlength</code> → <code>maxLength</code></span>
          <span><code>colspan</code> → <code>colSpan</code></span>
          <span><code>readonly</code> → <code>readOnly</code></span>
          <span>Self-closing <code>&lt;img&gt;</code></span>
          <span>Boolean attributes</span>
          <span>HTML comments → JSX</span>
          <span>CSS units to numbers</span>
        </div>
      </div>
    </div>
  );
}
