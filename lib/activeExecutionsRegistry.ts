interface ExecutionInfo {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  workflowId: string;
  logs: string[];
  progress: number;
  metadata?: Record<string, any>;
}

class ActiveExecutionsRegistry {
  private executions: Map<string, ExecutionInfo> = new Map();

  register(execution: ExecutionInfo): void {
    this.executions.set(execution.id, execution);
  }

  get(executionId: string): ExecutionInfo | undefined {
    return this.executions.get(executionId);
  }

  update(executionId: string, updates: Partial<ExecutionInfo>): void {
    const existing = this.executions.get(executionId);
    if (existing) {
      this.executions.set(executionId, { ...existing, ...updates });
    }
  }

  addLog(executionId: string, logMessage: string): void {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.logs.push(`[${new Date().toISOString()}] ${logMessage}`);
      this.executions.set(executionId, execution);
    }
  }

  updateStatus(executionId: string, status: ExecutionInfo['status']): void {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = status;
      if (status === 'completed' || status === 'failed' || status === 'cancelled') {
        execution.endTime = new Date();
      }
      this.executions.set(executionId, execution);
    }
  }

  updateProgress(executionId: string, progress: number): void {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.progress = Math.min(100, Math.max(0, progress));
      this.executions.set(executionId, execution);
    }
  }

  remove(executionId: string): void {
    this.executions.delete(executionId);
  }

  getAll(): ExecutionInfo[] {
    return Array.from(this.executions.values());
  }

  getActive(): ExecutionInfo[] {
    return Array.from(this.executions.values()).filter(
      (exec) => exec.status === 'running' || exec.status === 'pending'
    );
  }

  clear(): void {
    this.executions.clear();
  }

  // Clean up old completed executions (older than specified hours)
  cleanup(olderThanHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    for (const [id, exec] of this.executions.entries()) {
      if (
        exec.endTime &&
        exec.endTime < cutoffTime &&
        (exec.status === 'completed' || exec.status === 'failed' || exec.status === 'cancelled')
      ) {
        this.executions.delete(id);
      }
    }
  }
}

// Singleton instance
export const activeExecutionsRegistry = new ActiveExecutionsRegistry();
export default activeExecutionsRegistry;
export type { ExecutionInfo };
