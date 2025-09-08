import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@store/user";
import { useLoginMutation } from "@repositories/auth";
import { loginSchema, type LoginForm } from "@validation/login";
import { useState } from "react";
import { ROUTES } from "@constants/routes";
import type { ApiError } from "@type/api";

export function useLoginForm() {
  const setUser = useUserStore((s) => s.setUser);
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState("");
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const mutation = useLoginMutation({
    onSuccess: (res) => {
      setUser(res.user, res.token);
      setGlobalError("");
      navigate(ROUTES.dashboard);
    },
    onError: (e: ApiError) => {
      if (e?.errors) {
        Object.entries(e.errors).forEach(([field, message]) => {
          form.setError(field as keyof LoginForm, {
            type: "manual",
            message: message as string,
          });
        });
        setGlobalError("");
      } else {
        setGlobalError(e.message || "Erreur de connexion");
      }
    },
  });

  const onSubmit = (data: LoginForm) => {
    setGlobalError("");
    mutation.mutate(data);
  };

  return {
    ...form,
    onSubmit,
    globalError,
    setGlobalError,
    loading: mutation.isPending,
  };
}
