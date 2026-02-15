export const APP_NAME = 'SWARM';
export const APP_DESCRIPTION = 'AI Agent Swarm Orchestration Platform';

export const AI_MODELS = {
  openai: [
    { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', contextWindow: 128000 },
    { id: 'gpt-4', name: 'GPT-4', contextWindow: 8192 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', contextWindow: 16385 },
  ],
  anthropic: [
    { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4.5', contextWindow: 200000 },
    { id: 'claude-opus-4-20250514', name: 'Claude Opus 4.5', contextWindow: 200000 },
    { id: 'claude-haiku-4-20250301', name: 'Claude Haiku 4.5', contextWindow: 200000 },
  ],
  google: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', contextWindow: 2000000 },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', contextWindow: 1000000 },
  ],
};

export const AGENT_TYPES = [
  { value: 'coder', label: 'Coder', description: 'Writes production code' },
  { value: 'tester', label: 'Tester', description: 'Creates and runs tests' },
  { value: 'reviewer', label: 'Reviewer', description: 'Reviews code quality' },
  { value: 'documenter', label: 'Documenter', description: 'Writes documentation' },
  { value: 'designer', label: 'Designer', description: 'System architecture' },
  { value: 'analyst', label: 'Analyst', description: 'Analyzes codebases' },
  { value: 'coordinator', label: 'Coordinator', description: 'Orchestrates workflows' },
  { value: 'custom', label: 'Custom', description: 'User-defined agent' },
] as const;

export const WORKFLOW_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'paused', label: 'Paused', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'blue' },
  { value: 'error', label: 'Error', color: 'red' },
] as const;

export const AGENT_STATUSES = [
  { value: 'idle', label: 'Idle', color: 'gray' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'error', label: 'Error', color: 'red' },
  { value: 'paused', label: 'Paused', color: 'yellow' },
] as const;
