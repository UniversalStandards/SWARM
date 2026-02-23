import { createAIProvider } from '@/lib/ai/provider-factory';
import type { Agent } from '@/types';
import { logger } from '../logger';

export interface AIExecutionContext {
  agentId: string;
  input: string;
  previousOutputs?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface AIExecutionResult {
  output: string;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost?: number;
  duration: number;
}

export class AIExecutor {
  async execute(
    agent: Agent,
    context: AIExecutionContext
  ): Promise<AIExecutionResult> {
    const startTime = Date.now();

    try {
      logger.info(`Executing agent: ${agent.name}`, {
        agentId: agent.id,
        model: agent.model,
        provider: agent.provider,
      });

      // Create AI provider
      const provider = createAIProvider({
        provider: agent.provider,
        model: agent.model,
        apiKey: '', // TODO: Get from secure storage
        options: {
          temperature: agent.temperature,
          maxTokens: agent.maxTokens,
        },
      });

      // Prepare messages
      const messages = [
        {
          role: 'system' as const,
          content: agent.systemPrompt,
        },
        {
          role: 'user' as const,
          content: this.buildPrompt(context),
        },
      ];

      // Execute
      const response = await provider.chat(messages);

      const duration = Date.now() - startTime;

      logger.info(`Agent execution completed`, {
        agentId: agent.id,
        duration,
        tokenUsage: response.usage,
      });

      return {
        output: response.content,
        tokenUsage: response.usage,
        cost: response.cost,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Agent execution failed', error as Error, {
        agentId: agent.id,
        duration,
      });

      throw error;
    }
  }

  private buildPrompt(context: AIExecutionContext): string {
    let prompt = context.input;

    // Add previous outputs if available
    if (context.previousOutputs && Object.keys(context.previousOutputs).length > 0) {
      prompt += '\n\n### Previous Agent Outputs:\n';
      for (const [agentId, output] of Object.entries(context.previousOutputs)) {
        prompt += `\n**${agentId}:**\n${output}\n`;
      }
    }

    // Add metadata if available
    if (context.metadata && Object.keys(context.metadata).length > 0) {
      prompt += '\n\n### Additional Context:\n';
      prompt += JSON.stringify(context.metadata, null, 2);
    }

    return prompt;
  }

  async executeParallel(
    agents: Agent[],
    context: AIExecutionContext
  ): Promise<AIExecutionResult[]> {
    logger.info(`Executing ${agents.length} agents in parallel`);

    const promises = agents.map(agent =>
      this.execute(agent, { ...context, agentId: agent.id })
    );

    return Promise.all(promises);
  }

  async executeSequential(
    agents: Agent[],
    initialContext: AIExecutionContext
  ): Promise<AIExecutionResult[]> {
    logger.info(`Executing ${agents.length} agents sequentially`);

    const results: AIExecutionResult[] = [];
    let context = { ...initialContext };

    for (const agent of agents) {
      const result = await this.execute(agent, {
        ...context,
        agentId: agent.id,
      });

      results.push(result);

      // Add this result to previous outputs for next agent
      context.previousOutputs = {
        ...context.previousOutputs,
        [agent.id]: result.output,
      };
    }

    return results;
  }
}

export const aiExecutor = new AIExecutor();
