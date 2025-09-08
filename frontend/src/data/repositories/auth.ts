/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, useMutation } from "@tanstack/react-query";
import {
  login as loginService,
  register as registerService,
} from "@services/auth";
import { createUser, updateUser, deleteUser } from "@services/user";
import type { LoginForm } from "@validation/login";
import type { RegisterForm } from "@validation/register";

export function useLoginMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (res: any) => void;
  onError?: (e: any) => void;
} = {}) {
  return useMutation({
    mutationFn: async (data: LoginForm) => {
      return await loginService(data.email, data.password);
    },
    onSuccess,
    onError,
  });
}

export function useRegisterMutation({
  onSuccess,
  onError,
}: {
  onSuccess?: (res: any) => void;
  onError?: (e: any) => void;
} = {}) {
  return useMutation({
    mutationFn: async (data: RegisterForm) => {
      // On ne transmet pas confirmPassword à l'API
      return await registerService(data.username, data.email, data.password);
    },
    onSuccess,
    onError,
  });
}

export function useCreateUserMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: async (payload: any) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
    onError,
  });
}

export function useUpdateUserMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
    onError,
  });
}

export function useDeleteUserMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: async (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
    onError,
  });
}
