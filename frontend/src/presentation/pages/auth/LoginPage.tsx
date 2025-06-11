import AuthLayout from "@/presentation/components/AuthLayout";
import InputField from "@/presentation/components/InputField";
import { useLoginForm } from "@/core/hooks/useLoginForm";
import Button from "@/presentation/components/Button";

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
      title="Connexion à votre compte"
      logoUrl="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
      bottomText={
        <>
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Créer un compte
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
