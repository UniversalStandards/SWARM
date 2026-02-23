import type { WorkflowNode, WorkflowEdge } from '@/types';

export function validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for start node
  const hasStartNode = nodes.some(node => node.type === 'input');
  if (!hasStartNode) {
    errors.push('Workflow must have a start node');
  }

  // Check for disconnected nodes
  const connectedNodes = new Set<string>();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  const disconnectedNodes = nodes
    .filter(node => node.type !== 'input' && !connectedNodes.has(node.id))
    .map(node => node.id);

  if (disconnectedNodes.length > 0) {
    errors.push(`Disconnected nodes found: ${disconnectedNodes.join(', ')}`);
  }

  // Check for cycles (simple check)
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push('Workflow contains cycles');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjacencyList = new Map<string, string[]>();
  
  // Build adjacency list
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}

export function getExecutionOrder(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Initialize
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  // Build graph
  edges.forEach(edge => {
    const neighbors = adjacencyList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjacencyList.set(edge.source, neighbors);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });

  // Topological sort (Kahn's algorithm)
  const queue: string[] = [];
  const result: string[] = [];

  // Find all nodes with no incoming edges
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);

    const neighbors = adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  return result;
}

export function estimateExecutionTime(nodes: WorkflowNode[]): number {
  // Simple estimation based on node types
  const timeEstimates = {
    input: 0,
    agent: 30000, // 30 seconds
    condition: 1000, // 1 second
    parallel: 5000, // 5 seconds overhead
    loop: 10000, // 10 seconds per iteration
  };

  let totalTime = 0;
  for (const node of nodes) {
    totalTime += timeEstimates[node.type as keyof typeof timeEstimates] || 0;
    
    if (node.type === 'loop' && node.data.iterations) {
      totalTime += (node.data.iterations - 1) * 30000; // Assume 30s per iteration
    }
  }

  return totalTime;
}

export function calculateCost(tokenUsage: { total: number }, provider: string): number {
  // Rough cost estimates (per 1M tokens)
  const costs = {
    openai: {
      'gpt-4-turbo-preview': 10.0,
      'gpt-4': 30.0,
      'gpt-3.5-turbo': 0.5,
    },
    anthropic: {
      'claude-opus-4-20250514': 15.0,
      'claude-sonnet-4-20250514': 3.0,
      'claude-haiku-4-20250301': 0.25,
    },
    google: {
      'gemini-1.5-pro': 7.0,
      'gemini-1.5-flash': 0.35,
    },
  };

  // Default cost if provider not found
  return (tokenUsage.total / 1000000) * 5.0;
}
