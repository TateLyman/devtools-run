import Link from "next/link";

const categories = [
  {
    name: "Data Formatters",
    tools: [
      { href: "/json", name: "JSON Formatter" },
      { href: "/sql", name: "SQL Formatter" },
      { href: "/xml-format", name: "XML Formatter" },
      { href: "/yaml-json", name: "YAML/JSON Converter" },
      { href: "/css-minify", name: "CSS Minifier" },
      { href: "/code-formatter", name: "Code Formatter" },
    ],
  },
  {
    name: "Encoders & Decoders",
    tools: [
      { href: "/base64", name: "Base64 Encoder" },
      { href: "/jwt", name: "JWT Decoder" },
      { href: "/url", name: "URL Encoder" },
      { href: "/html-encode", name: "HTML Entity Encoder" },
      { href: "/hash", name: "Hash Generator" },
      { href: "/string-escape", name: "String Escape" },
    ],
  },
  {
    name: "Testing & Debugging",
    tools: [
      { href: "/regex", name: "Regex Tester" },
      { href: "/xpath-tester", name: "XPath Tester" },
      { href: "/api-tester", name: "API Tester" },
      { href: "/code-review", name: "Code Review" },
      { href: "/diff", name: "Text Diff" },
      { href: "/cron", name: "Cron Parser" },
    ],
  },
  {
    name: "Generators",
    tools: [
      { href: "/uuid", name: "UUID Generator" },
      { href: "/password", name: "Password Generator" },
      { href: "/lorem", name: "Lorem Ipsum" },
      { href: "/api-key-generator", name: "API Key Generator" },
      { href: "/readme-generator", name: "README Generator" },
      { href: "/git-command", name: "Git Command Builder" },
    ],
  },
  {
    name: "CSS & Design",
    tools: [
      { href: "/color", name: "Color Converter" },
      { href: "/color-palette-generator", name: "Color Palette" },
      { href: "/css-grid-generator", name: "CSS Grid Builder" },
      { href: "/flexbox-generator", name: "Flexbox Playground" },
      { href: "/box-shadow", name: "Box Shadow Generator" },
      { href: "/border-radius", name: "Border Radius" },
      { href: "/css-animation-generator", name: "CSS Animations" },
      { href: "/svg-editor", name: "SVG Editor" },
      { href: "/favicon-generator", name: "Favicon Generator" },
    ],
  },
  {
    name: "Converters",
    tools: [
      { href: "/timestamp", name: "Unix Timestamp" },
      { href: "/number-base", name: "Number Base" },
      { href: "/chmod", name: "Unix Permissions" },
      { href: "/html-to-jsx", name: "HTML to JSX" },
      { href: "/css-to-scss", name: "CSS to SCSS" },
      { href: "/json-to-yaml", name: "JSON to YAML" },
    ],
  },
];

export default function DeveloperToolsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Free Developer Tools</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          100+ browser-based developer tools. Format JSON, test regex, decode JWTs, generate UUIDs, and more. No signup, no install.
        </p>
      </div>

      {categories.map((cat) => (
        <section key={cat.name}>
          <h2 className="text-xl font-bold mb-3 text-white">{cat.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cat.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 hover:border-[var(--accent)] transition-colors"
              >
                <span className="text-sm font-medium text-white">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="text-center text-sm text-[var(--text-secondary)]">
        <p>Also check: <Link href="/image-tools" className="text-[var(--accent)] hover:underline">Image Tools</Link> · <Link href="/pdf-tools" className="text-[var(--accent)] hover:underline">PDF Tools</Link> · <Link href="/calculators" className="text-[var(--accent)] hover:underline">Calculators</Link> · <Link href="/" className="text-[var(--accent)] hover:underline">All 500+ Tools</Link></p>
      </div>
    </div>
  );
}
