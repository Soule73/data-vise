import InputField from "@/presentation/components/forms/InputField";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

import Button from "@/presentation/components/forms/Button";
import { useDataSourceForm } from "@/core/hooks/datasource/useDataSourceForm";
import Table from "@/presentation/components/Table";
import { useDashboardStore } from "@/core/store/dashboard";
import { useEffect, useRef, useState } from "react";
import Collapsible from "@/presentation/components/Collapsible";
import { ROUTES } from "@/core/constants/routes";
import SelectField from "@/presentation/components/SelectField";
import Modal from "@/presentation/components/Modal";

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
    csvOrigin,
    setCsvOrigin,
    csvFile,
    setCsvFile,
    globalError,
    // success,
    handleNext,
    handleCreate,
    loading,
    setStep,
    timestampField,
    setTimestampField,
  } = useDataSourceForm();

  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setBreadcrumb([
      { url: ROUTES.sources, label: "Sources" },
      { url: ROUTES.addSource, label: "Ajouter une source" },
    ]);
  }, [setBreadcrumb]);

  return (
    <>
      <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">
          Ajouter une source de données
        </h1>
        {step === 1 && (
          <div>
            <div className="mb-4 max-w-xl">
              <SelectField
                label="Type de la source"
                id="type"
                options={[
                  { value: "json", label: "JSON" },
                  { value: "csv", label: "CSV" },
                ]}
                value={type}
                onChange={(e) => setType(e.target.value as "json" | "csv")}
                error={!type ? "Le type est requis" : ""}
              />
              {type === "json" && (
                <>
                  <InputField
                    label="Endpoint (URL JSON)"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    error={columnsError}
                  />
                  <span className="text-sm text-gray-500 mb-4">
                    Entrez l'URL d'un endpoint qui retourne des données au
                    format JSON.
                  </span>
                </>
              )}
              {type === "csv" && (
                <>
                  <div className="mb-2 flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="csvOrigin"
                        value="url"
                        checked={csvOrigin === "url"}
                        onChange={() => setCsvOrigin("url")}
                      />
                      <span>URL distante</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="csvOrigin"
                        value="upload"
                        checked={csvOrigin === "upload"}
                        onChange={() => setCsvOrigin("upload")}
                      />
                      <span>Fichier à uploader</span>
                    </label>
                  </div>
                  {csvOrigin === "url" && (
                    <InputField
                      label="Endpoint (URL CSV)"
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value)}
                    />
                  )}
                  {csvOrigin === "upload" && (
                    <div className="mb-2">
                      <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                        Fichier CSV à uploader
                      </label>
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={(e) =>
                          setCsvFile(e.target.files?.[0] || null)
                        }
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
                        ref={fileInputRef}
                      />
                      {csvFile && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {csvFile.name}
                          </span>
                          <button
                            type="button"
                            className="text-xs text-red-500 hover:underline focus:outline-none"
                            onClick={() => {
                              setCsvFile(null);
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                            }}
                          >
                            Retirer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <span className="text-sm text-gray-500 mb-4">
                    Fournissez soit l'URL d'un CSV distant, soit un fichier à
                    uploader.
                  </span>
                </>
              )}
            </div>
            <div className=" w-max">
              <Button
                className="px-8"
                color="indigo"
                size="md"
                loading={columnsLoading}
                onClick={handleNext}
                disabled={
                  type === "json"
                    ? !endpoint
                    : type === "csv" && csvOrigin === "url"
                    ? !endpoint
                    : type === "csv" && csvOrigin === "upload"
                    ? !csvFile
                    : true
                }
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
              {/* Sélecteur pour le champ timestampField : uniquement les colonnes de type datetime */}
              <div className="mt-4">
                <SelectField
                  label="Champ temporel pour le filtrage (optionnel)"
                  id="timestampField"
                  value={timestampField}
                  onChange={(e) => setTimestampField(e.target.value)}
                  options={[
                    { value: "", label: "Aucun (pas de filtrage temporel)" },
                    ...columns
                      .filter((col) => col.type === "datetime")
                      .map((col) => ({ value: col.name, label: col.name })),
                  ]}
                />
                <span className="text-xs text-gray-500">
                  Seules les colonnes de type datetime sont proposées.
                </span>
              </div>
              <Collapsible
                title="Aperçu des données :"
                defaultOpen={false}
                className="mt-4"
              >
                <SyntaxHighlighter language="json" style={okaidia}>
                  {JSON.stringify(dataPreview, null, 2)}
                </SyntaxHighlighter>
              </Collapsible>
            </div>
            <div className="flex gap-4 w-max">
              <Button
                className="px-8"
                color="gray"
                size="md"
                onClick={() => setStep(1)}
                variant="outline"
              >
                Retour
              </Button>
              <Button
                className="px-8"
                color="indigo"
                size="md"
                onClick={() => setShowModal(true)}
              >
                Valider
              </Button>
            </div>
          </>
        )}
        {/* Modal de confirmation */}
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="Confirmer l'ajout de la source"
          size="md"
        >
          <div className="space-y-4">
            <InputField
              label="Nom de la source"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!name ? "Le nom est requis" : ""}
              autoFocus
            />
            <div>
              <div className="font-semibold">Type :</div>
              <div className="capitalize">{type}</div>
            </div>
            {type === "json" && (
              <div>
                <div className="font-semibold">Endpoint JSON :</div>
                <div>
                  {endpoint || (
                    <span className="text-gray-400">(non renseigné)</span>
                  )}
                </div>
              </div>
            )}
            {type === "csv" && csvOrigin === "url" && (
              <div>
                <div className="font-semibold">Endpoint CSV :</div>
                <div>
                  {endpoint || (
                    <span className="text-gray-400">(non renseigné)</span>
                  )}
                </div>
              </div>
            )}
            {type === "csv" && csvOrigin === "upload" && (
              <div>
                <div className="font-semibold">Fichier CSV :</div>
                <div>
                  {csvFile?.name || (
                    <span className="text-gray-400">(aucun fichier)</span>
                  )}
                </div>
              </div>
            )}
            {globalError && (
              <div className="text-red-500 text-sm mb-2">{globalError}</div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              color="gray"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Annuler
            </Button>
            <Button
              color="indigo"
              onClick={() => {
                handleCreate();
              }}
              disabled={!name || !type}
              loading={loading}
            >
              Ajouter
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}
