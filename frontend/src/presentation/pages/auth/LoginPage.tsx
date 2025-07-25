import AuthLayout from "@/presentation/components/layouts/AuthLayout";
import InputField from "@/presentation/components/forms/InputField";
import { useLoginForm } from "@/core/hooks/auth/useLoginForm";
import Button from "@/presentation/components/forms/Button";
import logoDataVise from "../../../core/assets/logo-datavise.svg";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    globalError,
    loading,
  } = useLoginForm();

  return (
    <AuthLayout
      title="Conecter vous à Data-Vise"
      logoUrl={logoDataVise}
    // bottomText={
    //   <>
    //     Pas encore de compte ?{" "}
    //     <a
    //       href="/register"
    //       className="font-semibold text-indigo-600 hover:text-indigo-500"
    //     >
    //       Créer un compte
    //     </a>
    //   </>
    // }
    >
      {globalError && (
        <div
          className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300 text-sm text-center
        dark:bg-red-900 dark:text-red-300 dark:border-red-700 transition-colors duration-300
        "
        >
          {globalError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          placeholder="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          className="!py-4"
        />
        <InputField
          placeholder="Mot de passe"
          type="password"
          {...register("password")}
          error={errors.password?.message}
          className="!py-4"
        />
        <Button
          type="submit"
          color="indigo"
          size="md"
          variant="solid"
          loading={loading}
          disabled={loading}

        >
          Se connecter
        </Button>
      </form>
    </AuthLayout>
  );
}
