import { useQuery } from '@tanstack/react-query';
import { fetchSourceData } from '@/data/services/datasource';

// Optimisé : hook qui utilise react-query pour le cache par endpoint
export function useSourceData(endpoint?: string, initialData?: any[] | null) {
  // Toujours appeler useQuery, même si endpoint est vide
  const {
    data = null,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['source-data', endpoint],
    queryFn: () => endpoint ? fetchSourceData(endpoint) : Promise.resolve(initialData ?? null),
    enabled: !!endpoint,
    initialData,
    staleTime: 1000 * 60 * 5, // 5 min de cache
  });
  return { data, loading, error: error ? 'Erreur lors du chargement des données.' : null };
}
