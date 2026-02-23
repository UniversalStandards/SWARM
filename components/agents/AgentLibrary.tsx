'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Plus, Search } from 'lucide-react';
import { AGENT_TEMPLATES } from '@/lib/agents/templates';
import type { Agent } from '@/types';

interface AgentLibraryProps {
  onSelectAgent?: (template: typeof AGENT_TEMPLATES[0]) => void;
}

export function AgentLibrary({ onSelectAgent }: AgentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredTemplates = AGENT_TEMPLATES.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || template.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const agentTypes = Array.from(new Set(AGENT_TEMPLATES.map(t => t.type)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Agent Library</h2>
        <p className="text-gray-400">Browse and use pre-configured AI agent templates</p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterType === null ? 'default' : 'outline'}
            onClick={() => setFilterType(null)}
            size="sm"
          >
            All
          </Button>
          {agentTypes.map(type => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              onClick={() => setFilterType(type)}
              size="sm"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card
            key={template.name}
            className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Bot className="w-8 h-8 text-cyan-400" />
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
              <div className="space-y-2 text-sm text-gray-400 mb-4">
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
              
              <Button
                className="w-full"
                size="sm"
                onClick={() => onSelectAgent?.(template)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No agents found matching your search.
        </div>
      )}
    </div>
  );
}
