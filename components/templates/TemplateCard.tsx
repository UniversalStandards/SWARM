'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCode, Plus } from 'lucide-react';

interface TemplateCardProps {
  name: string;
  description: string;
  nodeCount: number;
  agentTypes: string[];
  onUse?: () => void;
}

export function TemplateCard({ name, description, nodeCount, agentTypes, onUse }: TemplateCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <FileCode className="w-8 h-8 text-cyan-400 mb-3" />
          <Badge variant="secondary" className="text-xs">
            {nodeCount} nodes
          </Badge>
        </div>
        <CardTitle className="text-white">{name}</CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-2">Agent Types:</p>
            <div className="flex flex-wrap gap-1">
              {agentTypes.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <Button className="w-full" size="sm" onClick={onUse}>
            <Plus className="w-4 h-4 mr-2" />
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
