import { useQuery } from '@tanstack/react-query';
import { fetchSourceData } from '@/services/datasource';

// Optimisé : hook qui utilise react-query pour le cache par endpoint
export function useSourceData(endpoint?: string, initialData?: any[] | null) {
  const {
    data = null,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: endpoint ? ['source-data', endpoint] : ['source-data', 'none'],
    queryFn: endpoint ? () => fetchSourceData(endpoint) : undefined,
    enabled: !!endpoint,
    initialData,
    staleTime: 1000 * 60 * 5, // 5 min de cache
  });
  return { data, loading, error: error ? 'Erreur lors du chargement des données.' : null };
}
