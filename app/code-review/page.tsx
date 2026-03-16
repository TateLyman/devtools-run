"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── Types ─── */
interface Issue {
  line: number;
  column?: number;
  severity: "error" | "warning" | "info";
  category: "bug" | "security" | "performance" | "quality";
  message: string;
  suggestion?: string;
  proOnly?: boolean;
}

interface ReviewResult {
  score: number;
  grade: string;
  issues: Issue[];
  stats: {
    totalLines: number;
    codeLines: number;
    commentLines: number;
    blankLines: number;
    functions: number;
    maxNesting: number;
    maxFunctionLength: number;
    avgFunctionLength: number;
    complexity: number;
  };
}

/* ─── Constants ─── */
const FREE_DAILY_LIMIT = 3;
const STORAGE_KEY = "code-review-usage";

/* ─── Helpers ─── */
function getUsageToday(): number {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const today = new Date().toISOString().slice(0, 10);
    return data.date === today ? data.count : 0;
  } catch {
    return 0;
  }
}

function incrementUsage(): void {
  const today = new Date().toISOString().slice(0, 10);
  const current = getUsageToday();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: today, count: current + 1 })
  );
}

function getGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "#22c55e";
    case "B": return "#84cc16";
    case "C": return "#eab308";
    case "D": return "#f97316";
    default: return "#ef4444";
  }
}

function severityIcon(s: string): string {
  switch (s) {
    case "error": return "!!!";
    case "warning": return "!!";
    default: return "i";
  }
}

function severityColor(s: string): string {
  switch (s) {
    case "error": return "var(--error)";
    case "warning": return "#f59e0b";
    default: return "var(--accent)";
  }
}

function categoryLabel(c: string): string {
  switch (c) {
    case "bug": return "Bug";
    case "security": return "Security";
    case "performance": return "Performance";
    default: return "Quality";
  }
}

function categoryColor(c: string): string {
  switch (c) {
    case "bug": return "#ef4444";
    case "security": return "#f97316";
    case "performance": return "#eab308";
    default: return "#3b82f6";
  }
}

