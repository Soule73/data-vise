import { useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import InputField from "@/presentation/components/forms/InputField";
import SelectField from "@/presentation/components/SelectField";
import FileField from "@/presentation/components/forms/FileField";
import Button from "@/presentation/components/forms/Button";
import Modal from "@/presentation/components/Modal";
import Collapsible from "@/presentation/components/Collapsible";
import Table from "@/presentation/components/Table";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { DataSourceFormType } from "@/core/hooks/datasource/useDataSourceForm";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Radio, RadioGroup } from "@headlessui/react";

interface SourceFormProps {
  // Méthodes react-hook-form
  methods: UseFormReturn<DataSourceFormType>;
  step: number;
  setStep: (s: number) => void;
  csvOrigin: "url" | "upload";
  setCsvOrigin: (v: "url" | "upload") => void;
  csvFile: File | null;
  setCsvFile: (f: File | null) => void;
  columns: { name: string; type: string }[];
  columnsLoading: boolean;
  columnsError: string;
  dataPreview: Record<string, unknown>[];
  showModal: boolean;
  setShowModal: (b: boolean) => void;
  globalError: string;
  handleNext: () => void;
  onSubmit: (data: DataSourceFormType) => void;
  isEdit?: boolean;
  filePath?: string | null;
  setFilePath?: (v: string | null) => void;
  showFileField?: boolean;
  setShowFileField?: (v: boolean) => void;
}

