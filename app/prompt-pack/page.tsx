"use client";

export default function PromptPackPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            AI Prompt Engineering Pack
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            50+ battle-tested prompt templates for coding, business, and creative work
          </p>
          <a
            href="https://tatelyman.gumroad.com/l/prompt-pack"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Get It — $19
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">15 Software Dev Prompts</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Code review & architecture design</li>
              <li>Security audit & bug fixing</li>
              <li>Refactoring & testing</li>
              <li>Documentation generation</li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">15 Business Prompts</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Customer personas & landing pages</li>
              <li>Competitive analysis & business plans</li>
              <li>Email sequences & sales pitches</li>
              <li>Financial projections</li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">10 Creative Prompts</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Blog posts & newsletters</li>
              <li>Video scripts & podcast outlines</li>
              <li>Course curricula & whitepapers</li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">8 Advanced Techniques</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Chain-of-thought & few-shot learning</li>
              <li>Role prompting & constraint setting</li>
              <li>Meta-prompting & system prompts</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Every Prompt Includes</h2>
          <ul className="space-y-2 text-gray-300">
            <li>Full template with [PLACEHOLDERS] ready to fill in</li>
            <li>When to use it — specific use cases</li>
            <li>Example output — see what you&apos;ll get</li>
            <li>Pro tips for customization</li>
          </ul>
          <p className="text-gray-400 mt-4 text-sm">
            Works with ChatGPT, Claude, Gemini, and any other LLM.
          </p>
        </div>

        <div className="text-center">
          <a
            href="https://tatelyman.gumroad.com/l/prompt-pack"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Get the Prompt Pack — $19
          </a>
        </div>
      </div>
    </div>
  );
}
