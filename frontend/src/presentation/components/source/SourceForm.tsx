import { useRef } from "react";
import InputField from "@components/forms/InputField";
import SelectField from "@components/SelectField";
import FileField from "@components/forms/FileField";
import Button from "@components/forms/Button";
import Modal from "@components/Modal";
import Collapsible from "@components/Collapsible";
import Table from "@components/Table";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Radio, RadioGroup } from "@headlessui/react";
import TextareaField from "@components/forms/TextareaField";
import type { SourceFormProps } from "@type/dataSource";

const SourceForm: React.FC<SourceFormProps> = ({
  form,
  setFormField,
  step,
  setStep,
  csvOrigin,
  setCsvOrigin,
  csvFile,
  setCsvFile,
  columns,
  columnsLoading,
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
  fieldErrors = {},
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const values = form;
  const watchedType = values.type;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {step === 1 && (
        <>
          <div className="mb-4">
            <InputField
              label="Nom"
              value={form.name}
              onChange={(e) => setFormField("name", e.target.value)}
              required
            />
            {fieldErrors.name && (
              <div className="text-red-500 text-xs mt-1">{fieldErrors.name}</div>
            )}
          </div>
          <div className="mb-4">
            <SelectField
              label="Type"
              id="type"
              options={[
                { value: "json", label: "JSON distant" },
                { value: "csv", label: "CSV distant ou upload" },
                { value: "elasticsearch", label: "Elasticsearch" },
              ]}
              value={watchedType}
              onChange={(e) => setFormField("type", e.target.value)}
              required
            />
            {fieldErrors.type && (
              <div className="text-red-500 text-xs mt-1">{fieldErrors.type}</div>
            )}
          </div>
          {/* Section spécifique Elasticsearch */}
          {watchedType === "elasticsearch" && (
            <div className="space-y-4 border rounded-md p-4 bg-gray-50 dark:bg-gray-800 mt-4 border-gray-200 dark:border-gray-700">
              <InputField
                label="Endpoint Elasticsearch"
                value={form.endpoint}
                onChange={(e) => setFormField("endpoint", e.target.value)}
                placeholder="https://mon-es:9200"
                required
              />
              {fieldErrors.endpoint && (
                <div className="text-red-500 text-xs mt-1">{fieldErrors.endpoint}</div>
              )}
              <InputField
                label="Index Elasticsearch"
                value={form.esIndex}
                onChange={(e) => setFormField("esIndex", e.target.value)}
                placeholder="nom-de-mon-index"
                required
              />
              {fieldErrors.esIndex && (
                <div className="text-red-500 text-xs mt-1">{fieldErrors.esIndex}</div>
              )}
              <TextareaField
                label="Requête Elasticsearch (JSON)"
                value={form.esQuery || ""}
                onChange={(e) => setFormField("esQuery", e.target.value)}
                placeholder={`{"query": { "match_all": {} }}`}
                rows={4}
              />
            </div>
          )}
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

                    if (setFilePath) setFilePath(null);
                    setCsvFile(null);
                    setFormField("endpoint", "");
                    setStep(1);
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
            <>
              <InputField
                label="Endpoint (URL CSV)"
                value={form.endpoint}
                onChange={(e) => setFormField("endpoint", e.target.value)}
              />
              {fieldErrors.endpoint && (
                <div className="text-red-500 text-xs mt-1">{fieldErrors.endpoint}</div>
              )}
            </>
          )}
          {watchedType === "csv" &&
            csvOrigin === "upload" &&
            isEdit &&
            filePath &&
            null}
          {watchedType === "json" && (
            <>
              <InputField
                label="Endpoint (URL JSON)"
                value={form.endpoint}
                onChange={(e) => setFormField("endpoint", e.target.value)}
              />
              {fieldErrors.endpoint && (
                <div className="text-red-500 text-xs mt-1">{fieldErrors.endpoint}</div>
              )}
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
                  value={form.endpoint}
                  onChange={(e) => setFormField("endpoint", e.target.value)}
                />
              )}
              {csvOrigin === "upload" && (
                <div className="mb-2">
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
                    value={values.httpMethod}
                    onChange={(e) =>
                      setFormField("httpMethod", e.target.value as "GET" | "POST")
                    }
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
                    value={values.authType}
                    onChange={(e) =>
                      setFormField(
                        "authType",
                        e.target.value as "none" | "bearer" | "apiKey" | "basic"
                      )
                    }
                  />
                </div>
                {/* Champs selon authType */}
                {values.authType === "bearer" && (
                  <>
                    <InputField
                      label="Token Bearer"
                      value={values?.authConfig?.token}
                      onChange={(e) =>
                        setFormField("authConfig.token", e.target.value)
                      }
                    />
                    {fieldErrors["authConfig.token"] && (
                      <div className="text-red-500 text-xs mt-1">{fieldErrors["authConfig.token"]}</div>
                    )}
                  </>
                )}
                {values.authType === "apiKey" && (
                  <>
                    <InputField
                      label="Clé API"
                      value={values?.authConfig?.apiKey}
                      onChange={(e) =>
                        setFormField("authConfig.apiKey", e.target.value)
                      }
                    />
                    {fieldErrors["authConfig.apiKey"] && (
                      <div className="text-red-500 text-xs mt-1">{fieldErrors["authConfig.apiKey"]}</div>
                    )}
                    <InputField
                      label="Nom du header (optionnel)"
                      value={values?.authConfig?.headerName}
                      onChange={(e) =>
                        setFormField("authConfig.headerName", e.target.value)
                      }
                      placeholder="x-api-key"
                    />
                  </>
                )}
                {values.authType === "basic" && (
                  <>
                    <InputField
                      label="Nom d'utilisateur"
                      value={values?.authConfig?.username}
                      onChange={(e) =>
                        setFormField("authConfig.username", e.target.value)
                      }
                    />
                    {fieldErrors["authConfig.username"] && (
                      <div className="text-red-500 text-xs mt-1">{fieldErrors["authConfig.username"]}</div>
                    )}
                    <InputField
                      label="Mot de passe"
                      type="password"
                      value={values?.authConfig?.password}
                      onChange={(e) =>
                        setFormField("authConfig.password", e.target.value)
                      }
                    />
                    {fieldErrors["authConfig.password"] && (
                      <div className="text-red-500 text-xs mt-1">{fieldErrors["authConfig.password"]}</div>
                    )}
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
                !form.name ||
                (watchedType === "csv" &&
                  csvOrigin === "upload" &&
                  !isEdit &&
                  !csvFile) ||
                (watchedType === "csv" &&
                  csvOrigin === "upload" &&
                  isEdit &&
                  !filePath &&
                  !csvFile) ||
                (watchedType === "csv" &&
                  csvOrigin === "url" &&
                  !form.endpoint) ||
                (watchedType === "json" && !form.endpoint) ||
                (watchedType === "elasticsearch" &&
                  (!form.endpoint || !form.esIndex))
              }
            >
              {columnsLoading && (
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              )}
              Suivant
            </Button>
          </div>
        </>
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
                value={values.timestampField}
                onChange={(e) => setFormField("timestampField", e.target.value)}
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
            value={form.name}
            onChange={(e) => setFormField("name", e.target.value)}
            autoFocus
          />
          <div>
            <div className="font-semibold dark:text-gray-300">Type :</div>
            <div className="capitalize dark:text-gray-300">{values.type}</div>
          </div>
          {/* Récapitulatif HTTP/Auth si endpoint */}
          {(values.type === "json" ||
            (values.type === "csv" && csvOrigin === "url")) && (
              <div className="space-y-1 dark:text-gray-300">
                <div>
                  <span className="font-semibold dark:text-gray-300">Méthode HTTP :</span>{" "}
                  {values.httpMethod}
                </div>
                <div>
                  <span className="font-semibold dark:text-gray-300">Authentification :</span>{" "}
                  {values.authType === "none" ? "Aucune" : values.authType}
                </div>
                {values.authType === "bearer" && (
                  <div>
                    <span className="font-semibold dark:text-gray-300">Token :</span>{" "}
                    {values?.authConfig?.token ? "•••••" : "non renseigné"}
                  </div>
                )}
                {values.authType === "apiKey" && (
                  <>
                    <div>
                      <span className="font-semibold dark:text-gray-300">Clé API :</span>{" "}
                      {values?.authConfig?.apiKey ? "•••••" : "non renseigné"}
                    </div>
                    <div>
                      <span className="font-semibold dark:text-gray-300">Header :</span>{" "}
                      {values?.authConfig?.headerName || "x-api-key"}
                    </div>
                  </>
                )}
                {values.authType === "basic" && (
                  <>
                    <div>
                      <span className="font-semibold dark:text-gray-300">Utilisateur :</span>{" "}
                      {values?.authConfig?.username || "non renseigné"}
                    </div>
                    <div>
                      <span className="font-semibold dark:text-gray-300">Mot de passe :</span>{" "}
                      {values?.authConfig?.password ? "•••••" : "non renseigné"}
                    </div>
                  </>
                )}
              </div>
            )}
          {values.type === "json" && (
            <div>
              <div className="font-semibold dark:text-gray-300">Endpoint JSON :</div>
              <div className="text-gray-800 dark:text-gray-300">
                {values.endpoint || (
                  <span className="text-gray-400 ">(non renseigné)</span>
                )}
              </div>
            </div>
          )}
          {values.type === "csv" && csvOrigin === "url" && (
            <div>
              <div className="font-semibold dark:text-gray-300">Endpoint CSV :</div>
              <div>
                {values.endpoint || (
                  <span className="text-gray-400 dark:text-gray-300">(non renseigné)</span>
                )}
              </div>
            </div>
          )}
          {values.type === "csv" && csvOrigin === "upload" && (
            <div>
              <div className="font-semibold">Fichier CSV :</div>
              <div>
                {csvFile?.name || (
                  <span className="text-gray-400 dark:text-gray-300">(aucun fichier)</span>
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
          <Button color="indigo" onClick={() => onSubmit(form)}>
            {isEdit ? "Enregistrer" : "Ajouter"}
          </Button>
        </div>
      </Modal>
    </form>
  );
};

export default SourceForm;
