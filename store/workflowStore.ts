import { create } from 'zustand';
import { Workflow, WorkflowStatus } from '@/types';

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  setWorkflows: (workflows: Workflow[]) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: [],
  currentWorkflow: null,
  setWorkflows: (workflows) => set({ workflows }),
  addWorkflow: (workflow) =>
    set((state) => ({ workflows: [...state.workflows, workflow] })),
  updateWorkflow: (id, updates) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),
  deleteWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
    })),
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
}));
