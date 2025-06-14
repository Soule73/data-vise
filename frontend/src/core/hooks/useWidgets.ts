import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWidgets } from "@/data/services/widget";

export function useWidgets() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["widgets"],
    queryFn: fetchWidgets,
    staleTime: 1000 * 60 * 5, // 5 min sans refetch
  });
  // Méthode pour forcer le reload
  const refetchWidgets = () =>
    queryClient.invalidateQueries({ queryKey: ["widgets"] });
  return { ...query, refetchWidgets };
}
