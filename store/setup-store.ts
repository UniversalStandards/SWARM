import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SetupStep } from '@/types';

interface SetupStore {
  currentStep: number;
  steps: SetupStep[];
  githubToken: string | null;
  selectedRepo: string | null;
  aiProvider: string | null;
  aiApiKey: string | null;
  setCurrentStep: (step: number) => void;
  setGithubToken: (token: string) => void;
  setSelectedRepo: (repo: string) => void;
  setAiProvider: (provider: string) => void;
  setAiApiKey: (key: string) => void;
  completeStep: (stepId: number) => void;
  reset: () => void;
}

const initialSteps: SetupStep[] = [
  {
    id: 1,
    title: 'Connect GitHub',
    description: 'Authenticate with GitHub to access your repositories',
    completed: false,
  },
  {
    id: 2,
    title: 'Select Repository',
    description: 'Choose a repository for your AI agents to work on',
    completed: false,
  },
  {
    id: 3,
    title: 'Configure AI',
    description: 'Set up your AI provider and API keys',
    completed: false,
  },
  {
    id: 4,
    title: 'Build Workflow',
    description: 'Design your agent workflow and start orchestrating',
    completed: false,
  },
];

export const useSetupStore = create<SetupStore>()(n  persist(
    (set) => ({
      currentStep: 1,
      steps: initialSteps,
      githubToken: null,
      selectedRepo: null,
      aiProvider: null,
      aiApiKey: null,
      setCurrentStep: (step) => set({ currentStep: step }),
      setGithubToken: (token) => set({ githubToken: token }),
      setSelectedRepo: (repo) => set({ selectedRepo: repo }),
      setAiProvider: (provider) => set({ aiProvider: provider }),
      setAiApiKey: (key) => set({ aiApiKey: key }),
      completeStep: (stepId) =>
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === stepId ? { ...step, completed: true } : step
          ),
        })),
      reset: () =>
        set({
          currentStep: 1,
          steps: initialSteps,
          githubToken: null,
          selectedRepo: null,
          aiProvider: null,
          aiApiKey: null,
        }),
    }),
    {
      name: 'swarm-setup-storage',
    }
  )
);