/* ─── Analysis Engine ─── */
function analyzeCode(code: string, isPro: boolean): ReviewResult {
  const lines = code.split("\n");
  const issues: Issue[] = [];
  let score = 100;

  // ─── Stats ───
  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;
  let functions = 0;
  let maxNesting = 0;
  let maxFunctionLength = 0;
  let complexity = 0;
  const functionLengths: number[] = [];

  let currentNesting = 0;
  let inFunction = false;
  let funcStartLine = 0;
  let inMultiLineComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;

    // Track blank / comment / code lines
    if (trimmed === "") {
      blankLines++;
      continue;
    }

    if (inMultiLineComment) {
      commentLines++;
      if (trimmed.includes("*/")) inMultiLineComment = false;
      continue;
    }

    if (trimmed.startsWith("/*")) {
      commentLines++;
      if (!trimmed.includes("*/")) inMultiLineComment = true;
      continue;
    }

    if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
      commentLines++;
    } else {
      codeLines++;
    }

    // Track nesting depth
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    currentNesting += opens - closes;
    if (currentNesting > maxNesting) maxNesting = currentNesting;

    // Track functions
    if (
      /\bfunction\s+\w+/.test(trimmed) ||
      /\b(const|let|var)\s+\w+\s*=\s*(async\s*)?\(/.test(trimmed) ||
      /\b(const|let|var)\s+\w+\s*=\s*(async\s*)?\w+\s*=>/.test(trimmed) ||
      /\bdef\s+\w+/.test(trimmed) ||
      /^\s*(public|private|protected|static|async)\s+(static\s+)?\w+\s*\(/.test(line)
    ) {
      functions++;
      if (inFunction) {
        const len = lineNum - funcStartLine;
        functionLengths.push(len);
        if (len > maxFunctionLength) maxFunctionLength = len;
      }
      inFunction = true;
      funcStartLine = lineNum;
    }

    // Complexity: if/else/for/while/switch/case/catch/&&/||/ternary
    const complexityPatterns = /\b(if|else if|elif|for|while|switch|case|catch|except)\b|\?\s*[^:]+:/g;
    const matches = trimmed.match(complexityPatterns);
    if (matches) complexity += matches.length;

    // ─── Bug Detection ───

    // console.log left in
    if (/\bconsole\.(log|debug|info|warn|error|trace|dir)\s*\(/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "quality",
        message: "console statement left in code",
        suggestion: "Remove console statements before production, or use a proper logging library.",
      });
    }

    // TODO / FIXME / HACK / XXX comments
    if (/\b(TODO|FIXME|HACK|XXX|BUG)\b/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "info",
        category: "quality",
        message: `${trimmed.match(/\b(TODO|FIXME|HACK|XXX|BUG)\b/)![0]} comment found`,
        suggestion: "Address this before shipping to production.",
      });
    }

    // Empty catch blocks
    if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "error",
        category: "bug",
        message: "Empty catch block swallows errors silently",
        suggestion: "At minimum, log the error. Silent failures make debugging extremely difficult.",
      });
    }

    // == instead of === (JS/TS)
    if (/[^=!<>]={2}[^=]/.test(trimmed) && !trimmed.startsWith("//") && !trimmed.startsWith("*")) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "bug",
        message: "Loose equality (==) used instead of strict equality (===)",
        suggestion: "Use === for type-safe comparison. == performs type coercion which causes subtle bugs.",
      });
    }

    // Assignment in condition
    if (/\b(if|while)\s*\([^=]*[^!=<>]=[^=][^)]*\)/.test(trimmed) && !/===/.test(trimmed) && !/!==/.test(trimmed)) {
      if (!/==/.test(trimmed.replace(/===|!==|<=|>=/g, ""))) {
        issues.push({
          line: lineNum,
          severity: "warning",
          category: "bug",
          message: "Possible accidental assignment in condition (= instead of ==)",
          suggestion: "If intentional, wrap in extra parentheses: if ((x = getValue())). Otherwise use == or ===.",
        });
      }
    }

    // var usage
    if (/\bvar\s+\w+/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "quality",
        message: "'var' declaration found - use 'const' or 'let' instead",
        suggestion: "var has function scope and hoisting issues. Use const for values that don't change, let otherwise.",
      });
    }

    // Unreachable code after return/throw/break/continue
    if (i > 0 && /^\s*(return|throw|break|continue)\b/.test(lines[i - 1].trim())) {
      if (trimmed !== "}" && trimmed !== "" && !trimmed.startsWith("//") && !trimmed.startsWith("case") && !trimmed.startsWith("default")) {
        issues.push({
          line: lineNum,
          severity: "error",
          category: "bug",
          message: "Potentially unreachable code after return/throw/break/continue",
          suggestion: "This code will never execute. Remove it or restructure the logic.",
        });
      }
    }

    // ─── Security Detection ───

    // eval()
    if (/\beval\s*\(/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "error",
        category: "security",
        message: "eval() detected - major security vulnerability",
        suggestion: "eval() executes arbitrary code. Use JSON.parse(), Function constructor, or safer alternatives.",
      });
    }

    // innerHTML
    if (/\.innerHTML\s*=/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "error",
        category: "security",
        message: "innerHTML assignment detected - XSS vulnerability",
        suggestion: "Use textContent for text, or sanitize HTML with DOMPurify before using innerHTML.",
      });
    }

    // document.write
    if (/document\.write\s*\(/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "error",
        category: "security",
        message: "document.write() detected - security and performance risk",
        suggestion: "Use DOM manipulation methods (createElement, appendChild) instead.",
      });
    }

    // SQL injection patterns
    if (/(\+|`|\$\{).*\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|WHERE|FROM)\b/i.test(trimmed) ||
        /\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b.*(\+|`|\$\{)/i.test(trimmed)) {
      if (!/\bprepare\b/i.test(trimmed) && !/\bparameterized\b/i.test(trimmed)) {
        issues.push({
          line: lineNum,
          severity: "error",
          category: "security",
          message: "Possible SQL injection - string concatenation in SQL query",
          suggestion: "Use parameterized queries or prepared statements. Never concatenate user input into SQL.",
        });
      }
    }

    // Hardcoded secrets / API keys
    if (
      /\b(password|secret|api[_-]?key|apikey|auth[_-]?token|access[_-]?token|private[_-]?key)\s*[:=]\s*["'`][^"'`]{8,}/i.test(trimmed) &&
      !trimmed.startsWith("//") &&
      !trimmed.startsWith("*") &&
      !/process\.env/i.test(trimmed) &&
      !/os\.environ/i.test(trimmed)
    ) {
      issues.push({
        line: lineNum,
        severity: "error",
        category: "security",
        message: "Possible hardcoded secret or API key",
        suggestion: "Use environment variables. Never commit secrets to source code.",
      });
    }

    // HTTP instead of HTTPS
    if (/["'`]http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0)/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "security",
        message: "Insecure HTTP URL found",
        suggestion: "Use HTTPS for all external requests to prevent man-in-the-middle attacks.",
      });
    }

    // Disabled security (e.g., SSL verification)
    if (/rejectUnauthorized\s*:\s*false|verify\s*=\s*False|CURLOPT_SSL_VERIFYPEER.*false/i.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "error",
        category: "security",
        message: "SSL/TLS verification disabled",
        suggestion: "Never disable SSL verification in production. Fix certificate issues instead.",
      });
    }

    // ─── Performance Detection ───

    // Nested loops (detected when for/while inside another for/while at depth > 1)
    if (currentNesting >= 3 && /\b(for|while)\s*\(/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "performance",
        message: "Deeply nested loop detected (possible O(n^3) or worse)",
        suggestion: "Consider using a Map/Set for lookups, or restructure to reduce nesting.",
        proOnly: true,
      });
    }

    // Array operations in loops
    if (/\b(for|while)\b/.test(trimmed) && /\.(indexOf|includes|find|filter|some|every)\s*\(/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "performance",
        message: "Array search method used in loop - potential O(n^2)",
        suggestion: "Pre-build a Set or Map before the loop for O(1) lookups.",
        proOnly: true,
      });
    }

    // Synchronous operations in async context
    if (/\bfs\.readFileSync|fs\.writeFileSync|execSync\b/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "performance",
        message: "Synchronous I/O operation blocks the event loop",
        suggestion: "Use async versions (fs.readFile, fs.writeFile, exec) with await.",
      });
    }

    // String concatenation in loops
    if (/\b(for|while)\b/.test(trimmed) && /\+\s*=\s*["'`]/.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "info",
        category: "performance",
        message: "String concatenation in loop - consider using array.join()",
        suggestion: "Push strings to an array and join at the end for better performance.",
        proOnly: true,
      });
    }

    // ─── Quality Detection ───

    // Long lines
    if (line.length > 120) {
      issues.push({
        line: lineNum,
        severity: "info",
        category: "quality",
        message: `Line too long (${line.length} chars, max recommended: 120)`,
        suggestion: "Break long lines for readability. Most style guides recommend 80-120 characters.",
      });
    }

    // Magic numbers
    if (/(?<![a-zA-Z_$])\b(?!0\b|1\b|2\b|-1\b|100\b|1000\b|true\b|false\b|null\b|undefined\b)\d{3,}\b/.test(trimmed) &&
        !trimmed.startsWith("//") && !trimmed.startsWith("*") &&
        !/\bconst\s/.test(trimmed) && !/\b(port|PORT|timeout|TIMEOUT)\b/i.test(trimmed)) {
      issues.push({
        line: lineNum,
        severity: "info",
        category: "quality",
        message: "Magic number detected - extract to a named constant",
        suggestion: "Named constants improve readability: const MAX_RETRIES = 3 instead of bare 3.",
        proOnly: true,
      });
    }

    // Deeply nested code (4+ levels)
    if (currentNesting >= 5) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "quality",
        message: `Deep nesting detected (${currentNesting} levels)`,
        suggestion: "Extract nested logic into separate functions, use early returns, or guard clauses.",
      });
    }

    // No error handling on async operations
    if (/\bawait\s+/.test(trimmed) && !/\btry\b/.test(lines.slice(Math.max(0, i - 5), i).join(" "))) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "quality",
        message: "await without surrounding try/catch",
        suggestion: "Wrap await calls in try/catch or add .catch() to handle potential rejections.",
        proOnly: true,
      });
    }

    // Function without return type (TypeScript)
    if (/\bfunction\s+\w+\s*\([^)]*\)\s*\{/.test(trimmed) && !/:\s*\w+/.test(trimmed.replace(/\([^)]*\)/, ""))) {
      issues.push({
        line: lineNum,
        severity: "info",
        category: "quality",
        message: "Function missing explicit return type annotation",
        suggestion: "Add return type annotations for better type safety and documentation.",
        proOnly: true,
      });
    }

    // Callback hell detection
    if (/\)\s*=>\s*\{/.test(trimmed) && currentNesting >= 4) {
      issues.push({
        line: lineNum,
        severity: "warning",
        category: "quality",
        message: "Deeply nested callbacks detected (callback hell)",
        suggestion: "Refactor using async/await, Promise.all(), or break into named functions.",
        proOnly: true,
      });
    }
  }

  // Close last function
  if (inFunction) {
    const len = lines.length - funcStartLine + 1;
    functionLengths.push(len);
    if (len > maxFunctionLength) maxFunctionLength = len;
  }

  const avgFunctionLength =
    functionLengths.length > 0
      ? Math.round(functionLengths.reduce((a, b) => a + b, 0) / functionLengths.length)
      : 0;

  // ─── Structural Warnings ───

  // Long functions
  if (maxFunctionLength > 50) {
    issues.push({
      line: 0,
      severity: "warning",
      category: "quality",
      message: `Longest function is ${maxFunctionLength} lines (recommended: < 50)`,
      suggestion: "Break long functions into smaller, focused functions that do one thing well.",
    });
  }

  // High complexity
  if (complexity > 20) {
    issues.push({
      line: 0,
      severity: "warning",
      category: "quality",
      message: `High cyclomatic complexity (${complexity}). Code may be hard to test and maintain.`,
      suggestion: "Simplify conditional logic. Extract complex conditions into well-named boolean variables.",
    });
  }

  // No comments at all
  if (commentLines === 0 && codeLines > 20) {
    issues.push({
      line: 0,
      severity: "info",
      category: "quality",
      message: "No comments found in code",
      suggestion: "Add comments for complex logic, public APIs, and non-obvious decisions.",
    });
  }

  // Very low comment ratio
  if (codeLines > 50 && commentLines / codeLines < 0.05) {
    issues.push({
      line: 0,
      severity: "info",
      category: "quality",
      message: `Low comment ratio (${Math.round((commentLines / codeLines) * 100)}%)`,
      suggestion: "Consider adding more documentation, especially for public functions and complex logic.",
      proOnly: true,
    });
  }

  // ─── Score Calculation ───
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

  score -= errorCount * 8;
  score -= warningCount * 4;
  score -= infoCount * 1;

  // Nesting penalty
  if (maxNesting > 4) score -= (maxNesting - 4) * 3;
  // Complexity penalty
  if (complexity > 15) score -= Math.min(15, complexity - 15);

  score = Math.max(0, Math.min(100, score));
  const grade = getGrade(score);

  // Filter pro issues for free users
  const filteredIssues = isPro
    ? issues
    : issues.map((issue) =>
        issue.proOnly ? { ...issue, message: issue.message, suggestion: "Upgrade to Pro for detailed fix suggestions" } : issue
      );

  return {
    score,
    grade,
    issues: filteredIssues,
    stats: {
      totalLines: lines.length,
      codeLines,
      commentLines,
      blankLines,
      functions,
      maxNesting,
      maxFunctionLength,
      avgFunctionLength,
      complexity,
    },
  };
}

