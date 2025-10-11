import { EventEmitter } from 'events';

// Interfaces
export interface Agent {
  id: string;
  executeTask(task: any, context: ExecutionContext): Promise<any>;
}

export interface WorkflowNode {
  id: string;
  type: 'agent' | 'condition' | 'parallel' | 'loop';
  agentId?: string;
  conditionFn?: (context: ExecutionContext) => boolean;
  children?: string[];
  loopCount?: number;
}

export interface WorkflowEdge {
  from: string;
  to: string;
}

export interface ExecutionContext {
  variables: Record<string, any>;
  logs: ExecutionLog[];
  cancelRequested: boolean;
}

export interface ExecutionLog {
  timestamp: number;
  nodeId: string;
  message: string;
  level: 'info' | 'error' | 'debug';
}

export class WorkflowOrchestrator extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private nodes: Map<string, WorkflowNode> = new Map();
  private edges: WorkflowEdge[] = [];
  private executionContext: ExecutionContext = { variables: {}, logs: [], cancelRequested: false };
  private taskQueue: Promise<any> = Promise.resolve();
  private runningTasks: Set<Promise<any>> = new Set();
  private stats = { executedNodes: 0, errors: 0 };

  constructor(agents: Agent[], nodes: WorkflowNode[], edges: WorkflowEdge[]) {
    super();
    agents.forEach(agent => this.agents.set(agent.id, agent));
    nodes.forEach(node => this.nodes.set(node.id, node));
    this.edges = edges;
  }

  async executeWorkflow(startNodeId: string): Promise<void> {
    this.log('info', startNodeId, 'Starting workflow execution');
    const sortedNodes = this.topologicalSort();
    if (!sortedNodes.includes(startNodeId)) {
      throw new Error(`Start node ${startNodeId} not found in workflow`);
    }
    await this.executeNode(startNodeId);
    await Promise.all(this.runningTasks);
    this.log('info', startNodeId, 'Workflow execution completed');
  }

  private topologicalSort(): string[] {
    const inDegree = new Map<string, number>();
    this.nodes.forEach((_, id) => inDegree.set(id, 0));
    this.edges.forEach(edge => {
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    });

    const queue: string[] = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    const sorted: string[] = [];
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      sorted.push(nodeId);
      this.edges.forEach(edge => {
        if (edge.from === nodeId) {
          inDegree.set(edge.to, (inDegree.get(edge.to) || 0) - 1);
          if (inDegree.get(edge.to) === 0) {
            queue.push(edge.to);
          }
        }
      });
    }

    if (sorted.length !== this.nodes.size) {
      throw new Error('Workflow graph has cycles or disconnected nodes');
    }

    return sorted;
  }

  private async executeNode(nodeId: string): Promise<void> {
    if (this.executionContext.cancelRequested) {
      this.log('info', nodeId, 'Execution cancelled');
      return;
    }

    const node = this.nodes.get(nodeId);
    if (!node) {
      this.log('error', nodeId, `Node not found: ${nodeId}`);
      this.stats.errors++;
      return;
    }

    this.log('info', nodeId, `Executing node of type ${node.type}`);
    this.stats.executedNodes++;

    try {
      switch (node.type) {
        case 'agent':
          await this.executeAgentNode(node);
          break;
        case 'condition':
          await this.executeConditionNode(node);
          break;
        case 'parallel':
          await this.executeParallelNode(node);
          break;
        case 'loop':
          await this.executeLoopNode(node);
          break;
        default:
          this.log('error', nodeId, `Unknown node type: ${node.type}`);
          this.stats.errors++;
      }
    } catch (error: any) {
      this.log('error', nodeId, `Error executing node: ${error.message}`);
      this.stats.errors++;
    }
  }

  private async executeAgentNode(node: WorkflowNode): Promise<void> {
    if (!node.agentId) {
      this.log('error', node.id, 'Agent ID missing for agent node');
      this.stats.errors++;
      return;
    }
    const agent = this.agents.get(node.agentId);
    if (!agent) {
      this.log('error', node.id, `Agent not found: ${node.agentId}`);
      this.stats.errors++;
      return;
    }

    const taskPromise = agent.executeTask({}, this.executionContext)
      .then(() => {
        this.log('info', node.id, `Agent node executed: ${node.agentId}`);
        this.enqueueNextNodes(node.id);
      })
      .catch(error => {
        this.log('error', node.id, `Agent execution error: ${error.message}`);
        this.stats.errors++;
      })
      .finally(() => {
        this.runningTasks.delete(taskPromise);
      });

    this.runningTasks.add(taskPromise);
    await taskPromise;
  }

  private async executeConditionNode(node: WorkflowNode): Promise<void> {
    if (!node.conditionFn) {
      this.log('error', node.id, 'Condition function missing for condition node');
      this.stats.errors++;
      return;
    }

    const conditionResult = node.conditionFn(this.executionContext);
    this.log('info', node.id, `Condition evaluated to ${conditionResult}`);

    if (conditionResult && node.children && node.children.length > 0) {
      await this.executeNode(node.children[0]);
    } else if (!conditionResult && node.children && node.children.length > 1) {
      await this.executeNode(node.children[1]);
    }
  }

  private async executeParallelNode(node: WorkflowNode): Promise<void> {
    if (!node.children || node.children.length === 0) {
      this.log('error', node.id, 'Parallel node has no children');
      this.stats.errors++;
      return;
    }

    const parallelTasks = node.children.map(childId => this.executeNode(childId));
    await Promise.all(parallelTasks);
    this.enqueueNextNodes(node.id);
  }

  private async executeLoopNode(node: WorkflowNode): Promise<void> {
    if (!node.children || node.children.length === 0) {
      this.log('error', node.id, 'Loop node has no children');
      this.stats.errors++;
      return;
    }

    const count = node.loopCount || 1;
    for (let i = 0; i < count; i++) {
      for (const childId of node.children) {
        await this.executeNode(childId);
      }
    }
    this.enqueueNextNodes(node.id);
  }

  private enqueueNextNodes(nodeId: string): void {
    const nextEdges = this.edges.filter(edge => edge.from === nodeId);
    nextEdges.forEach(edge => {
      this.taskQueue = this.taskQueue.then(() => this.executeNode(edge.to));
    });
  }

  private log(level: 'info' | 'error' | 'debug', nodeId: string, message: string): void {
    const logEntry: ExecutionLog = {
      timestamp: Date.now(),
      nodeId,
      message,
      level,
    };
    this.executionContext.logs.push(logEntry);
    this.emit('log', logEntry);
  }

  cancel(): void {
    this.executionContext.cancelRequested = true;
    this.log('info', 'orchestrator', 'Cancellation requested');
  }

  getStats() {
    return { ...this.stats };
  }
}
