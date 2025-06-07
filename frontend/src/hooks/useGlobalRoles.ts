import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRoleStore } from '@/store/roles';
import { fetchRoles } from '@/services/role';

export function useGlobalRoles() {
  const setRoles = useRoleStore(s => s.setRoles);
  const roles = useRoleStore(s => s.roles);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    staleTime: 1000 * 60 * 60 * 24, // 24h
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData: () => queryClient.getQueryData(['roles']) as any[] | undefined,
  });

  useEffect(() => {
    if (data) setRoles(data);
  }, [data, setRoles]);

  return roles;
}
