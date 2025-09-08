import {
  useQuery,
  useMutation,
  keepPreviousData,
  QueryClient,
} from "@tanstack/react-query";
import {
  getSources,
  createSource,
  detectColumns,
  deleteSource,
  updateSource,
  fetchSourceData,
  fetchUploadedFile,
  getSourceById,
} from "@services/datasource";

import type { ApiError } from "@type/api";
import type { DetectParams, SourceFormState } from "@type/dataSource";

export function useSourcesQuery({ queryClient }: { queryClient: QueryClient }) {
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

export function invalidateSources({
  queryClient,
}: {
  queryClient: QueryClient;
}) {
  return queryClient.invalidateQueries({ queryKey: ["sources"] });
}

export function useCreateSourceMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: () => void;
  onError?: (e: ApiError) => void;
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

export function useDetectColumnsQuery(params: DetectParams | null, enabled: boolean = true) {
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
  onError?: (e: ApiError) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SourceFormState }) =>
      updateSource(id, data),
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

export function useDataBySourceQuery(
  sourceId?: string,
  options?: {
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
    fields?: string[] | string;
    shareId?: string;
  },
  initialData?: Record<string, unknown>[] | null,
  refreshMs?: number,
  forceRefreshKey?: number
) {

  const queryKey = buildSourceDataKey(sourceId, options, forceRefreshKey);

  const queryOptions = {
    page: options?.page ?? 1,
    pageSize: options?.pageSize ?? 1000,
    ...options,
    forceRefresh: !!forceRefreshKey && forceRefreshKey > 0,
  };
  const {
    data = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      sourceId
        ? fetchSourceData({ sourceId, options: queryOptions })
        : Promise.resolve(initialData ?? null),
    enabled: !!sourceId,
    initialData,
    staleTime: 1000 * 60 * 5,
    refetchInterval: refreshMs && refreshMs > 0 ? refreshMs : false,
    placeholderData: keepPreviousData,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = (data && (data as Record<string, any>).total) || undefined;

  const rows = Array.isArray(data) ? data : [];

  return {
    data: rows,
    total,
    loading,
    error: error ? "Erreur lors du chargement des données." : null,
    refetch,
  };
}

export async function getUploadedFile(filename: string): Promise<Blob> {
  return await fetchUploadedFile(filename);
}

export function useSourceByIdQuery({ id }: { id: string | undefined }) {
  if (!id) {
    throw new Error("Source ID is required for useSourceByIdQuery");
  }
  return useQuery({
    queryKey: ["source", id],
    queryFn: () => getSourceById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
