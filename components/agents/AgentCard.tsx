'use client';

import { Bot, Settings, Play, Pause, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Agent } from '@/types';

interface AgentCardProps {
  agent: Agent;
  onEdit?: (agent: Agent) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
}

export function AgentCard({ agent, onEdit, onDelete, onToggle }: AgentCardProps) {
  const statusColors = {
    idle: 'bg-gray-500',
    active: 'bg-green-500',
    error: 'bg-red-500',
    paused: 'bg-yellow-500',
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-cyan-400" />
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                {agent.name}
                <Badge variant="secondary" className="text-xs">
                  {agent.type}
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400">
                {agent.description}
              </CardDescription>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
            <div>
              <span className="block text-xs text-gray-500">Provider</span>
              <span className="text-cyan-400">{agent.provider}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Model</span>
              <span className="font-mono text-xs">{agent.model}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Temperature</span>
              <span>{agent.temperature}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Max Tokens</span>
              <span>{agent.maxTokens}</span>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onToggle?.(agent.id)}
            >
              {agent.status === 'active' ? (
                <><Pause className="w-4 h-4 mr-1" /> Pause</>
              ) : (
                <><Play className="w-4 h-4 mr-1" /> Start</>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(agent)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete?.(agent.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
