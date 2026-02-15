'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Play, Pause, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Workflow } from '@/types';

export default function WorkflowsPage() {
  const router = useRouter();
  const [workflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Feature Development Pipeline',
      description: 'Automated feature development with code, test, and review agents',
      repository: 'user/repo-name',
      agents: [],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [],
      edges: [],
    },
  ]);

  const statusColors = {
    draft: 'bg-gray-500',
    active: 'bg-green-500',
    paused: 'bg-yellow-500',
    completed: 'bg-blue-500',
    error: 'bg-red-500',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Workflows</h1>
          <p className="text-gray-400">Manage your AI agent orchestration workflows</p>
        </div>
        <Button
          onClick={() => router.push('/workflows/create')}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white mb-2">{workflow.name}</CardTitle>
                  <CardDescription className="text-gray-400">{workflow.description}</CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className={`${statusColors[workflow.status]} text-white`}
                >
                  {workflow.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Repository:</span>
                  <span className="font-mono text-cyan-400">{workflow.repository}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Agents:</span>
                  <span>{workflow.agents.length}</span>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workflows.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-gray-400 mb-4">No workflows created yet</p>
          <Button onClick={() => router.push('/workflows/create')}>
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Workflow
          </Button>
        </div>
      )}
    </div>
  );
}
