import { logger } from '../logger';

export interface Task {
  id: string;
  type: string;
  payload: any;
  priority: number;
  createdAt: number;
  attempts: number;
  maxAttempts: number;
}

export type TaskHandler = (task: Task) => Promise<void>;

export class TaskQueue {
  private queue: Task[] = [];
  private handlers: Map<string, TaskHandler> = new Map();
  private processing = false;
  private maxConcurrency: number;
  private activeCount = 0;

  constructor(maxConcurrency: number = 5) {
    this.maxConcurrency = maxConcurrency;
  }

  registerHandler(type: string, handler: TaskHandler): void {
    this.handlers.set(type, handler);
    logger.info(`Registered handler for task type: ${type}`);
  }

  async enqueue(task: Omit<Task, 'createdAt' | 'attempts'>): Promise<void> {
    const fullTask: Task = {
      ...task,
      createdAt: Date.now(),
      attempts: 0,
    };

    this.queue.push(fullTask);
    this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first

    logger.info(`Task enqueued: ${task.id}`, {
      type: task.type,
      priority: task.priority,
      queueSize: this.queue.length,
    });

    if (!this.processing) {
      this.startProcessing();
    }
  }

  private async startProcessing(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    logger.info('Starting queue processing');

    while (this.queue.length > 0 || this.activeCount > 0) {
      while (this.activeCount < this.maxConcurrency && this.queue.length > 0) {
        const task = this.queue.shift()!;
        this.processTask(task);
      }

      // Wait a bit before checking again
      await this.sleep(100);
    }

    this.processing = false;
    logger.info('Queue processing stopped');
  }

  private async processTask(task: Task): Promise<void> {
    this.activeCount++;

    try {
      const handler = this.handlers.get(task.type);
      if (!handler) {
        throw new Error(`No handler registered for task type: ${task.type}`);
      }

      logger.info(`Processing task: ${task.id}`, {
        type: task.type,
        attempt: task.attempts + 1,
        maxAttempts: task.maxAttempts,
      });

      await handler(task);

      logger.info(`Task completed: ${task.id}`);
    } catch (error) {
      logger.error(`Task failed: ${task.id}`, error as Error);

      task.attempts++;
      if (task.attempts < task.maxAttempts) {
        logger.info(`Retrying task: ${task.id}`, {
          attempt: task.attempts,
          maxAttempts: task.maxAttempts,
        });
        
        // Re-enqueue with lower priority
        this.queue.push({ ...task, priority: task.priority - 1 });
        this.queue.sort((a, b) => b.priority - a.priority);
      } else {
        logger.error(`Task failed permanently: ${task.id}`, error as Error);
      }
    } finally {
      this.activeCount--;
    }
  }

  getStatus() {
    return {
      queueSize: this.queue.length,
      activeCount: this.activeCount,
      processing: this.processing,
    };
  }

  clear(): void {
    this.queue = [];
    logger.info('Queue cleared');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const globalTaskQueue = new TaskQueue();
