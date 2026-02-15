export type AIProvider = 'openai' | 'anthropic' | 'google' | 'custom';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt?: string;
  customEndpoint?: string;
}

export interface ChatResponse {
  content: string;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  model: string;
  finishReason: 'stop' | 'length' | 'error';
  cost?: number;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  htmlUrl: string;
  cloneUrl: string;
  createdAt: string;
  updatedAt: string;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  defaultBranch: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  model: string;
  provider: AIProvider;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
}

export type AgentType =
  | 'coder'
  | 'tester'
  | 'reviewer'
  | 'documenter'
  | 'designer'
  | 'analyst'
  | 'coordinator'
  | 'custom';

export type AgentStatus = 'idle' | 'active' | 'error' | 'paused';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  repository: string;
  agents: Agent[];
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'error';

export interface WorkflowNode {
  id: string;
  type: 'agent' | 'condition' | 'parallel' | 'loop';
  position: { x: number; y: number };
  data: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface SetupStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider: string;
}
