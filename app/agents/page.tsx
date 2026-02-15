'use client';

import { useState } from 'react';
import { Bot, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AGENT_TEMPLATES } from '@/lib/agents/templates';
import type { Agent } from '@/types';

export default function AgentsPage() {
  const [agents] = useState<Agent[]>([]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Agent Library</h1>
          <p className="text-gray-400">Pre-configured AI agents ready to deploy</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
          <Plus className="w-5 h-5 mr-2" />
          Create Custom Agent
        </Button>
      </div>

      {/* Templates */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Agent Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENT_TEMPLATES.map((template) => (
            <Card key={template.name} className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Bot className="w-8 h-8 text-cyan-400 mb-3" />
                  <Badge variant="secondary" className="text-xs">
                    {template.type}
                  </Badge>
                </div>
                <CardTitle className="text-white">{template.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-mono text-cyan-400">{template.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span>{template.temperature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tools:</span>
                    <span>{template.tools.length}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Workflow
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Agents */}
      {agents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Active Agents</h2>
          <div className="space-y-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bot className="w-6 h-6 text-cyan-400" />
                      <div>
                        <CardTitle className="text-white">{agent.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {agent.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
