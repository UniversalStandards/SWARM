'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSetupStore } from '@/store/setup-store';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Target } from 'lucide-react';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step4Mission({ onNext, onBack }: Step4Props) {
  const [workflowName, setWorkflowName] = useState('');
  const [description, setDescription] = useState('');
  const { setWorkflowConfig, markComplete } = useSetupStore();

  const handleComplete = () => {
    setWorkflowConfig({ name: workflowName, description });
    markComplete();
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Define Your Mission</h2>
        <p className="text-gray-400">
          Create your first workflow to get started with SWARM orchestration.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Workflow Name
          </label>
          <Input
            placeholder="e.g., Feature Development Pipeline"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <Textarea
            placeholder="Describe what this workflow will accomplish..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white min-h-32"
          />
        </div>
      </div>

      {/* Quick Templates */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Quick Start Templates
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card
            className="bg-slate-800 border-slate-700 hover:border-cyan-600 cursor-pointer transition-colors"
            onClick={() => {
              setWorkflowName('Feature Development Pipeline');
              setDescription('Automated feature development with code, test, and review agents');
            }}
          >
            <CardContent className="p-4">
              <Target className="w-6 h-6 text-cyan-400 mb-2" />
              <h3 className="font-semibold text-white mb-1">Feature Development</h3>
              <p className="text-xs text-gray-400">Code + Test + Review workflow</p>
            </CardContent>
          </Card>

          <Card
            className="bg-slate-800 border-slate-700 hover:border-cyan-600 cursor-pointer transition-colors"
            onClick={() => {
              setWorkflowName('Bug Fix Workflow');
              setDescription('Analyze, fix, test, and document bug fixes');
            }}
          >
            <CardContent className="p-4">
              <Rocket className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className="font-semibold text-white mb-1">Bug Fix Pipeline</h3>
              <p className="text-xs text-gray-400">Analyze + Fix + Test + Document</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!workflowName}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
