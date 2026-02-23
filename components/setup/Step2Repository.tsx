'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRepositories } from '@/hooks/use-repositories';
import { useSetupStore } from '@/store/setup-store';
import { Search, GitBranch, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step2Repository({ onNext, onBack }: Step2Props) {
  const { repositories, loading } = useRepositories();
  const { selectedRepository, setRepository } = useSetupStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateNew, setShowCreateNew] = useState(false);

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (repoFullName: string) => {
    setRepository(repoFullName);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Select Repository</h2>
        <p className="text-gray-400">
          Choose a repository to connect with SWARM for workflow orchestration.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Repository List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading repositories...</div>
        ) : filteredRepos.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No repositories found. Try adjusting your search.
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <Card
              key={repo.full_name}
              className={`cursor-pointer transition-colors ${
                selectedRepository === repo.full_name
                  ? 'bg-cyan-900/30 border-cyan-600'
                  : 'bg-slate-800 border-slate-700 hover:border-cyan-600'
              }`}
              onClick={() => handleSelect(repo.full_name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-cyan-400" />
                    <CardTitle className="text-white text-lg">{repo.name}</CardTitle>
                  </div>
                  {repo.private && <Badge variant="secondary">Private</Badge>}
                </div>
                {repo.description && (
                  <CardDescription className="text-gray-400">
                    {repo.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Create New Repository */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowCreateNew(!showCreateNew)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Create New Repository
      </Button>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedRepository}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
