'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflow-store';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start: Repository Analysis' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Coder Agent' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Tester Agent' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Review & Deploy' },
    position: { x: 250, y: 200 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

export function WorkflowBuilder() {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleLaunch = () => {
    // Save workflow
    useWorkflowStore.getState().saveWorkflow();
    router.push('/setup/complete');
  };

  return (
    <div className="glass rounded-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Build Your Workflow</h2>
        <p className="text-gray-400">Design how your AI agents will collaborate</p>
      </div>

      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden" style={{ height: '500px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          <p>• Drag nodes to rearrange</p>
          <p>• Click nodes to configure agents</p>
          <p>• Connect nodes to define workflow</p>
        </div>
        <Button
          onClick={handleLaunch}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          size="lg"
        >
          <Rocket className="w-5 h-5 mr-2" />
          Launch Swarm
        </Button>
      </div>
    </div>
  );
}
