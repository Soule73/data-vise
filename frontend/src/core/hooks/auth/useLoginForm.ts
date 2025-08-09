import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@store/user";
import { useLoginMutation } from "@repositories/auth";
import { loginSchema, type LoginForm } from "@validation/login";
import { useState } from "react";
import { ROUTES } from "@constants/routes";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      if (e.response?.data?.errors) {
        Object.entries(e.response.data.errors).forEach(([field, message]) => {
          form.setError(field as keyof LoginForm, {
            type: "manual",
            message: message as string,
          });
        });
        setGlobalError("");
      } else {
        setGlobalError(e.response?.data?.message || "Erreur de connexion");
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