/* ─── Component ─── */
export default function CodeReviewPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    setUsageCount(getUsageToday());
  }, []);

  const remainingReviews = FREE_DAILY_LIMIT - usageCount;

  const runReview = useCallback(() => {
    if (!code.trim()) return;
    if (remainingReviews <= 0) {
      setShowUpgrade(true);
      return;
    }
    const analysis = analyzeCode(code, false);
    setResult(analysis);
    incrementUsage();
    setUsageCount(getUsageToday());
    setActiveFilter("all");
  }, [code, remainingReviews]);

  const filteredIssues = result
    ? activeFilter === "all"
      ? result.issues
      : result.issues.filter((i) => i.category === activeFilter)
    : [];

  const categoryCounts = result
    ? {
        bug: result.issues.filter((i) => i.category === "bug").length,
        security: result.issues.filter((i) => i.category === "security").length,
        performance: result.issues.filter((i) => i.category === "performance").length,
        quality: result.issues.filter((i) => i.category === "quality").length,
      }
    : { bug: 0, security: 0, performance: 0, quality: 0 };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Code Review Tool",
            url: "https://devtools-site-delta.vercel.app/code-review",
            description:
              "Free online code review tool. Find bugs, security issues, and get a code quality score instantly.",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Code Review Tool</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Paste your code to get instant feedback on bugs, security
          vulnerabilities, performance issues, and code quality. Runs entirely in
          your browser.
        </p>
      </div>

      {/* Usage bar */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-[var(--text-secondary)]">
          {remainingReviews > 0
            ? `${remainingReviews} free review${remainingReviews !== 1 ? "s" : ""} remaining today`
            : "Daily free limit reached"}
        </span>
        <button
          onClick={() => setShowUpgrade(true)}
          className="text-[var(--accent)] hover:underline text-sm font-medium"
        >
          Upgrade to Pro
        </button>
      </div>

      {/* Code Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Paste your code
        </label>
        <textarea
          rows={16}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste your JavaScript, TypeScript, Python, or any code here\nfunction example() {\n  var x = eval(userInput);\n  console.log(x);\n}`}
          spellCheck={false}
          className="font-mono text-sm"
        />
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={runReview}
            disabled={!code.trim() || remainingReviews <= 0}
            className="px-5 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Review Code
          </button>
          {code.trim() && (
            <span className="text-xs text-[var(--text-secondary)]">
              {code.split("\n").length} lines
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 mt-8">
          {/* Score + Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Score Card */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 text-center">
              <div
                className="text-5xl font-bold mb-1"
                style={{ color: gradeColor(result.grade) }}
              >
                {result.grade}
              </div>
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: gradeColor(result.grade) }}
              >
                {result.score}/100
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                Code Quality Score
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
              <div className="text-xs text-[var(--text-secondary)] mb-3 font-medium uppercase tracking-wider">
                Code Stats
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Lines</span>
                  <span>{result.stats.totalLines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Code</span>
                  <span>{result.stats.codeLines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Comments</span>
                  <span>{result.stats.commentLines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Functions</span>
                  <span>{result.stats.functions}</span>
                </div>
              </div>
            </div>

            {/* Complexity */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
              <div className="text-xs text-[var(--text-secondary)] mb-3 font-medium uppercase tracking-wider">
                Complexity
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Cyclomatic</span>
                  <span style={{ color: result.stats.complexity > 15 ? "#f59e0b" : "inherit" }}>
                    {result.stats.complexity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Max nesting</span>
                  <span style={{ color: result.stats.maxNesting > 4 ? "#f59e0b" : "inherit" }}>
                    {result.stats.maxNesting}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Longest fn</span>
                  <span style={{ color: result.stats.maxFunctionLength > 50 ? "#f59e0b" : "inherit" }}>
                    {result.stats.maxFunctionLength} lines
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Avg fn len</span>
                  <span>{result.stats.avgFunctionLength} lines</span>
                </div>
              </div>
            </div>

            {/* Issue Summary */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
              <div className="text-xs text-[var(--text-secondary)] mb-3 font-medium uppercase tracking-wider">
                Issues Found
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#ef4444" }}>Bugs</span>
                  <span style={{ color: categoryCounts.bug > 0 ? "#ef4444" : "inherit" }}>
                    {categoryCounts.bug}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#f97316" }}>Security</span>
                  <span style={{ color: categoryCounts.security > 0 ? "#f97316" : "inherit" }}>
                    {categoryCounts.security}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#eab308" }}>Performance</span>
                  <span style={{ color: categoryCounts.performance > 0 ? "#eab308" : "inherit" }}>
                    {categoryCounts.performance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#3b82f6" }}>Quality</span>
                  <span>{categoryCounts.quality}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "bug", "security", "performance", "quality"] as const).map((cat) => {
              const count =
                cat === "all"
                  ? result.issues.length
                  : result.issues.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    activeFilter === cat
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
                  }`}
                >
                  {cat === "all" ? "All" : categoryLabel(cat)} ({count})
                </button>
              );
            })}
          </div>

          {/* Issues List */}
          {filteredIssues.length === 0 ? (
            <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-6 text-center">
              <div className="text-lg font-semibold text-[var(--success)] mb-1">
                No issues found
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                {activeFilter === "all"
                  ? "Your code looks clean! Great job."
                  : `No ${categoryLabel(activeFilter).toLowerCase()} issues detected.`}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Severity badge */}
                    <div
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{
                        backgroundColor: severityColor(issue.severity) + "15",
                        color: severityColor(issue.severity),
                        border: `1px solid ${severityColor(issue.severity)}30`,
                      }}
                    >
                      {severityIcon(issue.severity)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {issue.line > 0 && (
                          <span className="text-xs font-mono text-[var(--text-secondary)]">
                            Line {issue.line}
                          </span>
                        )}
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: categoryColor(issue.category) + "15",
                            color: categoryColor(issue.category),
                          }}
                        >
                          {categoryLabel(issue.category)}
                        </span>
                        {issue.proOnly && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-white mb-1">
                        {issue.message}
                      </div>
                      {issue.suggestion && (
                        <div className={`text-xs leading-relaxed ${issue.proOnly ? "text-purple-400/70 italic" : "text-[var(--text-secondary)]"}`}>
                          {issue.suggestion}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowUpgrade(false)}
        >
          <div
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Upgrade to Pro
              </div>
              <div className="text-[var(--text-secondary)] text-sm">
                Unlock the full power of code review
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                "Unlimited reviews per day",
                "Deeper analysis with 30+ additional checks",
                "Performance profiling suggestions",
                "Missing error handling detection",
                "Type safety analysis",
                "Callback hell / promise chain detection",
                "Magic number & dead code detection",
                "Comment coverage analysis",
                "Priority support",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm">
                  <span className="text-[var(--success)]">+</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white">
                $9.99
                <span className="text-base font-normal text-[var(--text-secondary)]">
                  /month
                </span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                Cancel anytime. 7-day money-back guarantee.
              </div>
            </div>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium transition-all text-sm">
              Coming Soon
            </button>

            <button
              onClick={() => setShowUpgrade(false)}
              className="w-full mt-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* AD SLOT */}
      <div className="ad-slot mt-8">
        <span>Ad Space</span>
      </div>

      {/* SEO Content */}
      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Free Online Code Review Tool
        </h2>
        <p>
          This free code review tool analyzes your code instantly for bugs,
          security vulnerabilities, performance issues, and code quality
          problems. It supports JavaScript, TypeScript, Python, and other
          languages with smart pattern matching that catches real issues.
        </p>
        <h3 className="text-base font-semibold text-white mt-4">
          What does the code reviewer check?
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-white">Bugs:</strong> Empty catch blocks,
            loose equality, unreachable code, accidental assignments in
            conditions
          </li>
          <li>
            <strong className="text-white">Security:</strong> eval() usage,
            innerHTML XSS, SQL injection, hardcoded secrets, insecure HTTP,
            disabled SSL
          </li>
          <li>
            <strong className="text-white">Performance:</strong> Deeply nested
            loops, array searches in loops, synchronous I/O, string
            concatenation in loops
          </li>
          <li>
            <strong className="text-white">Code Quality:</strong> console.log
            left in, TODO comments, var usage, long lines, magic numbers, missing
            comments, high complexity
          </li>
        </ul>
        <h3 className="text-base font-semibold text-white mt-4">
          How is the quality score calculated?
        </h3>
        <p>
          Your code starts at a score of 100. Points are deducted for each issue
          found: errors cost 8 points, warnings cost 4, and informational issues
          cost 1 point. Additional penalties apply for excessive nesting depth
          and high cyclomatic complexity. The letter grade ranges from A
          (90-100) to F (below 60).
        </p>
        <p>
          All analysis runs entirely in your browser &mdash; your code is never
          sent to any server. Private, fast, and free with {FREE_DAILY_LIMIT}{" "}
          reviews per day.
        </p>
      </section>
    </>
  );
}
