import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerService } from '@/data/services/auth';
import { registerSchema, type RegisterForm } from '@/core/validation/register';
import { useUserStore } from '@/core/store/user';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants/routes';

export function useRegisterForm() {
  const setUser = useUserStore((s) => s.setUser);
  const form = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const [globalError, setGlobalError] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      // On ne transmet pas confirmPassword à l'API
      return await registerService(data.username, data.email, data.password);
    },
    onSuccess: (res) => {
      setUser(res.user, res.token);
      setGlobalError('');
      // Redirige l'utilisateur après inscription
      navigate(ROUTES.dashboard, { replace: true });
    },
    onError: (e: any) => {
      if (e.response?.data?.errors) {
        Object.entries(e.response.data.errors).forEach(([field, message]) => {
          form.setError(field as keyof RegisterForm, { type: 'manual', message: message as string });
        });
        setGlobalError('');
      } else {
        setGlobalError(e.response?.data?.message || 'Erreur lors de la création du compte');
      }
    },
  });

  const onSubmit = (data: RegisterForm) => {
    setGlobalError('');
    mutation.mutate(data);
  };

  return {
    ...form,
    onSubmit,
    loading: mutation.isPending,
    globalError,
    setGlobalError,
  };
}
