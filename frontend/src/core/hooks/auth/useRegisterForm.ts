import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "@repositories/auth";
import { registerSchema, type RegisterForm } from "@validation/register";
import { useUserStore } from "@store/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import type { ApiError } from "@type/api";

export function useRegisterForm() {
  const setUser = useUserStore((s) => s.setUser);
  const form = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();

  const mutation = useRegisterMutation({
    onSuccess: (res) => {
      setUser(res.user, res.token);
      setGlobalError("");

      navigate(ROUTES.dashboard, { replace: true });
    },
    onError: (e: ApiError) => {
      if (e?.errors) {
        Object.entries(e?.errors).forEach(([field, message]) => {
          form.setError(field as keyof RegisterForm, {
            type: "manual",
            message: message as string,
          });
        });
        setGlobalError("");
      } else {
        setGlobalError(
          e?.message || "Erreur lors de la création du compte"
        );
      }
    },
  });

  const onSubmit = (data: RegisterForm) => {
    setGlobalError("");
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
