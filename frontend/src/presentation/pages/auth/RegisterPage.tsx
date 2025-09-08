import AuthLayout from "@components/layouts/AuthLayout";
import InputField from "@components/forms/InputField";
import Button from "@components/forms/Button";
import { useRegisterForm } from "@hooks/auth/useRegisterForm";
import logoDataVise from "@assets/logo-datavise.svg";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    loading,
    globalError,
  } = useRegisterForm();

  return (
    <AuthLayout
      title="Créer un compte"
      logoUrl={logoDataVise}
      bottomText={
        <>
          Déjà inscrit ?{" "}
          <a
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Se connecter
          </a>
        </>
      }
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
          label="Nom d'utilisateur"
          {...register("username")}
          error={errors.username?.message}
        />
        <InputField
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <InputField
          label="Mot de passe"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
        <InputField
          label="Confirmer le mot de passe"
          type="password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          color="indigo"
          size="md"
          variant="solid"
          loading={loading}
          disabled={loading}
        >
          Créer un compte
        </Button>
      </form>
    </AuthLayout>
  );
}
