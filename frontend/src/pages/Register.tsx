import AuthLayout from '@/components/AuthLayout';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import ErrorModal from '@/components/ErrorModal';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, onSubmit, loading, globalError, setGlobalError } = useRegisterForm();

  return (
    <AuthLayout
      title="Créer un compte"
      logoUrl="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
      bottomText={
        <>
          Déjà inscrit ?{' '}
          <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Se connecter</a>
        </>
      }
    >
      {globalError && <ErrorModal message={globalError} onClose={() => setGlobalError('')} />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField label="Nom d'utilisateur" {...register('username')} error={errors.username?.message} />
        <InputField label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <InputField label="Mot de passe" type="password" {...register('password')} error={errors.password?.message} />
        <InputField label="Confirmer le mot de passe" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        <Button type="submit" color="indigo" size="md" variant="solid" loading={loading} disabled={loading}>Créer un compte</Button>
      </form>
    </AuthLayout>
  );
}
