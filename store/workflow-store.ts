import { create } from 'zustand';
import type { Workflow, WorkflowNode, WorkflowEdge } from '@/types';
import { generateId } from '@/lib/utils';

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  addNode: (node: Omit<WorkflowNode, 'id'>) => void;
  updateNode: (id: string, data: Partial<WorkflowNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: Omit<WorkflowEdge, 'id'>) => void;
  deleteEdge: (id: string) => void;
  saveWorkflow: () => void;
  loadWorkflow: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  nodes: [],
  edges: [],
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, { ...node, id: generateId() }],
    })),
  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...data } : node
      ),
    })),
  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    })),
  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, { ...edge, id: generateId() }],
    })),
  deleteEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),
  saveWorkflow: () => {
    const { nodes, edges, currentWorkflow } = get();
    if (currentWorkflow) {
      const updatedWorkflow = { ...currentWorkflow, nodes, edges };
      set((state) => ({
        workflows: state.workflows.map((w) =>
          w.id === currentWorkflow.id ? updatedWorkflow : w
        ),
        currentWorkflow: updatedWorkflow,
      }));
    }
  },
  loadWorkflow: (id) => {
    const workflow = get().workflows.find((w) => w.id === id);
    if (workflow) {
      set({
        currentWorkflow: workflow,
        nodes: workflow.nodes,
        edges: workflow.edges,
      });
    }
  },
}));
