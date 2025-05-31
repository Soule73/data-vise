import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { useDataSourceForm } from '@/hooks/useDataSourceForm';

export default function AddSourcePage() {
  const {
    step,
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
    success,
    handleNext,
    handleCreate,
    loading,
    setStep,
  } = useDataSourceForm();

  return (
    <>
        <h1 className="text-2xl font-bold mb-6">Ajouter une source de données</h1>
        {step === 1 && (
          <>
                  <InputField label="Endpoint (URL JSON)" value={endpoint} onChange={e => setEndpoint(e.target.value)} error={columnsError} />
            <div className="text-sm text-gray-500 mb-4">
                      Entrez l'URL d'un endpoint qui retourne des données au format JSON. Par exemple : <code>https://api.example.com/data</code>
            </div>
            <Button color="indigo" size="md" loading={columnsLoading} onClick={handleNext}>
              Suivant
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="mb-4">
              <div className="font-semibold mb-2">Colonnes détectées :</div>
              <table className="w-full text-xs border rounded bg-gray-50 dark:bg-gray-800">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Nom</th>
                    <th className="p-2 text-left">Type détecté</th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map(col => (
                    <tr key={col.name}>
                      <td className="p-2 font-mono">{col.name}</td>
                      <td className="p-2">{col.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 font-semibold">Aperçu des données :</div>
              <pre className="bg-gray-100 dark:bg-gray-900 rounded p-2 text-xs overflow-x-auto max-h-40">{JSON.stringify(dataPreview, null, 2)}</pre>
            </div>
            <Button color="indigo" size="md" onClick={() => setStep(3)}>
              Valider les colonnes
            </Button>
          </>
        )}
        {step === 3 && (
          <>
            <InputField label="Nom de la source" value={name} onChange={e => setName(e.target.value)} error={!name ? 'Le nom est requis' : ''} />
            <InputField label="Type de la source" value={type} onChange={e => setType(e.target.value)} error={!type ? 'Le type est requis' : ''} />
            {globalError && <div className="text-red-500 text-sm mb-2">{globalError}</div>}
            <Button color="indigo" size="md" onClick={handleCreate} disabled={!name || !type} loading={loading}>
              Ajouter
            </Button>
            {success && <div className="text-green-600 mt-2">Source ajoutée !</div>}
          </>
        )}
    </>
  );
}
