import type { Workflow } from '@/types';

export interface ExecutionRecord {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  results: ExecutionStepRecord[];
  error?: string;
  metadata?: Record<string, any>;
}

export interface ExecutionStepRecord {
  nodeId: string;
  nodeName: string;
  agentId?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  input?: string;
  output?: string;
  error?: string;
}

class ExecutionHistory {
  private history: Map<string, ExecutionRecord> = new Map();
  private maxRecords = 1000;

  createRecord(workflow: Workflow): ExecutionRecord {
    const record: ExecutionRecord = {
      id: `exec-${workflow.id}-${Date.now()}`,
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: 'running',
      startedAt: new Date().toISOString(),
      results: [],
    };

    this.history.set(record.id, record);
    this.cleanup();

    return record;
  }

  updateRecord(executionId: string, updates: Partial<ExecutionRecord>): void {
    const record = this.history.get(executionId);
    if (record) {
      Object.assign(record, updates);

      if (updates.status && ['completed', 'failed', 'cancelled'].includes(updates.status)) {
        record.completedAt = new Date().toISOString();
        record.duration = new Date(record.completedAt).getTime() - new Date(record.startedAt).getTime();
      }
    }
  }

  addStepRecord(executionId: string, step: ExecutionStepRecord): void {
    const record = this.history.get(executionId);
    if (record) {
      record.results.push(step);
    }
  }

  updateStepRecord(
    executionId: string,
    nodeId: string,
    updates: Partial<ExecutionStepRecord>
  ): void {
    const record = this.history.get(executionId);
    if (record) {
      const step = record.results.find(s => s.nodeId === nodeId);
      if (step) {
        Object.assign(step, updates);

        if (updates.status && ['completed', 'failed'].includes(updates.status)) {
          step.completedAt = new Date().toISOString();
          step.duration = new Date(step.completedAt).getTime() - new Date(step.startedAt).getTime();
        }
      }
    }
  }

  getRecord(executionId: string): ExecutionRecord | undefined {
    return this.history.get(executionId);
  }

  listRecords(filter?: {
    workflowId?: string;
    status?: ExecutionRecord['status'];
    limit?: number;
  }): ExecutionRecord[] {
    let records = Array.from(this.history.values());

    if (filter?.workflowId) {
      records = records.filter(r => r.workflowId === filter.workflowId);
    }

    if (filter?.status) {
      records = records.filter(r => r.status === filter.status);
    }

    // Sort by start time (most recent first)
    records.sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    if (filter?.limit) {
      records = records.slice(0, filter.limit);
    }

    return records;
  }

  deleteRecord(executionId: string): void {
    this.history.delete(executionId);
  }

  clear(): void {
    this.history.clear();
  }

  private cleanup(): void {
    if (this.history.size > this.maxRecords) {
      const records = Array.from(this.history.entries())
        .sort((a, b) => 
          new Date(a[1].startedAt).getTime() - new Date(b[1].startedAt).getTime()
        );

      const toRemove = records.slice(0, this.history.size - this.maxRecords);
      toRemove.forEach(([id]) => this.history.delete(id));
    }
  }

  getStats() {
    const records = Array.from(this.history.values());
    return {
      total: records.length,
      running: records.filter(r => r.status === 'running').length,
      completed: records.filter(r => r.status === 'completed').length,
      failed: records.filter(r => r.status === 'failed').length,
      cancelled: records.filter(r => r.status === 'cancelled').length,
    };
  }
}

export const executionHistory = new ExecutionHistory();
