import type { Workflow, Agent } from '@/types';
import { WorkflowExecutionEngine } from './engine';
import { logger } from '../logger';

export interface OrchestrationConfig {
  parallelism: number;
  timeout: number;
  retryAttempts: number;
  errorHandling: 'continue' | 'stop';
}

const DEFAULT_CONFIG: OrchestrationConfig = {
  parallelism: 5,
  timeout: 300000, // 5 minutes
  retryAttempts: 3,
  errorHandling: 'continue',
};

export class WorkflowOrchestrator {
  private activeExecutions: Map<string, WorkflowExecutionEngine> = new Map();
  private config: OrchestrationConfig;

  constructor(config: Partial<OrchestrationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async startWorkflow(
    workflow: Workflow,
    agents: Agent[],
    context?: Record<string, any>
  ): Promise<string> {
    try {
      logger.info(`Starting workflow: ${workflow.name}`, {
        workflowId: workflow.id,
        agentCount: agents.length,
      });

      const engine = new WorkflowExecutionEngine(workflow, agents);
      const executionId = `exec-${workflow.id}-${Date.now()}`;

      this.activeExecutions.set(executionId, engine);

      // Start execution in background
      this.executeWorkflow(executionId, engine, context).catch((error) => {
        logger.error('Workflow execution failed', error, {
          executionId,
          workflowId: workflow.id,
        });
      });

      return executionId;
    } catch (error) {
      logger.error('Failed to start workflow', error as Error, {
        workflowId: workflow.id,
      });
      throw error;
    }
  }

  private async executeWorkflow(
    executionId: string,
    engine: WorkflowExecutionEngine,
    context?: Record<string, any>
  ): Promise<void> {
    try {
      // Set timeout
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Workflow execution timeout')), this.config.timeout)
      );

      // Execute with timeout
      await Promise.race([engine.execute(), timeoutPromise]);

      logger.info('Workflow completed successfully', {
        executionId,
      });
    } catch (error) {
      logger.error('Workflow execution error', error as Error, {
        executionId,
      });

      if (this.config.errorHandling === 'stop') {
        throw error;
      }
    } finally {
      // Cleanup after some time
      setTimeout(() => {
        this.activeExecutions.delete(executionId);
      }, 60000); // Keep for 1 minute after completion
    }
  }

  async stopWorkflow(executionId: string): Promise<void> {
    const engine = this.activeExecutions.get(executionId);
    if (engine) {
      logger.info('Stopping workflow', { executionId });
      this.activeExecutions.delete(executionId);
    }
  }

  async pauseWorkflow(executionId: string): Promise<void> {
    logger.info('Pausing workflow', { executionId });
    // TODO: Implement pause functionality
  }

  async resumeWorkflow(executionId: string): Promise<void> {
    logger.info('Resuming workflow', { executionId });
    // TODO: Implement resume functionality
  }

  getExecutionStatus(executionId: string) {
    const engine = this.activeExecutions.get(executionId);
    if (!engine) {
      return null;
    }

    const results = engine.getResults();
    const total = results.size;
    const completed = Array.from(results.values()).filter(r => r.success).length;
    const failed = Array.from(results.values()).filter(r => !r.success).length;

    return {
      executionId,
      status: failed > 0 ? 'error' : completed === total ? 'completed' : 'running',
      progress: total > 0 ? (completed / total) * 100 : 0,
      results: Array.from(results.entries()).map(([nodeId, result]) => ({
        nodeId,
        ...result,
      })),
    };
  }

  listActiveExecutions(): string[] {
    return Array.from(this.activeExecutions.keys());
  }
}

export const globalOrchestrator = new WorkflowOrchestrator();
