'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSetupStore } from '@/store/setup-store';
import { Repository, Loader2, Search, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Repository as RepoType } from '@/types';

export function RepositorySelect() {
  const { data: session } = useSession();
  const [repositories, setRepositories] = useState<RepoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { setSelectedRepo, setCurrentStep, completeStep } = useSetupStore();

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch('/api/github/repos');
        const data = await response.json();
        if (data.success) {
          setRepositories(data.repositories);
        }
      } catch (error) {
        console.error('Failed to fetch repositories:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchRepos();
    }
  }, [session]);

  const filteredRepos = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    repo.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectRepo = (repo: RepoType) => {
    setSelectedRepo(repo.fullName);
    completeStep(2);
    setCurrentStep(3);
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading your repositories...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Select Repository</h2>
        <p className="text-gray-400">Choose the repository you want your AI agents to work on</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Repository List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => handleSelectRepo(repo)}
            className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 rounded-lg p-4 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Repository className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-white">{repo.name}</h3>
                  {repo.private && (
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Private</span>
                  )}
                </div>
                {repo.description && (
                  <p className="text-sm text-gray-400 mb-2">{repo.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {repo.language}
                    </span>
                  )}
                  <span>★ {repo.stargazersCount}</span>
                  <span><GitBranch className="w-3 h-3 inline" /> {repo.defaultBranch}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRepos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Repository className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No repositories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
