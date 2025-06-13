import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/data/services/api";

export function useSources() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["sources"],
    queryFn: async () => (await api.get("/sources")).data,
    staleTime: 1000 * 60 * 5, // 5 min sans refetch
  });
  // Méthode pour forcer le reload
  const refetchSources = () => queryClient.invalidateQueries({ queryKey: ["sources"] });
  return { ...query, refetchSources };
}
