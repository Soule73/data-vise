import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dataSourceSchema, type DataSourceForm } from '@/validation/datasource';
import { useState } from 'react';
import { updateSource } from '@/services/datasource';

export function EditSourceForm({ source, onClose, afterEdit, onError }: { source: any; onClose: () => void; afterEdit: () => void; onError?: (message: string) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DataSourceForm>({
    defaultValues: {
      name: source.name,
      type: source.type,
      endpoint: source.endpoint,
    },
    resolver: zodResolver(dataSourceSchema),
  });
  const [globalError, setGlobalError] = useState('');

  const onSubmit = async (data: DataSourceForm) => {
    setGlobalError('');
    try {
      await updateSource(source._id, data);
      afterEdit();
      onClose();
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Erreur lors de la modification';
      setGlobalError(msg);
      if (onError) onError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom</label>
        <InputField
          {...register('name')}
          value={undefined}
          label=""
          error={errors.name?.message}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <InputField
          {...register('type')}
          value={undefined}
          label=""
          error={errors.type?.message}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Endpoint</label>
        <InputField
          {...register('endpoint')}
          value={undefined}
          label=""
          error={errors.endpoint?.message}
        />
      </div>
      {globalError && <div className="text-red-600 text-sm mb-2">{globalError}</div>}
      <div className="flex gap-2 justify-end">
        <Button color="indigo" type="submit" loading={isSubmitting}>Enregistrer</Button>
        <Button color="gray" type="button" onClick={onClose}>Annuler</Button>
      </div>
    </form>
  );
}

export function DeleteSourceForm({ source, onDelete, onCancel, loading }: { source: any; onDelete: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div>
      <p className="text-gray-700 dark:text-gray-200 mb-4">
        Voulez-vous vraiment supprimer la source <span className="font-semibold">{source.name}</span> ? Cette action est irréversible.
      </p>
      <div className="flex gap-2 justify-end">
        <Button color="red" onClick={onDelete} loading={loading}>
          Suppression
        </Button>
        <Button color="gray" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
