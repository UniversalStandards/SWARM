import type { Workflow, Agent, WorkflowNode, WorkflowEdge } from '@/types';

interface ExecutionContext {
  workflowId: string;
  agents: Agent[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: Record<string, any>;
}

interface ExecutionResult {
  success: boolean;
  nodeId: string;
  agentId?: string;
  output?: any;
  error?: string;
  timestamp: string;
}

export class WorkflowExecutionEngine {
  private context: ExecutionContext;
  private results: Map<string, ExecutionResult> = new Map();
  private listeners: Set<(result: ExecutionResult) => void> = new Set();

  constructor(workflow: Workflow, agents: Agent[]) {
    this.context = {
      workflowId: workflow.id,
      agents,
      nodes: workflow.nodes as WorkflowNode[],
      edges: workflow.edges as WorkflowEdge[],
      variables: {},
    };
  }

  async execute(): Promise<void> {
    try {
      // Find start node
      const startNode = this.context.nodes.find(n => n.type === 'input');
      if (!startNode) {
        throw new Error('No start node found in workflow');
      }

      // Execute workflow from start node
      await this.executeNode(startNode.id);
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  }

  private async executeNode(nodeId: string): Promise<void> {
    const node = this.context.nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    try {
      let result: ExecutionResult;

      switch (node.type) {
        case 'agent':
          result = await this.executeAgentNode(node);
          break;
        case 'condition':
          result = await this.executeConditionNode(node);
          break;
        case 'parallel':
          result = await this.executeParallelNode(node);
          break;
        case 'loop':
          result = await this.executeLoopNode(node);
          break;
        default:
          result = {
            success: true,
            nodeId: node.id,
            timestamp: new Date().toISOString(),
          };
      }

      this.results.set(nodeId, result);
      this.notifyListeners(result);

      // Execute next nodes
      const nextNodes = this.getNextNodes(nodeId, result);
      for (const nextNodeId of nextNodes) {
        await this.executeNode(nextNodeId);
      }
    } catch (error) {
      const errorResult: ExecutionResult = {
        success: false,
        nodeId: node.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
      this.results.set(nodeId, errorResult);
      this.notifyListeners(errorResult);
      throw error;
    }
  }

  private async executeAgentNode(node: WorkflowNode): Promise<ExecutionResult> {
    // TODO: Implement actual agent execution
    // This would involve:
    // 1. Find agent by ID
    // 2. Prepare input data
    // 3. Call AI provider
    // 4. Process output
    // 5. Store results

    await this.sleep(1000); // Simulate execution time

    return {
      success: true,
      nodeId: node.id,
      agentId: node.data.agentId,
      output: { message: 'Agent executed successfully' },
      timestamp: new Date().toISOString(),
    };
  }

  private async executeConditionNode(node: WorkflowNode): Promise<ExecutionResult> {
    // TODO: Implement condition evaluation
    const conditionMet = Math.random() > 0.5; // Placeholder

    return {
      success: true,
      nodeId: node.id,
      output: { conditionMet },
      timestamp: new Date().toISOString(),
    };
  }

  private async executeParallelNode(node: WorkflowNode): Promise<ExecutionResult> {
    // TODO: Implement parallel execution
    const branches = this.getNextNodes(node.id);
    
    await Promise.all(
      branches.map(branchId => this.executeNode(branchId))
    );

    return {
      success: true,
      nodeId: node.id,
      output: { branches: branches.length },
      timestamp: new Date().toISOString(),
    };
  }

  private async executeLoopNode(node: WorkflowNode): Promise<ExecutionResult> {
    // TODO: Implement loop execution
    const iterations = node.data.iterations || 1;
    
    for (let i = 0; i < iterations; i++) {
      const nextNodes = this.getNextNodes(node.id);
      for (const nextNodeId of nextNodes) {
        await this.executeNode(nextNodeId);
      }
    }

    return {
      success: true,
      nodeId: node.id,
      output: { iterations },
      timestamp: new Date().toISOString(),
    };
  }

  private getNextNodes(nodeId: string, result?: ExecutionResult): string[] {
    const edges = this.context.edges.filter(e => e.source === nodeId);
    
    if (result?.output?.conditionMet !== undefined) {
      // For condition nodes, follow appropriate branch
      return edges
        .filter(e => e.sourceHandle === (result.output.conditionMet ? 'true' : 'false'))
        .map(e => e.target);
    }

    return edges.map(e => e.target);
  }

  onResult(callback: (result: ExecutionResult) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(result: ExecutionResult): void {
    this.listeners.forEach(listener => listener(result));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getResults(): Map<string, ExecutionResult> {
    return this.results;
  }
}
