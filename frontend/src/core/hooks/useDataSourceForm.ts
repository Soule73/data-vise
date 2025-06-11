import { useMutation } from '@tanstack/react-query';
import { createSource, detectColumns } from '@/data/services/datasource';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useDataSourceForm() {
  // Gestion du flow multi-étapes
  const [step, setStep] = useState(1);
  const [endpoint, setEndpoint] = useState('');
  const [columns, setColumns] = useState<{ name: string; type: string }[]>([]);
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [columnsError, setColumnsError] = useState('');
  const [dataPreview, setDataPreview] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Création de la source (étape 3)
  const mutation = useMutation({
    mutationFn: async () => {
      return await createSource({ name, type, endpoint });
    },
    onSuccess: () => {
      setGlobalError('');
      setSuccess(true);
      setTimeout(() => navigate('/sources'), 1200);
    },
    onError: (e: any) => {
      setGlobalError(e.response?.data?.message || 'Erreur lors de la création de la source');
    },
  });

  // Étape 1 : détection colonnes + preview
  const handleNext = async () => {
    setColumnsError('');
    setColumns([]);
    setDataPreview([]);
    setColumnsLoading(true);
    try {
      const res = await detectColumns(endpoint);
      if (!res.columns || res.columns.length === 0) {
        setColumnsError('Aucune colonne détectée.');
        setColumnsLoading(false);
        return;
      }
      // Aperçu des données (5 premières lignes)
      const dataRes = await fetch(endpoint);
      const data = await dataRes.json();
      setDataPreview(Array.isArray(data) ? data.slice(0, 5) : [data]);
      // Détection du type de chaque colonne sur la première ligne
      const firstRow = Array.isArray(data) && data.length > 0 ? data[0] : data;
      setColumns(res.columns.map((col: string) => ({
        name: col,
        type: firstRow && firstRow[col] !== undefined ? typeof firstRow[col] : 'inconnu',
      })));
      setStep(2);
    } catch (e: any) {
      setColumnsError(e.response?.data?.message || 'Impossible de détecter les colonnes');
    } finally {
      setColumnsLoading(false);
    }
  };

  // Étape 3 : création
  const handleCreate = async () => {
    setGlobalError('');
    mutation.mutate();
  };

  return {
    step,
    setStep,
    endpoint,
    setEndpoint,
    columns,
    columnsLoading,
    columnsError,
    dataPreview,
    name,
    setName,
    type,
    setType,
    globalError,
    setGlobalError,
    success,
    handleNext,
    handleCreate,
    loading: mutation.isPending,
  };
}
