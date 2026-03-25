"use client";
import { useState } from "react";

export default function GitHubProfile() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    try {
      const [profileRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username.trim()}`),
        fetch(`https://api.github.com/users/${username.trim()}/repos?sort=stars&per_page=10`),
      ]);
      if (!profileRes.ok) throw new Error("User not found");
      const p = await profileRes.json();
      const r = await reposRes.json();
      setProfile(p);
      setRepos(Array.isArray(r) ? r : []);
    } catch (e: any) {
      setError(e.message);
      setProfile(null);
      setRepos([]);
    }
    setLoading(false);
  };

  const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);
  const languages = [...new Set(repos.map((r: any) => r.language).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">GitHub Profile Viewer</h1>
        <p className="text-[var(--text-secondary)]">
          Look up any GitHub user. See their profile, top repos, stars, forks, languages, and activity. Free GitHub profile analyzer.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} placeholder="Enter GitHub username..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white" />
        <button onClick={search} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "..." : "Search"}</button>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}

      {profile && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 flex gap-6 items-start">
            <img src={profile.avatar_url} alt={profile.login} className="w-24 h-24 rounded-full" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{profile.name || profile.login}</h2>
              <p className="text-sm text-purple-400">@{profile.login}</p>
              {profile.bio && <p className="text-sm text-[var(--text-secondary)] mt-2">{profile.bio}</p>}
              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-white"><strong>{profile.public_repos}</strong> <span className="text-gray-400">repos</span></span>
                <span className="text-white"><strong>{profile.followers}</strong> <span className="text-gray-400">followers</span></span>
                <span className="text-white"><strong>{profile.following}</strong> <span className="text-gray-400">following</span></span>
              </div>
              {profile.location && <p className="text-xs text-gray-400 mt-2">📍 {profile.location}</p>}
              {profile.company && <p className="text-xs text-gray-400">🏢 {profile.company}</p>}
              {profile.blog && <p className="text-xs text-gray-400">🔗 <a href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`} target="_blank" className="text-purple-400">{profile.blog}</a></p>}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-white">{profile.public_repos}</p>
              <p className="text-xs text-gray-400">Repos</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-yellow-400">{totalStars}</p>
              <p className="text-xs text-gray-400">Stars</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-blue-400">{totalForks}</p>
              <p className="text-xs text-gray-400">Forks</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-emerald-400">{languages.length}</p>
              <p className="text-xs text-gray-400">Languages</p>
            </div>
          </div>

          {languages.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {languages.map((lang: string) => (
                <span key={lang} className="px-2 py-1 rounded text-xs bg-[var(--bg-secondary)] border border-[var(--border)] text-white">{lang}</span>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-bold text-sm">Top Repositories</h3>
            {repos.map((repo: any) => (
              <a key={repo.id} href={repo.html_url} target="_blank" className="block bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 hover:border-purple-500/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{repo.name}</span>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🍴 {repo.forks_count}</span>
                  </div>
                </div>
                {repo.description && <p className="text-xs text-[var(--text-secondary)] mt-1">{repo.description}</p>}
                <div className="flex gap-2 mt-1">
                  {repo.language && <span className="text-xs text-purple-400">{repo.language}</span>}
                  {repo.license?.spdx_id && <span className="text-xs text-gray-500">{repo.license.spdx_id}</span>}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
