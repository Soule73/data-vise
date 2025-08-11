import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@services/user";
import type { User } from "@type/authTypes";

export function useUsersQuery() {
    return useQuery<User[]>({
        queryKey: ["users"],
        queryFn: fetchUsers,
        staleTime: 1000 * 60 * 60 * 24, // 24h
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
}
