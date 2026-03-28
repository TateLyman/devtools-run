"use client";
import { useState, useCallback } from "react";

interface MatchResult {
  type: string;
  value: string;
  path: string;
}

function evaluateXPath(xml: string, xpath: string): { results: MatchResult[]; error: string | null } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      return { results: [], error: `XML Parse Error: ${parseError.textContent?.split("\n")[0] || "Invalid XML"}` };
    }
    const result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
    const matches: MatchResult[] = [];
    const type = result.resultType;
    if (type === XPathResult.NUMBER_TYPE) {
      matches.push({ type: "Number", value: String(result.numberValue), path: "" });
    } else if (type === XPathResult.STRING_TYPE) {
      matches.push({ type: "String", value: result.stringValue, path: "" });
    } else if (type === XPathResult.BOOLEAN_TYPE) {
      matches.push({ type: "Boolean", value: String(result.booleanValue), path: "" });
    } else {
      let node = result.iterateNext();
      while (node) {
        const nodePath = getNodePath(node);
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          const serializer = new XMLSerializer();
          matches.push({
            type: "Element",
            value: serializer.serializeToString(el),
            path: nodePath,
          });
        } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
          matches.push({
            type: "Attribute",
            value: `${(node as Attr).name}="${(node as Attr).value}"`,
            path: nodePath,
          });
        } else if (node.nodeType === Node.TEXT_NODE) {
          matches.push({
            type: "Text",
            value: node.textContent || "",
            path: nodePath,
          });
        } else if (node.nodeType === Node.COMMENT_NODE) {
          matches.push({
            type: "Comment",
            value: `<!--${node.textContent}-->`,
            path: nodePath,
          });
        } else {
          matches.push({
            type: `Node(${node.nodeType})`,
            value: node.textContent || "",
            path: nodePath,
          });
        }
        node = result.iterateNext();
      }
    }
    return { results: matches, error: null };
  } catch (e) {
    return { results: [], error: (e as Error).message };
  }
}

function getNodePath(node: Node): string {
  const parts: string[] = [];
  let current: Node | null = node;
  while (current && current.nodeType !== Node.DOCUMENT_NODE) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const el = current as Element;
      let name = el.tagName;
      const parent = el.parentNode;
      if (parent) {
        const siblings = Array.from(parent.childNodes).filter(
          (n) => n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName === name
        );
        if (siblings.length > 1) {
          const idx = siblings.indexOf(el) + 1;
          name += `[${idx}]`;
        }
      }
      parts.unshift(name);
    } else if (current.nodeType === Node.ATTRIBUTE_NODE) {
      parts.unshift(`@${(current as Attr).name}`);
    } else if (current.nodeType === Node.TEXT_NODE) {
      parts.unshift("text()");
    }
    current = current.parentNode || (current as Attr).ownerElement || null;
  }
  return "/" + parts.join("/");
}

const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>10.99</price>
  </book>
  <book category="science">
    <title lang="en">A Brief History of Time</title>
    <author>Stephen Hawking</author>
    <year>1988</year>
    <price>15.99</price>
  </book>
  <book category="fiction">
    <title lang="es">Cien anos de soledad</title>
    <author>Gabriel Garcia Marquez</author>
    <year>1967</year>
    <price>12.50</price>
  </book>
  <book category="programming">
    <title lang="en">Clean Code</title>
    <author>Robert C. Martin</author>
    <year>2008</year>
    <price>29.99</price>
  </book>
