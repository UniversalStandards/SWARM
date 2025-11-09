// src/lib/execution/utils.ts
// Execution utilities for the SWARM project

interface WorkflowNode {
  id: string;
  dependencies?: string[];
  [key: string]: any;
}

interface NodeResult {
  success: boolean;
  executionTimeMs?: number;
}

interface Metrics {
  totalNodes: number;
  successfulNodes: number;
  failedNodes: number;
  totalExecutionTimeMs: number;
  averageExecutionTimeMs: number;
  successRate: number;
}

interface Checkpoint {
  label: string;
  time: number;
}

interface PerformanceReport {
  from: string;
  to: string;
  durationMs: number;
}

// WorkflowValidator: Validates workflow structures and configurations
export class WorkflowValidator {
  static validate(workflow: any): boolean {
    if (!workflow || typeof workflow !== 'object') {
      throw new Error('Invalid workflow: must be an object');
    }
    if (!Array.isArray(workflow.nodes)) {
      throw new Error('Invalid workflow: nodes must be an array');
    }
    if (!workflow.id || typeof workflow.id !== 'string') {
      throw new Error('Invalid workflow: must have a string id');
    }
    if (workflow.edges && !Array.isArray(workflow.edges)) {
      throw new Error('Invalid workflow: edges must be an array');
    }
    
    // Validate node structure
    for (const node of workflow.nodes) {
      if (!node.id || typeof node.id !== 'string') {
        throw new Error('Invalid node: must have a string id');
      }
      if (!node.type || typeof node.type !== 'string') {
        throw new Error(`Invalid node ${node.id}: must have a type`);
      }
    }
    
    // Validate edges reference valid nodes
    if (workflow.edges) {
      const nodeIds = new Set(workflow.nodes.map((n: any) => n.id));
      for (const edge of workflow.edges) {
        if (!nodeIds.has(edge.from)) {
          throw new Error(`Invalid edge: references non-existent node ${edge.from}`);
        }
        if (!nodeIds.has(edge.to)) {
          throw new Error(`Invalid edge: references non-existent node ${edge.to}`);
        }
      }
    }
    
    return true;
  }
}

// ExecutionMetrics: Calculates metrics related to execution
export class ExecutionMetrics {
  private metrics: Metrics;

  constructor() {
    this.metrics = {
      totalNodes: 0,
      successfulNodes: 0,
      failedNodes: 0,
      totalExecutionTimeMs: 0,
      averageExecutionTimeMs: 0,
      successRate: 0,
    };
  }

  addNodeResult(nodeResult: NodeResult): void {
    this.metrics.totalNodes++;
    if (nodeResult.success) {
      this.metrics.successfulNodes++;
    } else {
      this.metrics.failedNodes++;
    }
    if (nodeResult.executionTimeMs) {
      this.metrics.totalExecutionTimeMs += nodeResult.executionTimeMs;
    }
    
    // Update computed metrics
    if (this.metrics.totalNodes > 0) {
      this.metrics.averageExecutionTimeMs = this.metrics.totalExecutionTimeMs / this.metrics.totalNodes;
      this.metrics.successRate = this.metrics.successfulNodes / this.metrics.totalNodes;
    }
  }

  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      totalNodes: 0,
      successfulNodes: 0,
      failedNodes: 0,
      totalExecutionTimeMs: 0,
      averageExecutionTimeMs: 0,
      successRate: 0,
    };
  }
}

// LogFormatter: Formats logs for JSON and CSV export
export class LogFormatter {
  static toJSON(logs: any[]): string {
    return JSON.stringify(logs, null, 2);
  }

  static toCSV(logs: any[]): string {
    if (!Array.isArray(logs) || logs.length === 0) return '';
    const keys = Object.keys(logs[0]);
    const csvRows = [keys.join(',')];
    for (const log of logs) {
      const values = keys.map(k => {
        const val = log[k];
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val ?? '';
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  }

  static toMarkdown(logs: any[]): string {
    if (!Array.isArray(logs) || logs.length === 0) return '';
    const keys = Object.keys(logs[0]);
    const header = `| ${keys.join(' | ')} |`;
    const separator = `| ${keys.map(() => '---').join(' | ')} |`;
    const rows = logs.map(log => {
      const values = keys.map(k => String(log[k] ?? ''));
      return `| ${values.join(' | ')} |`;
    });
    return [header, separator, ...rows].join('\n');
  }
}

// NodeUtils: Dependency analysis and topological sorting
export class NodeUtils {
  static topologicalSort(nodes: WorkflowNode[]): WorkflowNode[] {
    const sorted: WorkflowNode[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    const visit = (node: WorkflowNode): void => {
      if (temp.has(node.id)) {
        throw new Error(`Cyclic dependency detected at node: ${node.id}`);
      }
      if (!visited.has(node.id)) {
        temp.add(node.id);
        if (node.dependencies && Array.isArray(node.dependencies)) {
          for (const depId of node.dependencies) {
            const depNode = nodes.find(n => n.id === depId);
            if (!depNode) {
              throw new Error(`Dependency not found: ${depId} (required by ${node.id})`);
            }
            visit(depNode);
          }
        }
        temp.delete(node.id);
        visited.add(node.id);
        sorted.push(node);
      }
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        visit(node);
      }
    }

    return sorted;
  }

  static findCircularDependencies(nodes: WorkflowNode[]): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];

    const detectCycle = (nodeId: string): boolean => {
      if (recStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        cycles.push([...path.slice(cycleStart), nodeId]);
        return true;
      }
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);
      path.push(nodeId);

      const node = nodes.find(n => n.id === nodeId);
      if (node?.dependencies) {
        for (const depId of node.dependencies) {
          if (detectCycle(depId)) {
            return true;
          }
        }
      }

      path.pop();
      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        detectCycle(node.id);
      }
    }

    return cycles;
  }
}

// ExecutionErrorHandler: Handles errors during execution
export class ExecutionErrorHandler {
  static handle(error: Error | unknown, context?: any): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Execution error:', {
      message: errorMessage,
      stack: errorStack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  static shouldRetry(error: Error | unknown, attemptCount: number, maxRetries: number = 3): boolean {
    if (attemptCount >= maxRetries) return false;
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Don't retry on validation errors
    if (errorMessage.includes('Invalid') || errorMessage.includes('Validation')) {
      return false;
    }
    
    // Retry on network errors, timeouts, rate limits
    const retryableErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'Rate limit', 'timeout'];
    return retryableErrors.some(msg => errorMessage.includes(msg));
  }
}

// PerformanceMonitor: Checkpoint-based profiling
export class PerformanceMonitor {
  private checkpoints: Checkpoint[] = [];

  checkpoint(label: string): void {
    const time = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.checkpoints.push({ label, time });
  }

  report(): PerformanceReport[] {
    const report: PerformanceReport[] = [];
    for (let i = 1; i < this.checkpoints.length; i++) {
      const prev = this.checkpoints[i - 1];
      const curr = this.checkpoints[i];
      report.push({
        from: prev.label,
        to: curr.label,
        durationMs: curr.time - prev.time,
      });
    }
    return report;
  }

  getTotalDuration(): number {
    if (this.checkpoints.length < 2) return 0;
    return this.checkpoints[this.checkpoints.length - 1].time - this.checkpoints[0].time;
  }

  reset(): void {
    this.checkpoints = [];
  }
}
