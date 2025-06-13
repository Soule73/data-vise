import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/data/services/api";

export function useWidgets() {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["widgets"],
        queryFn: async () => (await api.get("/widgets")).data,
        staleTime: 1000 * 60 * 5, // 5 min sans refetch
    });
    // Méthode pour forcer le reload
    const refetchWidgets = () => queryClient.invalidateQueries({ queryKey: ["widgets"] });
    return { ...query, refetchWidgets };
}
