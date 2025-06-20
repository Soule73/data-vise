import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWidgets, createWidget } from "@/data/services/widget";

export function widgetsQuery() {
  return useQuery({
    queryKey: ["widgets"],
    queryFn: fetchWidgets,
    staleTime: 1000 * 60 * 5, // 5 min sans refetch
  });
}

export function refetchWidgets(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: ["widgets"] });
}

export function useCreateWidgetMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: (widget: any) => void;
  onError?: (e: any) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: createWidget,
    onSuccess: (widget) => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
      onSuccess?.(widget);
    },
    onError,
  });
}
