// Type definitions for AI Swarm Orchestrator

// AI Provider related types
export type AIProvider = "OpenAI" | "Anthropic" | "Cohere" | "Custom";

export type ModelCapability = "text-generation" | "code-generation" | "chat" | "embedding" | "fine-tuning";

export interface AIModel {
  id: string;
  provider: AIProvider;
  name: string;
  capabilities: ModelCapability[];
  maxTokens: number;
  description?: string;
}

// Agent related interfaces and types
export type AgentType = "worker" | "manager" | "orchestrator" | "custom";

export interface AgentConfig {
  maxConcurrentTasks: number;
  retryLimit: number;
  timeoutSeconds: number;
  customSettings?: Record<string, any>;
}

export type AgentStatus = "idle" | "busy" | "offline" | "error";

export interface AgentMetrics {
  cpuUsagePercent: number;
  memoryUsageMB: number;
  taskCount: number;
  uptimeSeconds: number;
  lastHeartbeat: Date;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  config: AgentConfig;
  status: AgentStatus;
  metrics: AgentMetrics;
  createdAt: Date;
  updatedAt: Date;
}

// Workflow related types and interfaces
export type WorkflowStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface WorkflowNode {
  id: string;
  type: string;
  config: Record<string, any>;
  inputs: string[]; // IDs of input nodes
  outputs: string[]; // IDs of output nodes
}

export interface WorkflowEdge {
  from: string; // Node ID
  to: string;   // Node ID
  condition?: string; // Optional condition expression
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Task related interfaces and types
export type TaskPriority = "low" | "medium" | "high" | "critical";

export type TaskStatus = "queued" | "in-progress" | "completed" | "failed" | "cancelled";

export interface TaskContext {
  workflowId: string;
  nodeId: string;
  agentId?: string;
  metadata?: Record<string, any>;
}

export interface TaskResult {
  success: boolean;
  output?: any;
  error?: string;
  durationMs?: number;
}

export interface Task {
  id: string;
  type: string;
  priority: TaskPriority;
  status: TaskStatus;
  context: TaskContext;
  result?: TaskResult;
  createdAt: Date;
  updatedAt: Date;
}

// Artifact and repository related types
export interface Artifact {
  id: string;
  name: string;
  type: string;
  uri: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface RepositoryInfo {
  id: string;
  name: string;
  url: string;
  branch: string;
  lastCommitHash: string;
  lastCommitDate: Date;
}

export interface FileTree {
  path: string;
  type: "file" | "directory";
  children?: FileTree[];
}

// User authentication types
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
  userId: string;
}

// Setup step types
export interface SetupStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  order: number;
}

// AI Assistant message and action types
export interface AIAssistantMessage {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AssistantAction {
  id: string;
  type: string;
  payload: Record<string, any>;
  executedAt?: Date;
}

// Execution event types
export type ExecutionEventType = "task-started" | "task-completed" | "task-failed" | "workflow-started" | "workflow-completed" | "agent-registered" | "agent-deregistered";

export interface ExecutionEvent {
  id: string;
  type: ExecutionEventType;
  timestamp: Date;
  details: Record<string, any>;
}

// Workflow template types
export type TemplateCategory = "automation" | "data-processing" | "integration" | "custom";

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description?: string;
  workflow: Workflow;
  createdAt: Date;
  updatedAt: Date;
}

// Workflow analytics and agent metrics
export interface WorkflowAnalytics {
  workflowId: string;
  runCount: number;
  averageDurationMs: number;
  successRate: number; // 0 to 1
  failureRate: number; // 0 to 1
}

// App error and API response types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
}
