'use client';

import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Save, Play, Trash2, Settings } from 'lucide-react';

interface WorkflowBuilderProps {
  workflowId?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  onExecute?: (nodes: Node[], edges: Edge[]) => void;
}

const nodeTypes = [
  { type: 'agent', label: 'AI Agent', color: '#3b82f6' },
  { type: 'task', label: 'Task', color: '#10b981' },
  { type: 'condition', label: 'Condition', color: '#f59e0b' },
  { type: 'parallel', label: 'Parallel', color: '#8b5cf6' },
  { type: 'loop', label: 'Loop', color: '#ec4899' },
  { type: 'api', label: 'API Call', color: '#06b6d4' },
  { type: 'data', label: 'Data Transform', color: '#6366f1' },
];

const initialNodesDefault: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 0 },
  },
];

const initialEdgesDefault: Edge[] = [];

export default function WorkflowBuilder({
  workflowId,
  initialNodes = initialNodesDefault,
  initialEdges = initialEdgesDefault,
  onSave,
  onExecute,
}: WorkflowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const addNode = (nodeType: string) => {
    const newNode: Node = {
      id: `node-${nodeIdCounter}`,
      type: nodeType === 'agent' ? 'default' : nodeType,
      data: {
        label: `${nodeType} ${nodeIdCounter}`,
        nodeType,
        config: {},
      },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      style: {
        background: nodeTypes.find((t) => t.type === nodeType)?.color || '#6366f1',
        color: 'white',
        border: '2px solid #fff',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '150px',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, edges);
    }
    alert('Workflow saved successfully!');
  };

  const handleExecute = () => {
    if (onExecute) {
      onExecute(nodes, edges);
    } else {
      alert('Executing workflow...');
    }
  };

  const clearWorkflow = () => {
    if (confirm('Are you sure you want to clear the entire workflow?')) {
      setNodes(initialNodesDefault);
      setEdges([]);
      setSelectedNode(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - Node Palette */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
        <h3 className="text-white font-semibold mb-4 text-lg">Add Nodes</h3>
        <div className="space-y-2">
          {nodeTypes.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => addNode(nodeType.type)}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-white hover:bg-gray-700 transition-colors"
              style={{ backgroundColor: nodeType.color }}
            >
              <Plus className="w-4 h-4" />
              {nodeType.label}
            </button>
          ))}
        </div>

        {/* Node Configuration Panel */}
        {selectedNode && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Node Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Node ID</label>
                <input
                  type="text"
                  value={selectedNode.id}
                  disabled
                  className="w-full px-3 py-2 bg-gray-700 text-gray-400 rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Label</label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(e) => {
                    setNodes((nds) =>
                      nds.map((node) =>
                        node.id === selectedNode.id
                          ? { ...node, data: { ...node.data, label: e.target.value } }
                          : node
                      )
                    );
                    setSelectedNode({
                      ...selectedNode,
                      data: { ...selectedNode.data, label: e.target.value },
                    });
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Node
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold text-lg">Workflow Builder</h2>
            <span className="text-gray-400 text-sm">
              {nodes.length} nodes, {edges.length} connections
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleExecute}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              Execute
            </button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#374151" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                return nodeTypes.find((t) => t.type === node.data.nodeType)?.color || '#6366f1';
              }}
              maskColor="rgba(0, 0, 0, 0.5)"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
