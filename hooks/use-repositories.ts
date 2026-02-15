import { useState, useEffect } from 'react';
import type { Repository } from '@/types';

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepositories() {
      try {
        setLoading(true);
        const response = await fetch('/api/github/repos');
        const data = await response.json();
        
        if (data.success) {
          setRepositories(data.repositories);
        } else {
          setError(data.error || 'Failed to fetch repositories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchRepositories();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/github/repos');
      const data = await response.json();
      if (data.success) {
        setRepositories(data.repositories);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { repositories, loading, error, refetch };
}
