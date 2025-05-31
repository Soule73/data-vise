import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSources } from '@/services/dashboard';
import { useSourcesStore } from '@/store/sources';

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

  // Hydrate Zustand au premier fetch
  useEffect(() => {
    if (query.data && sources.length === 0) {
      setSources(query.data);
    }
  }, [query.data, setSources, sources.length]);

  return {
    sources: sources.length > 0 ? sources : query.data || [],
    isLoading: query.isLoading && sources.length === 0,
    error: query.error,
    refetch: query.refetch,
  };
}
