import { useQuery } from "@tanstack/react-query";
import { fetchSourceData } from "@/data/services/datasource";

// Nouveau : hook qui utilise react-query pour le cache par id de source et options
export function useSourceData(
  sourceId?: string,
  options?: { from?: string; to?: string },
  initialData?: any[] | null
) {
  const {
    data = null,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["source-data", sourceId, options],
    queryFn: () =>
      sourceId
        ? fetchSourceData(sourceId, options)
        : Promise.resolve(initialData ?? null),
    enabled: !!sourceId,
    initialData,
    staleTime: 1000 * 60 * 5, // 5 min de cache
  });
  return {
    data,
    loading,
    error: error ? "Erreur lors du chargement des données." : null,
  };
}
