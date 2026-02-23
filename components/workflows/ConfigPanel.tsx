'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Settings } from 'lucide-react';
import type { WorkflowNode } from '@/types';

interface ConfigPanelProps {
  node: WorkflowNode | null;
  onUpdate: (nodeId: string, data: any) => void;
  onClose: () => void;
}

export function ConfigPanel({ node, onUpdate, onClose }: ConfigPanelProps) {
  const [config, setConfig] = useState(node?.data || {});

  if (!node) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 text-center text-gray-400">
          Select a node to configure
        </CardContent>
      </Card>
    );
  }

  const handleSave = () => {
    onUpdate(node.id, config);
    onClose();
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Node Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={config.label || ''}
            onChange={(e) => setConfig({ ...config, label: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        {/* Agent-specific config */}
        {node.type === 'agent' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="agentType">Agent Type</Label>
              <Select
                value={config.agentType || 'coder'}
                onValueChange={(value) => setConfig({ ...config, agentType: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coder">Coder</SelectItem>
                  <SelectItem value="tester">Tester</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="documenter">Documenter</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={config.instructions || ''}
                onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                rows={4}
                placeholder="Specific instructions for this agent..."
              />
            </div>
          </>
        )}

        {/* Condition-specific config */}
        {node.type === 'condition' && (
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Textarea
              id="condition"
              value={config.condition || ''}
              onChange={(e) => setConfig({ ...config, condition: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              rows={3}
              placeholder="e.g., tests_passed && review_approved"
            />
          </div>
        )}

        {/* Loop-specific config */}
        {node.type === 'loop' && (
          <div className="space-y-2">
            <Label htmlFor="iterations">Iterations</Label>
            <Input
              id="iterations"
              type="number"
              value={config.iterations || 1}
              onChange={(e) =>
                setConfig({ ...config, iterations: parseInt(e.target.value) })
              }
              className="bg-slate-800 border-slate-700 text-white"
              min="1"
              max="100"
            />
          </div>
        )}

        {/* Parallel-specific config */}
        {node.type === 'parallel' && (
          <div className="space-y-2">
            <Label htmlFor="branches">Number of Branches</Label>
            <Input
              id="branches"
              type="number"
              value={config.branches || 2}
              onChange={(e) => setConfig({ ...config, branches: parseInt(e.target.value) })}
              className="bg-slate-800 border-slate-700 text-white"
              min="2"
              max="10"
            />
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
