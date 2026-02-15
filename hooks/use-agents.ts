import { useState, useEffect } from 'react';
import type { Agent } from '@/types';
import { generateId } from '@/lib/utils';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch agents from API
    setLoading(false);
  }, []);

  const createAgent = async (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAgent: Agent = {
        ...agent,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAgents([...agents, newAgent]);
      return newAgent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  const updateAgent = async (id: string, updates: Partial<Agent>) => {
    try {
      setAgents(agents.map(a => 
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      setAgents(agents.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return { agents, loading, error, createAgent, updateAgent, deleteAgent };
}