</bookstore>`;

const exampleXPaths = [
  { expr: "//book", desc: "Select all book elements" },
  { expr: "//book[@category='fiction']", desc: "Books with category 'fiction'" },
  { expr: "//book/title/text()", desc: "All book titles (text)" },
  { expr: "//book[price>12]/title", desc: "Titles of books over $12" },
  { expr: "//book[1]", desc: "First book" },
  { expr: "//book/title/@lang", desc: "All lang attributes on titles" },
  { expr: "count(//book)", desc: "Count of all books" },
  { expr: "//book[year>1980]/author/text()", desc: "Authors of books after 1980" },
];

export default function XPathTester() {
  const [xml, setXml] = useState(sampleXML);
  const [xpath, setXpath] = useState("//book/title");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const evaluate = useCallback(() => {
    if (!xml.trim() || !xpath.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    const { results: r, error: e } = evaluateXPath(xml, xpath);
    setResults(r);
    setError(e);
  }, [xml, xpath]);

  const handleXpathChange = (value: string) => {
    setXpath(value);
    if (!xml.trim() || !value.trim()) { setResults([]); setError(null); return; }
    const { results: r, error: e } = evaluateXPath(xml, value);
    setResults(r);
    setError(e);
  };

  const useExample = (expr: string) => {
    setXpath(expr);
    if (xml.trim()) {
      const { results: r, error: e } = evaluateXPath(xml, expr);
      setResults(r);
      setError(e);
    }
  };

  const copyResult = (i: number) => {
    navigator.clipboard.writeText(results[i].value);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">XPath Tester</h1>
        <p className="text-[var(--text-secondary)]">
          Test XPath expressions against XML documents in real-time. See matching nodes instantly with their paths. Supports XPath 1.0.
        </p>
      </div>

      <div>
        <label className="text-sm font-bold text-purple-400 mb-1 block">XPath Expression</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={xpath}
            onChange={(e) => handleXpathChange(e.target.value)}
            placeholder="//element[@attr='value']"
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2.5 text-white font-mono text-sm"
            spellCheck={false}
          />
          <button
            onClick={evaluate}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold text-sm whitespace-nowrap"
          >
            Evaluate
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {exampleXPaths.map((ex) => (
          <button
            key={ex.expr}
            onClick={() => useExample(ex.expr)}
            className="text-xs px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-purple-500/50 transition-colors"
            title={ex.desc}
          >
            {ex.expr}
          </button>
        ))}
      </div>

      <div>
        <label className="text-sm font-bold text-purple-400 mb-1 block">XML Document</label>
        <textarea
          value={xml}
          onChange={(e) => setXml(e.target.value)}
          placeholder="<root>&#10;  <element>...</element>&#10;</root>"
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-56 resize-none font-mono text-sm"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">{error}</div>
      )}

      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-emerald-400">
              {results.length} match{results.length !== 1 ? "es" : ""} found
            </span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-purple-600/20 text-purple-400 font-bold">{r.type}</span>
                    {r.path && <span className="text-xs text-[var(--text-secondary)] font-mono">{r.path}</span>}
                  </div>
                  <button onClick={() => copyResult(i)} className="text-xs text-[var(--text-secondary)] hover:text-white">
                    {copied === i ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="text-sm text-emerald-400 font-mono whitespace-pre-wrap break-all select-all mt-1">{r.value}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {!error && results.length === 0 && xpath.trim() && xml.trim() && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center text-[var(--text-secondary)] text-sm">
          No matches found. Try a different XPath expression.
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">XPath Quick Reference</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          <div><code className="text-purple-400">//element</code> — Select all matching elements</div>
          <div><code className="text-purple-400">/@attr</code> — Select attributes</div>
          <div><code className="text-purple-400">[@attr=&apos;val&apos;]</code> — Filter by attribute value</div>
          <div><code className="text-purple-400">[position]</code> — Select by position (1-based)</div>
          <div><code className="text-purple-400">/text()</code> — Select text content</div>
          <div><code className="text-purple-400">count()</code> — Count matching nodes</div>
          <div><code className="text-purple-400">..</code> — Parent node</div>
          <div><code className="text-purple-400">*</code> — Any element</div>
        </div>
        <p className="mt-3 text-xs">All evaluation happens locally in your browser using the DOM XPath API.</p>
      </div>
    </div>
  );
}
