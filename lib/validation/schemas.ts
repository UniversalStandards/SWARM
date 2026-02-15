import { z } from 'zod';

export const workflowSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  repository: z.string().min(1, 'Repository is required'),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
});

export const agentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long'),
  type: z.enum(['coder', 'tester', 'reviewer', 'documenter', 'designer', 'analyst', 'coordinator', 'custom']),
  model: z.string().min(1, 'Model is required'),
  provider: z.enum(['openai', 'anthropic', 'google', 'custom']),
  systemPrompt: z.string().min(1, 'System prompt is required'),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(1).max(32000),
  tools: z.array(z.string()),
});

export const chatRequestSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'google', 'custom']),
  model: z.string().min(1, 'Model is required'),
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string().min(1, 'Message content is required'),
    })
  ),
  apiKey: z.string().min(1, 'API key is required'),
  options: z.object({
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(1).max(32000).optional(),
    customEndpoint: z.string().url().optional(),
  }).optional(),
});

export const repositoryCreateSchema = z.object({
  name: z.string().min(1, 'Repository name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  private: z.boolean().optional(),
});
