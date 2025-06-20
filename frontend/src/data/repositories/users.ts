import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/data/services/user";
import type { User } from "@/core/types/auth-types";

export function usersQuery() {
    return useQuery<User[]>({
        queryKey: ["users"],
        queryFn: fetchUsers,
        staleTime: 1000 * 60 * 60 * 24, // 24h
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
}
