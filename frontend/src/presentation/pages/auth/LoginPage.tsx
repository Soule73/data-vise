import AuthLayout from "@components/layouts/AuthLayout";
import InputField from "@components/forms/InputField";
import { useLoginForm } from "@hooks/auth/useLoginForm";
import Button from "@components/forms/Button";
import logoDataVise from "@assets/logo-datavise.svg";

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