const SourceForm: React.FC<SourceFormProps> = ({
  methods,
  step,
  setStep,
  csvOrigin,
  setCsvOrigin,
  csvFile,
  setCsvFile,
  columns,
  columnsLoading,
  columnsError,
  dataPreview,
  showModal,
  setShowModal,
  globalError,
  handleNext,
  onSubmit,
  isEdit = false,
  filePath,
  setFilePath,
  showFileField = false,
  setShowFileField,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, setValue, getValues, formState, watch } =
    methods;
  const { errors, isSubmitting } = formState;
  const values = getValues();
  const watchedType = watch("type");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {step === 1 && (
        <div className="mb-4 max-w-xl">
          <SelectField
            label="Type de la source"
            id="type"
            options={[
              { value: "json", label: "JSON" },
              { value: "csv", label: "CSV" },
            ]}
            value={watchedType}
            onChange={(e) => setValue("type", e.target.value as "json" | "csv")}
            error={errors.type?.message}
          />
          {/* Section fichier CSV (édition ou création) */}
          {watchedType === "csv" &&
            csvOrigin === "upload" &&
            isEdit &&
            filePath &&
            !showFileField && (
              <div className="my-2 rounded p-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <div>
                  <span className="font-medium">Fichier :</span>
                  <span className="ml-2 font-mono text-xs break-all">
                    {filePath.split("/").pop()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  color="red"
                  type="button"
                  className="ml-4 w-max border-none !bg-transparent text-red-600 hover:underline text-sm"
                  onClick={() => {
                    setFilePath && setFilePath(null);
                    setCsvFile(null);
                    setValue("endpoint", "");
                    setStep(1);
                    // Affiche FileField pour uploader un nouveau fichier
                    if (typeof setCsvOrigin === "function")
                      setCsvOrigin("upload");
                    if (typeof setShowFileField === "function")
                      setShowFileField(true);
                  }}
                >
                  Retirer ce fichier
                </Button>
              </div>
            )}
          {/* Un seul FileField, affiché si upload (création OU édition après retrait) */}
          {watchedType === "csv" && csvOrigin === "upload" && !filePath && (
            <FileField
              label="Fichier CSV à importer"
              id="csvFile"
              name="csvFile"
              accept=".csv"
              required={!isEdit}
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              ref={fileInputRef}
            />
          )}
          {/* Affichage du champ endpoint si CSV url */}
          {watchedType === "csv" && csvOrigin === "url" && (
            <InputField
              label="Endpoint (URL CSV)"
              {...register("endpoint")}
              error={errors.endpoint?.message}
            />
          )}
          {/* Correction : si édition + fichier existant, on masque TOUT FileField même dans la section générique plus bas */}
          {watchedType === "csv" &&
            csvOrigin === "upload" &&
            isEdit &&
            filePath &&
            null}
          {watchedType === "json" && (
            <>
              <InputField
                label="Endpoint (URL JSON)"
                {...register("endpoint")}
                error={columnsError || errors.endpoint?.message}
              />
              <span className="text-sm text-gray-500 mb-4">
                Entrez l'URL d'un endpoint qui retourne des données au format
                JSON.
              </span>
            </>
          )}
          {watchedType === "csv" && (
            <>
              <div className="my-2">
                <RadioGroup
                  value={csvOrigin}
                  onChange={setCsvOrigin}
                  className="flex gap-4"
                >
                  <Radio value="url">
                    {({ checked }) => (
                      <span
                        className={[
                          "inline-flex items-center p-2 cursor-pointer rounded border",
                          checked
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900"
                            : "border-slate-300 bg-white dark:bg-gray-900",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "size-5 rounded-full border border-slate-300 flex items-center justify-center transition-colors",
                            checked
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-white dark:bg-gray-900",
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          {checked && (
                            <span className="block w-3 h-3 rounded-full bg-white" />
                          )}
                        </span>
                        <span className="select-none text-sm font-medium text-gray-900 dark:text-gray-300 ml-2">
                          URL distante
                        </span>
                      </span>
                    )}
                  </Radio>
                  <Radio value="upload">
                    {({ checked }) => (
                      <span
                        className={[
                          "inline-flex items-center p-2 cursor-pointer rounded border",
                          checked
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900"
                            : "border-slate-300 bg-white dark:bg-gray-900",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "size-5 rounded-full border border-slate-300 flex items-center justify-center transition-colors",
                            checked
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-white dark:bg-gray-900",
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          {checked && (
                            <span className="block w-3 h-3 rounded-full bg-white" />
                          )}
                        </span>
                        <span className="select-none text-sm font-medium text-gray-900 dark:text-gray-300 ml-2">
                          Fichier à uploader
                        </span>
                      </span>
                    )}
                  </Radio>
                </RadioGroup>
              </div>
              {csvOrigin === "url" && (
                <InputField
                  label="Endpoint (URL CSV)"
                  {...register("endpoint")}
                  error={errors.endpoint?.message}
                />
              )}
              {csvOrigin === "upload" && (
                <div className="mb-2">
                  {/* SUPPRIMÉ : FileField ici pour éviter le doublon en mode édition */}
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
          {/* Méthode HTTP et Authentification pour endpoint */}
          {(watchedType === "json" ||
            (watchedType === "csv" && csvOrigin === "url")) && (
            <>
              <div className="mb-2">
                <SelectField
                  label="Méthode HTTP"
                  id="httpMethod"
                  options={[
                    { value: "GET", label: "GET" },
                    { value: "POST", label: "POST" },
                  ]}
                  {...register("httpMethod")}
                  value={watch("httpMethod")}
                  onChange={(e) =>
                    setValue("httpMethod", e.target.value as "GET" | "POST")
                  }
                  error={errors.httpMethod?.message}
                />
              </div>
              <div className="mb-2">
                <SelectField
                  label="Authentification"
                  id="authType"
                  options={[
                    { value: "none", label: "Aucune" },
                    { value: "bearer", label: "Bearer Token" },
                    { value: "apiKey", label: "API Key" },
                    { value: "basic", label: "Basic Auth" },
                  ]}
                  {...register("authType")}
                  value={watch("authType")}
                  onChange={(e) =>
                    setValue(
                      "authType",
                      e.target.value as "none" | "bearer" | "apiKey" | "basic"
                    )
                  }
                  error={errors.authType?.message}
                />
              </div>
              {/* Champs dynamiques selon authType */}
              {watch("authType") === "bearer" && (
                <InputField
                  label="Token Bearer"
                  value={values.authConfig.token || ""}
                  onChange={(e) =>
                    setValue("authConfig", {
                      ...values.authConfig,
                      token: e.target.value,
                    })
                  }
                />
              )}
              {watch("authType") === "apiKey" && (
                <>
                  <InputField
                    label="Clé API"
                    value={values.authConfig.apiKey || ""}
                    onChange={(e) =>
                      setValue("authConfig", {
                        ...values.authConfig,
                        apiKey: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Nom du header (optionnel)"
                    value={values.authConfig.headerName || ""}
                    onChange={(e) =>
                      setValue("authConfig", {
                        ...values.authConfig,
                        headerName: e.target.value,
                      })
                    }
                    placeholder="x-api-key"
                  />
                </>
              )}
              {watch("authType") === "basic" && (
                <>
                  <InputField
                    label="Nom d'utilisateur"
                    value={values.authConfig.username || ""}
                    onChange={(e) =>
                      setValue("authConfig", {
                        ...values.authConfig,
                        username: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Mot de passe"
                    type="password"
                    value={values.authConfig.password || ""}
                    onChange={(e) =>
                      setValue("authConfig", {
                        ...values.authConfig,
                        password: e.target.value,
                      })
                    }
                  />
                </>
              )}
            </>
          )}
          {/* BOUTON SUIVANT */}
          <div className="mt-6 flex">
            <Button
              type="button"
              color="indigo"
              className=" w-max flex items-center"
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (!formState.isValid &&
                  !(
                    isEdit &&
                    watchedType === "csv" &&
                    csvOrigin === "upload" &&
                    filePath
                  ) &&
                  !(
                    isEdit &&
                    watchedType === "csv" &&
                    csvOrigin === "url" &&
                    values.endpoint
                  ))
              }
            >
              {columnsLoading && (
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              )}
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
                {...register("timestampField")}
                value={watch("timestampField")}
                onChange={(e) => setValue("timestampField", e.target.value)}
                options={[
                  { value: "", label: "Aucun (pas de filtrage temporel)" },
                  ...columns
                    .filter((col) => col.type === "datetime")
                    .map((col) => ({ value: col.name, label: col.name })),
                ]}
                error={errors.timestampField?.message}
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
        title={
          isEdit
            ? "Confirmer la modification de la source"
            : "Confirmer l'ajout de la source"
        }
        size="md"
      >
        <div className="space-y-4">
          <InputField
            label="Nom de la source"
            {...register("name")}
            error={errors.name?.message}
            autoFocus
          />
          <div>
            <div className="font-semibold">Type :</div>
            <div className="capitalize">{values.type}</div>
          </div>
          {/* Récapitulatif HTTP/Auth si endpoint */}
          {(values.type === "json" ||
            (values.type === "csv" && csvOrigin === "url")) && (
            <div className="space-y-1">
              <div>
                <span className="font-semibold">Méthode HTTP :</span>{" "}
                {values.httpMethod}
              </div>
              <div>
                <span className="font-semibold">Authentification :</span>{" "}
                {values.authType === "none" ? "Aucune" : values.authType}
              </div>
              {values.authType === "bearer" && (
                <div>
                  <span className="font-semibold">Token :</span>{" "}
                  {values.authConfig.token ? "•••••" : "non renseigné"}
                </div>
              )}
              {values.authType === "apiKey" && (
                <>
                  <div>
                    <span className="font-semibold">Clé API :</span>{" "}
                    {values.authConfig.apiKey ? "•••••" : "non renseigné"}
                  </div>
                  <div>
                    <span className="font-semibold">Header :</span>{" "}
                    {values.authConfig.headerName || "x-api-key"}
                  </div>
                </>
              )}
              {values.authType === "basic" && (
                <>
                  <div>
                    <span className="font-semibold">Utilisateur :</span>{" "}
                    {values.authConfig.username || "non renseigné"}
                  </div>
                  <div>
                    <span className="font-semibold">Mot de passe :</span>{" "}
                    {values.authConfig.password ? "•••••" : "non renseigné"}
                  </div>
                </>
              )}
            </div>
          )}
          {values.type === "json" && (
            <div>
              <div className="font-semibold">Endpoint JSON :</div>
              <div>
                {values.endpoint || (
                  <span className="text-gray-400">(non renseigné)</span>
                )}
              </div>
            </div>
          )}
          {values.type === "csv" && csvOrigin === "url" && (
            <div>
              <div className="font-semibold">Endpoint CSV :</div>
              <div>
                {values.endpoint || (
                  <span className="text-gray-400">(non renseigné)</span>
                )}
              </div>
            </div>
          )}
          {values.type === "csv" && csvOrigin === "upload" && (
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
            onClick={handleSubmit(onSubmit)}
            disabled={!formState.isValid || isSubmitting}
            loading={isSubmitting}
          >
            {isEdit ? "Enregistrer" : "Ajouter"}
          </Button>
        </div>
      </Modal>
    </form>
  );
};

export default SourceForm;
