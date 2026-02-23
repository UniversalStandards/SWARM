'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSetupStore } from '@/store/setup-store';
import { AI_MODELS } from '@/lib/constants';
import { Key, Brain } from 'lucide-react';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3Agents({ onNext, onBack }: Step3Props) {
  const { aiConfig, setAIConfig } = useSetupStore();
  const [provider, setProvider] = useState(aiConfig.provider || 'openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');

  const handleContinue = () => {
    setAIConfig({
      provider,
      apiKey,
      model,
    });
    onNext();
  };

  const models = AI_MODELS[provider as keyof typeof AI_MODELS] || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Configure AI Providers</h2>
        <p className="text-gray-400">
          Select your AI provider and configure API credentials for agent orchestration.
        </p>
      </div>

      {/* Provider Selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            AI Provider
          </label>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI (GPT-4, GPT-3.5)</SelectItem>
              <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
              <SelectItem value="google">Google (Gemini)</SelectItem>
              <SelectItem value="custom">Custom Endpoint</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            API Key
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Default Model
          </label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Provider Info */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Provider Features
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-400 space-y-2">
          {provider === 'openai' && (
            <>
              <p>• GPT-4 Turbo with 128K context window</p>
              <p>• Function calling and tool use</p>
              <p>• Streaming responses</p>
            </>
          )}
          {provider === 'anthropic' && (
            <>
              <p>• Claude Opus 4.5 with 200K context window</p>
              <p>• Extended thinking and analysis</p>
              <p>• Advanced code generation</p>
            </>
          )}
          {provider === 'google' && (
            <>
              <p>• Gemini 1.5 Pro with 2M context window</p>
              <p>• Multimodal capabilities</p>
              <p>• Fast inference</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!apiKey || !model}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
