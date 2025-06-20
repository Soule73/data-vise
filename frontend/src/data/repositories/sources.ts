import { useQuery, useMutation, keepPreviousData, QueryClient } from "@tanstack/react-query";
import { getSources, createSource, detectColumns, deleteSource, updateSource, fetchSourceData } from "@/data/services/datasource";

export function sourcesQuery(
  { queryClient }: { queryClient: QueryClient}
) {
  const query = useQuery({
    queryKey: ["sources"],
    queryFn: async () => getSources(),
    staleTime: 1000 * 60 * 5, // 5 min sans refetch
  });
  // Méthode pour forcer le reload
  const refetchSources = () =>
    queryClient.invalidateQueries({ queryKey: ["sources"] });
  return { ...query, refetchSources };
}

export function invalidateSources(
  { queryClient }: { queryClient: QueryClient }
) {
  return queryClient.invalidateQueries({ queryKey: ["sources"] });
}

export function useCreateSourceMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: createSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      onSuccess?.();
    },
    onError,
  });
}

export function detectColumnsQuery(params: any, enabled: boolean = true) {
  return useQuery({
    queryKey: ["detectColumns", params],
    queryFn: () => detectColumns(params),
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useDeleteSourceMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: (id: string) => deleteSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      onSuccess?.();
    },
    onError,
  });
}

export function useUpdateSourceMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateSource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      onSuccess?.();
    },
    onError,
  });
}



// Utilitaire pour générer une clé de cache stable et fiable
function buildSourceDataKey(
  sourceId?: string,
  options?: {
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
    fields?: string[] | string;
  },
  forceRefreshKey?: number
) {
  return [
    "source-data",
    sourceId || null,
    options?.from || null,
    options?.to || null,
    options?.page || 1,
    options?.pageSize || 1000,
    Array.isArray(options?.fields)
      ? options?.fields.join(",")
      : options?.fields || null,
    forceRefreshKey || null,
  ];
}

// Nouveau : hook qui utilise react-query pour le cache par id de source et options
export function dataBySourceQuery(
  sourceId?: string,
  options?: {
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
    fields?: string[] | string;
  },
  initialData?: any[] | null,
  refreshMs?: number, // pour le polling
  forceRefreshKey?: number // clé pour forcer le refetch
) {
  const queryKey = buildSourceDataKey(sourceId, options, forceRefreshKey);
  const {
    data = null,
    isLoading: loading,
    error,
    // isFetching,
    // isStale,
    // isPlaceholderData,
  } = useQuery({
    queryKey,
    queryFn: () =>
      sourceId
        ? fetchSourceData(sourceId, {
          page: options?.page ?? 1,
          pageSize: options?.pageSize ?? 1000,
          ...options,
          forceRefresh: !!forceRefreshKey && forceRefreshKey > 0,
        })
        : Promise.resolve(initialData ?? null),
    enabled: !!sourceId,
    initialData,
    staleTime: 1000 * 60 * 5, // 5 min de cache
    refetchInterval: refreshMs && refreshMs > 0 ? refreshMs : false, // active le polling si défini
    placeholderData: keepPreviousData, // pour garder le comportement précédent
  });

  // // Log pour savoir si la donnée vient du cache ou d'un refetch
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.debug(
  //     `[dataBySourceQuery] sourceId=${sourceId} | cache:`,
  //     !isFetching && !isStale && !isPlaceholderData,
  //     "| isFetching:",
  //     isFetching,
  //     "| isStale:",
  //     isStale,
  //     "| isPlaceholderData:",
  //     isPlaceholderData,
  //     "| queryKey:",
  //     queryKey
  //   );
  // }, [isFetching, isStale, isPlaceholderData, queryKey, sourceId]);

  return {
    data,
    loading,
    error: error ? "Erreur lors du chargement des données." : null,
  };
}
