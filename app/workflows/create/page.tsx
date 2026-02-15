'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Plus } from 'lucide-react';
import AgentNode from '@/components/workflow/AgentNode';
import ConditionNode from '@/components/workflow/ConditionNode';
import ParallelNode from '@/components/workflow/ParallelNode';

const nodeTypes = {
  agent: AgentNode,
  condition: ConditionNode,
  parallel: ParallelNode,
};

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 0 },
  },
];

const initialEdges: Edge[] = [];

export default function CreateWorkflowPage() {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addAgentNode = () => {
    const newNode: Node = {
      id: `agent-${nodes.length}`,
      type: 'agent',
      data: { label: 'New Agent', status: 'idle' },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addConditionNode = () => {
    const newNode: Node = {
      id: `condition-${nodes.length}`,
      type: 'condition',
      data: { label: 'Condition', condition: 'if (true)' },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addParallelNode = () => {
    const newNode: Node = {
      id: `parallel-${nodes.length}`,
      type: 'parallel',
      data: { label: 'Parallel Execution', branches: 2 },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = () => {
    console.log('Saving workflow:', { workflowName, workflowDescription, nodes, edges });
    router.push('/workflows');
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex-1 max-w-xl">
            <Input
              placeholder="Workflow Name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="mb-2 bg-slate-800 border-slate-700 text-white"
            />
            <Input
              placeholder="Description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={addAgentNode} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agent
            </Button>
            <Button onClick={addConditionNode} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Condition
            </Button>
            <Button onClick={addParallelNode} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Parallel
            </Button>
            <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700">
              <Save className="w-4 h-4 mr-2" />
              Save Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
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
        </ReactFlow>
      </div>
    </div>
  );
}
