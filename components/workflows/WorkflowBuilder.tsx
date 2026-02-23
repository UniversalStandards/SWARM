'use client';

import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Plus, Save, Play } from 'lucide-react';
import AgentNode from './AgentNode';
import ConditionNode from './ConditionNode';
import ParallelNode from './ParallelNode';
import LoopNode from './LoopNode';

const nodeTypes = {
  agent: AgentNode,
  condition: ConditionNode,
  parallel: ParallelNode,
  loop: LoopNode,
};

interface WorkflowBuilderProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  onExecute?: (nodes: Node[], edges: Edge[]) => void;
}

export function WorkflowBuilder({
  initialNodes = [],
  initialEdges = [],
  onSave,
  onExecute,
}: WorkflowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-950"
      >
        <Background color="#1e293b" gap={16} />
        <Controls />
        <MiniMap className="bg-slate-800" />
        
        <Panel position="top-right" className="space-y-2">
          <div className="flex gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
            <Button size="sm" variant="outline" onClick={() => addNode('agent')}>
              <Plus className="w-4 h-4 mr-1" />
              Agent
            </Button>
            <Button size="sm" variant="outline" onClick={() => addNode('condition')}>
              <Plus className="w-4 h-4 mr-1" />
              Condition
            </Button>
            <Button size="sm" variant="outline" onClick={() => addNode('parallel')}>
              <Plus className="w-4 h-4 mr-1" />
              Parallel
            </Button>
            <Button size="sm" variant="outline" onClick={() => addNode('loop')}>
              <Plus className="w-4 h-4 mr-1" />
              Loop
            </Button>
          </div>

          <div className="flex gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSave?.(nodes, edges)}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700"
              onClick={() => onExecute?.(nodes, edges)}
            >
              <Play className="w-4 h-4 mr-1" />
              Execute
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
