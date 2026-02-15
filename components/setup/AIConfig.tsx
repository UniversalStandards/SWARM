'use client';

import { useState } from 'react';
import { useSetupStore } from '@/store/setup-store';
import { Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AIProviderOption = {
  id: string;
  name: string;
  description: string;
  models: string[];
  requiresApiKey: boolean;
  free: boolean;
};

const AI_PROVIDERS: AIProviderOption[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 Turbo & GPT-3.5 models',
    models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'],
    requiresApiKey: true,
    free: false,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude Sonnet 4.5 & Opus 4.5',
    models: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-haiku-4-20250301'],
    requiresApiKey: true,
    free: false,
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini 1.5 Pro & Flash',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    requiresApiKey: true,
    free: true,
  },
  {
    id: 'custom',
    name: 'Custom Endpoint',
    description: 'Self-hosted or other OpenAI-compatible API',
    models: [],
    requiresApiKey: true,
    free: true,
  },
];

export function AIConfig() {
  const { aiProvider, setAiProvider, setAiApiKey, setCurrentStep, completeStep } = useSetupStore();
  const [selectedProvider, setSelectedProvider] = useState<string>(aiProvider || '');
  const [apiKey, setApiKey] = useState('');
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const handleContinue = () => {
    if (!selectedProvider || !apiKey) return;
    
    setAiProvider(selectedProvider);
    setAiApiKey(apiKey);
    completeStep(3);
    setCurrentStep(4);
  };

  const selectedProviderData = AI_PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <div className="glass rounded-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Configure AI Provider</h2>
        <p className="text-gray-400">Choose your AI provider and add your API key</p>
      </div>

      {/* Provider Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {AI_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            onClick={() => setSelectedProvider(provider.id)}
            className={`relative bg-slate-800/50 border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedProvider === provider.id
                ? 'border-cyan-500 bg-slate-800'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            {selectedProvider === provider.id && (
              <div className="absolute top-2 right-2">
                <Check className="w-5 h-5 text-cyan-500" />
              </div>
            )}
            <div className="mb-2">
              <h3 className="font-semibold text-white">{provider.name}</h3>
              {provider.free && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded ml-2">Free Tier</span>
              )}
            </div>
            <p className="text-sm text-gray-400">{provider.description}</p>
          </div>
        ))}
      </div>

      {/* API Key Input */}
      {selectedProvider && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="password"
              placeholder="Enter your API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your API key is stored securely and never shared
            </p>
          </div>

          {selectedProvider === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Endpoint URL
              </label>
              <input
                type="url"
                placeholder="https://your-api-endpoint.com/v1"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {selectedProviderData && selectedProviderData.models.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">Choose a model...</option>
                {selectedProviderData.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            onClick={handleContinue}
            disabled={!apiKey}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Continue to Workflow Builder
          </Button>
        </div>
      )}
    </div>
  );
}
