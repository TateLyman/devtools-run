"use client";
import { useState } from "react";

const templates: Record<string, { label: string; bios: string[] }> = {
  creator: { label: "Content Creator", bios: [
    "Creating content that actually helps people 📸\n[Your niche] tips & tricks daily\n👇 Free [resource] below",
    "[Emoji] [Your role] | [Niche]\n[Achievement or credential]\nDMs open for collabs 📩\n👇 [CTA]",
    "Helping [audience] [achieve result]\n[X]K+ [metric] 📈\nNew [content type] every [frequency]\n🔗 [link description]",
  ]},
  business: { label: "Business", bios: [
    "[Business Name] | [Tagline]\n✨ [Core value proposition]\n📍 [Location] | 🌐 Worldwide\n👇 Shop now",
    "We help [audience] [achieve result]\n⭐ [Social proof: reviews/customers]\n📦 Free shipping on orders $[X]+\n🔗 Shop: [link]",
    "[Industry] made simple.\n[X]+ happy customers\n🎁 Use code [CODE] for [X]% off\n👇 [CTA]",
  ]},
  personal: { label: "Personal", bios: [
    "[Name] | [City] 📍\n[Job/passion] by day, [hobby] by night\n[Fun fact or motto]\n✨ Living my best life",
    "[Age] | [Zodiac] [Emoji]\n[Passion 1] • [Passion 2] • [Passion 3]\n[Quote or motto]\n📸 @[photography account]",
    "Just a [descriptor] trying to [goal] 🌱\n[Hobby 1] | [Hobby 2] | [Hobby 3]\nBased in [City] 📍\n[Fun emoji combination]",
  ]},
  developer: { label: "Developer", bios: [
    "💻 [Role] @[Company]\n🔧 [Tech 1] • [Tech 2] • [Tech 3]\n🚀 Building [project/product]\n📝 Writing about [topic] on [platform]",
    "Code → Ship → Repeat 🔄\n[Language] developer | [Specialty]\nOpen source contributor 🌟\n👇 Check out my latest project",
    "I turn ☕ into code\n[X]+ repos on GitHub\nBuilding [product name]\n🔗 [portfolio link]",
  ]},
  influencer: { label: "Influencer", bios: [
    "[Niche] creator with [X]K family 💕\n📧 [email] for collabs\n🎬 New videos every [frequency]\n👇 Watch my latest",
    "[First name] | [Niche] [Emoji]\n📸 [Platform] partner\nAs seen in [Publication/Brand]\n🔗 [Link in bio tool]",
    "Your favorite [niche] bestie ✨\n[X]M+ views | [X]K+ saved posts\nDM for rates 📩\n👇 Freebies below",
  ]},
  funny: { label: "Funny", bios: [
    "Professional overthinker 🧠\nPart-time adult, full-time mess\nWill post for pizza 🍕\n📍 Somewhere I shouldn't be",
    "My hobbies include: eating & pretending to be productive\n[Age] years of existing, [X] of actually living\nDon't follow me, I'm lost too",
    "CEO of starting things and never finishing them\nCurrently recovering from [current situation]\n🎯 Life goal: more naps",
  ]},
};

export default function InstagramBio() {
  const [category, setCategory] = useState("creator");
  const [bio, setBio] = useState(templates.creator.bios[0]);
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Instagram Bio Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate the perfect Instagram bio. 6 categories: creator, business, personal, developer, influencer, funny. 18 templates. One-click copy.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {Object.entries(templates).map(([k, v]) => (
          <button key={k} onClick={() => { setCategory(k); setBio(v.bios[0]); }} className={`px-3 py-1.5 rounded text-xs ${category === k ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{v.label}</button>
        ))}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="space-y-2">
          {templates[category].bios.map((b, i) => (
            <button key={i} onClick={() => setBio(b)} className={`w-full text-left bg-[var(--bg-secondary)] border rounded-lg p-3 text-sm whitespace-pre-wrap ${bio === b ? "border-purple-500 text-white" : "border-[var(--border)] text-gray-400 hover:text-white"}`}>{b}</button>
          ))}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <label className="block text-xs text-gray-400 mb-2">Edit Your Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white h-28 resize-none text-sm" />
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${bio.length > 150 ? "text-red-400" : "text-gray-400"}`}>{bio.length}/150</span>
            <button onClick={() => { navigator.clipboard.writeText(bio); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-lg font-bold text-xs">{copied ? "Copied!" : "Copy Bio"}</button>
          </div>
        </div>

        {/* Instagram Preview */}
        <div className="bg-black rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">Y</div>
            <div className="flex-1">
              <div className="flex gap-6 text-center">
                <div><p className="font-bold text-white text-sm">142</p><p className="text-gray-400 text-[10px]">posts</p></div>
                <div><p className="font-bold text-white text-sm">12.5K</p><p className="text-gray-400 text-[10px]">followers</p></div>
                <div><p className="font-bold text-white text-sm">892</p><p className="text-gray-400 text-[10px]">following</p></div>
              </div>
            </div>
          </div>
          <p className="font-bold text-white text-sm">username</p>
          <p className="text-white text-xs whitespace-pre-wrap mt-1">{bio}</p>
        </div>
      </div>
    </div>
  );
}
