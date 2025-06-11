import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSources } from '@/data/services/dashboard';
import { useSourcesStore } from '@/core/store/sources';

export function useSources() {
  const sources = useSourcesStore(s => s.sources);
  const setSources = useSourcesStore(s => s.setSources);

  // Si déjà en cache Zustand, ne pas refetch
  const query = useQuery({
    queryKey: ['sources'],
    queryFn: fetchSources,
    enabled: sources.length === 0, // fetch uniquement si cache vide
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // Hydrate Zustand à chaque changement de query.data
  useEffect(() => {
    if (query.data) {
      setSources(query.data);
    }
  }, [query.data, setSources]);

  return {
    sources: sources.length > 0 ? sources : query.data || [],
    isLoading: query.isLoading && sources.length === 0,
    error: query.error,
    refetch: query.refetch,
  };
}
