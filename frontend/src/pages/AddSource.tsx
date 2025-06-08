import InputField from "@/components/InputField";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

import Button from "@/components/Button";
import { useDataSourceForm } from "@/hooks/useDataSourceForm";
import Table from "@/components/Table";
import { useDashboardStore } from "@/store/dashboard";
import { useEffect } from "react";

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

  const setDashboardTitle = useDashboardStore((s) => s.setDashboardTitle);

  useEffect(() => {
    setDashboardTitle("add", "Ajouter une source");
    setDashboardTitle("sources", "Sources");
  }, [setDashboardTitle]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Ajouter une source de données</h1>
      {step === 1 && (
        <div>
          <div className="mb-4 max-w-xl">
            <InputField
              label="Endpoint (URL JSON)"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              error={columnsError}
            />
            <span className="text-sm text-gray-500 mb-4">
              Entrez l'URL d'un endpoint qui retourne des données au format
              JSON. Par exemple : <code>https://api.example.com/data</code>
            </span>
          </div>
          <div className=" w-max">
            <Button
              className="px-8"
              color="indigo"
              size="md"
              loading={columnsLoading}
              onClick={handleNext}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <>
          <div className="mb-4">
            <div className="font-semibold mb-2">Colonnes détectées :</div>
            <Table
              columns={[
                {
                  key: "name",
                  label: "Nom",
                  className: "p-2 text-left font-mono",
                },
                {
                  key: "type",
                  label: "Type détecté",
                  className: "p-2 text-left",
                },
              ]}
              data={columns}
              emptyMessage="Aucune colonne détectée."
            />
            <div className="mt-4 font-semibold">Aperçu des données :</div>
            <SyntaxHighlighter
              language="json"
              style={okaidia}
              className="bg-gray-100 dark:bg-gray-900 config-scrollbar rounded p-2 text-xs overflow-x-auto max-h-40"
            >
              {JSON.stringify(dataPreview, null, 2)}
            </SyntaxHighlighter>
          </div>
          <div className=" w-max">
            <Button
              className="px-8"
              color="indigo"
              size="md"
              onClick={() => setStep(3)}
            >
              Valider les colonnes
            </Button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <InputField
            label="Nom de la source"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!name ? "Le nom est requis" : ""}
          />
          <InputField
            label="Type de la source"
            value={type}
            onChange={(e) => setType(e.target.value)}
            error={!type ? "Le type est requis" : ""}
          />
          {globalError && (
            <div className="text-red-500 text-sm mb-2">{globalError}</div>
          )}
          <Button
            color="indigo"
            size="md"
            onClick={handleCreate}
            disabled={!name || !type}
            loading={loading}
          >
            Ajouter
          </Button>
          {success && (
            <div className="text-green-600 mt-2">Source ajoutée !</div>
          )}
        </>
      )}
    </>
  );
}
