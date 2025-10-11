// src/lib/execution/utils.ts

// Execution utilities for the SWARM project

// WorkflowValidator: Validates workflow structures and configurations
export class WorkflowValidator {
  static validate(workflow) {
    // Basic validation example
    if (!workflow || typeof workflow !== 'object') {
      throw new Error('Invalid workflow: must be an object');
    }
    if (!Array.isArray(workflow.nodes)) {
      throw new Error('Invalid workflow: nodes must be an array');
    }
    // Additional validation rules can be added here
    return true;
  }
}

// ExecutionMetrics: Calculates metrics related to execution
export class ExecutionMetrics {
  constructor() {
    this.metrics = {
      totalNodes: 0,
      successfulNodes: 0,
      failedNodes: 0,
      totalExecutionTimeMs: 0,
    };
  }

  addNodeResult(nodeResult) {
    this.metrics.totalNodes++;
    if (nodeResult.success) {
      this.metrics.successfulNodes++;
    } else {
      this.metrics.failedNodes++;
    }
    if (nodeResult.executionTimeMs) {
      this.metrics.totalExecutionTimeMs += nodeResult.executionTimeMs;
    }
  }

  getMetrics() {
    return this.metrics;
  }
}

// LogFormatter: Formats logs for JSON and CSV export
export class LogFormatter {
  static toJSON(logs) {
    return JSON.stringify(logs, null, 2);
  }

  static toCSV(logs) {
    if (!Array.isArray(logs) || logs.length === 0) return '';
    const keys = Object.keys(logs[0]);
    const csvRows = [keys.join(',')];
    for (const log of logs) {
      const values = keys.map(k => {
        const val = log[k];
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  }
}

// NodeUtils: Dependency analysis and topological sorting
export class NodeUtils {
  static topologicalSort(nodes) {
    const sorted = [];
    const visited = new Set();
    const temp = new Set();

    const visit = (node) => {
      if (temp.has(node.id)) {
        throw new Error('Cyclic dependency detected');
      }
      if (!visited.has(node.id)) {
        temp.add(node.id);
        if (node.dependencies) {
          for (const depId of node.dependencies) {
            const depNode = nodes.find(n => n.id === depId);
            if (!depNode) {
              throw new Error(`Dependency not found: ${depId}`);
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
}

// ExecutionErrorHandler: Handles errors during execution
export class ExecutionErrorHandler {
  static handle(error) {
    // Log error or perform other error handling logic
    console.error('Execution error:', error);
    // Could add retry logic, alerting, etc.
  }
}

// PerformanceMonitor: Checkpoint-based profiling
export class PerformanceMonitor {
  constructor() {
    this.checkpoints = [];
  }

  checkpoint(label) {
    const time = performance.now();
    this.checkpoints.push({ label, time });
  }

  report() {
    const report = [];
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
}
