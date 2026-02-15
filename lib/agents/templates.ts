import type { Agent, AgentType } from '@/types';
import { generateId } from '../utils';

interface AgentTemplate {
  name: string;
  type: AgentType;
  description: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    name: 'Senior Developer',
    type: 'coder',
    description: 'Writes production-quality code with best practices',
    systemPrompt: `You are a senior software developer with expertise in writing clean, efficient, and maintainable code. You follow best practices, write comprehensive tests, and consider security and performance in all your implementations.`,
    model: 'gpt-4-turbo-preview',
    temperature: 0.3,
    maxTokens: 4096,
    tools: ['code_analysis', 'file_operations', 'git_operations'],
  },
  {
    name: 'QA Engineer',
    type: 'tester',
    description: 'Creates and runs comprehensive test suites',
    systemPrompt: `You are a quality assurance engineer specializing in test automation. You write unit tests, integration tests, and end-to-end tests. You identify edge cases and ensure code reliability.`,
    model: 'gpt-4-turbo-preview',
    temperature: 0.2,
    maxTokens: 2048,
    tools: ['test_runner', 'code_coverage', 'bug_detector'],
  },
  {
    name: 'Code Reviewer',
    type: 'reviewer',
    description: 'Provides detailed code reviews and suggestions',
    systemPrompt: `You are an expert code reviewer. You analyze code for bugs, security vulnerabilities, performance issues, and adherence to best practices. You provide constructive feedback and suggestions for improvement.`,
    model: 'claude-sonnet-4-20250514',
    temperature: 0.4,
    maxTokens: 3072,
    tools: ['static_analysis', 'security_scan', 'performance_profiler'],
  },
  {
    name: 'Technical Writer',
    type: 'documenter',
    description: 'Creates comprehensive documentation',
    systemPrompt: `You are a technical writer who creates clear, comprehensive documentation. You write API docs, user guides, README files, and code comments that are easy to understand.`,
    model: 'claude-sonnet-4-20250514',
    temperature: 0.6,
    maxTokens: 4096,
    tools: ['markdown_generator', 'diagram_creator'],
  },
  {
    name: 'System Architect',
    type: 'designer',
    description: 'Designs system architecture and data models',
    systemPrompt: `You are a system architect who designs scalable, maintainable software systems. You create architecture diagrams, define data models, and make technology stack decisions.`,
    model: 'gpt-4-turbo-preview',
    temperature: 0.5,
    maxTokens: 4096,
    tools: ['architecture_tools', 'database_designer'],
  },
  {
    name: 'Data Analyst',
    type: 'analyst',
    description: 'Analyzes codebases and provides insights',
    systemPrompt: `You are a data analyst specializing in codebase analysis. You identify patterns, technical debt, complexity metrics, and provide actionable insights for improvement.`,
    model: 'gemini-1.5-pro',
    temperature: 0.3,
    maxTokens: 2048,
    tools: ['code_metrics', 'complexity_analyzer', 'dependency_graph'],
  },
  {
    name: 'Workflow Coordinator',
    type: 'coordinator',
    description: 'Coordinates agent activities and manages workflows',
    systemPrompt: `You are a workflow coordinator responsible for orchestrating multiple AI agents. You delegate tasks, monitor progress, resolve conflicts, and ensure smooth collaboration.`,
    model: 'claude-sonnet-4-20250514',
    temperature: 0.4,
    maxTokens: 3072,
    tools: ['task_manager', 'agent_communicator', 'progress_tracker'],
  },
];

export function createAgentFromTemplate(template: AgentTemplate): Omit<Agent, 'id'> {
  return {
    name: template.name,
    description: template.description,
    type: template.type,
    model: template.model,
    provider: 'openai', // Default, can be changed
    systemPrompt: template.systemPrompt,
    temperature: template.temperature,
    maxTokens: template.maxTokens,
    tools: template.tools,
    status: 'idle',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getAllAgentTemplates(): AgentTemplate[] {
  return AGENT_TEMPLATES;
}

export function getAgentTemplateByType(type: AgentType): AgentTemplate | undefined {
  return AGENT_TEMPLATES.find(template => template.type === type);
}
