import { useWidgetCreateForm } from '@/hooks/useWidgetCreateForm';
import { WIDGETS, WIDGET_CONFIG_FIELDS } from '@/components/widgets';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import ColorField from '@/components/ColorField';
import SelectField from '@/components/SelectField';
import CheckboxField from '@/components/CheckboxField';

export default function WidgetCreatePage() {
  const {
    step,
    setStep,
    type,
    setType,
    sourceId,
    setSourceId,
    columns,
    dataPreview,
    config,
    title,
    setTitle,
    loading,
    error,
    loadSourceColumns,
    handleConfigChange,
    createMutation,
    sources,
  } = useWidgetCreateForm();

  const WidgetComponent = WIDGETS[type].component;

  return (
    <>
    <div className="flex items-center justify-between">
      <h1 className="md:text-xl font-bold mb-2">Configurer la visualisation</h1>
    </div>
    <div className=" bg-white dark:bg-gray-900 rounded shadow dark:border dark:border-gray-700
    lg:max-h-[80vh] lg:min-h-[80vh] lg:overflow-hidden
    relative flex flex-col h-full min-h-0 overflow-hidden
    
    ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-0
         deivide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700
        ">
          {/* Colonne gauche : aperçu (sticky à gauche sur lg+) */}
          <div className="order-1 md:order-1 md:col-span-1 lg:sticky lg:top-0 min-h-[70vh] h-full max-h-[70vh] overflow-y-auto flex flex-col p-1 md:p-4">
              <div className="font-semibold mb-2">
                Aperçu</div>
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <WidgetComponent data={dataPreview} config={{ ...config, title }} />
            </div>
          </div>
          {/* Colonne droite : champs dynamiques (step 1 ou 2) */}
          <div className="order-2 md:col-span-1 flex flex-col h-full min-h-0 bg-white dark:bg-gray-800 rounded md:p-4
          ">
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pb-20 config-scrollbar
            md:px-2
            ">
              {step === 1 ? (
                <>
                  <SelectField
                    label="Type de visualisation"
                    value={type}
                    onChange={e => setType(e.target.value as keyof typeof WIDGETS)}
                    name="type"
                    id="widget-type"
                    options={Object.entries(WIDGETS).map(([key, def]) => ({ value: key, label: def.label }))}
                  />
                  <SelectField
                    label="Source de données"
                    value={sourceId}
                    onChange={e => setSourceId(e.target.value)}
                    name="sourceId"
                    id="widget-source"
                    options={[
                      { value: '', label: 'Sélectionner une source' },
                      ...sources.map((s: any) => ({ value: s._id, label: s.name }))
                    ]}
                  />
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                </>
              ) : (
                <>
                  <InputField
                    label="Titre du widget"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    name="title"
                    id="widget-title"
                  />
                  {Object.entries(WIDGETS[type].configSchema).map(([field, typeStr]) => {
                    const meta = WIDGET_CONFIG_FIELDS[field] || {};
                    const label = meta.label || field;
                    const defaultValue = meta.default;
                    // Champ couleur natif si le nom du champ est 'color'
                    if (meta.inputType === 'color' || field === 'color') {
                      return (
                        <ColorField
                          key={field}
                          label={label}
                          value={config[field] ?? defaultValue ?? '#2563eb'}
                          onChange={val => handleConfigChange(field, val)}
                          name={field}
                          id={`widget-config-${field}`}
                        />
                      );
                    }
                    // Checkbox pour boolean
                    if (typeStr === 'boolean' || typeStr === 'boolean?' || meta.inputType === 'checkbox') {
                      return (
                        <CheckboxField
                          key={field}
                          label={label}
                          checked={config[field] ?? defaultValue ?? false}
                          onChange={val => handleConfigChange(field, val)}
                          name={field}
                          id={`widget-config-${field}`}
                        />
                      );
                    }
                    // Sélecteur de colonnes avec label personnalisé pour Table
                    if (meta.inputType === 'table-columns') {
                      return (
                        <div key={field} className="mb-2">
                          {/* <label className="block font-medium mb-1">{label}</label> */}
                          <div className="space-y-2">
                            {columns.map(col => {
                              const colConfig = (config.columns || []).find((c: any) => c.key === col) || { key: col, label: col };
                              const checked = (config.columns || []).some((c: any) => c.key === col);
                              return (
                                <div key={col} className="flex items-center gap-2 mb-1">
                                  <CheckboxField
                                    label={col}
                                    checked={checked}
                                    onChange={checkedVal => {
                                      let newCols = Array.isArray(config.columns) ? [...config.columns] : [];
                                      if (checkedVal) {
                                        newCols.push({ key: col, label: col });
                                      } else {
                                        newCols = newCols.filter((c: any) => c.key !== col);
                                      }
                                      handleConfigChange('columns', newCols);
                                    }}
                                    id={`col-check-${col}`}
                                    name={`col-check-${col}`}
                                  />
                                  {checked && (
                                    <InputField
                                      label={"Label pour " + col}
                                      value={colConfig.label}
                                      onChange={e => {
                                        const newCols = (config.columns || []).map((c: any) =>
                                          c.key === col ? { ...c, label: e.target.value } : c
                                        );
                                        handleConfigChange('columns', newCols);
                                      }}
                                      name={`col-label-${col}`}
                                      id={`col-label-${col}`}
                                      placeholder={`Label pour ${col}`}
                                      className="w-40"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    // Select multiple pour string[]
                    if (typeStr === 'string[]' || meta.inputType === 'multiselect') {
                      return (
                        <SelectField
                          key={field}
                          label={label}
                          multiple
                          value={config[field] || []}
                          onChange={e => handleConfigChange(field, Array.from(e.target.selectedOptions).map(o => o.value))}
                          name={field}
                          id={`widget-config-${field}`}
                          options={columns.map(col => ({ value: col, label: col }))}
                        />
                      );
                    }
                    // Input number
                    if (typeStr === 'number' || typeStr === 'number?' || meta.inputType === 'number') {
                      return (
                        <InputField
                          key={field}
                          label={label}
                          type="number"
                          value={config[field] ?? defaultValue ?? ''}
                          onChange={e => handleConfigChange(field, Number(e.target.value))}
                          name={field}
                          id={`widget-config-${field}`}
                        />
                      );
                    }
                    // Select pour string (sauf title, etc.)
                    if ((typeStr === 'string' || typeStr === 'string?') && meta.inputType === 'select' && field !== 'title') {
                      // Si le champ a des options prédéfinies (ex: legendPosition, titleAlign), on les utilise
                      if (meta.options) {
                        return (
                          <SelectField
                            key={field}
                            label={label}
                            value={config[field] || ''}
                            onChange={e => handleConfigChange(field, e.target.value)}
                            name={field}
                            id={`widget-config-${field}`}
                            options={[
                              { value: '', label: 'Sélectionner' },
                              ...meta.options.map((opt: any) =>
                                typeof opt === 'object' ? opt : { value: opt, label: String(opt) }
                              )
                            ]}
                          />
                        );
                      }
                      // Sinon, on propose les colonnes du dataset
                      return (
                        <SelectField
                          key={field}
                          label={label}
                          value={config[field] || ''}
                          onChange={e => handleConfigChange(field, e.target.value)}
                          name={field}
                          id={`widget-config-${field}`}
                          options={[{ value: '', label: 'Sélectionner' }, ...columns.map(col => ({ value: col, label: col }))]}
                        />
                      );
                    }
                    // Fallback : input texte
                    return (
                      <InputField
                        key={field}
                        label={label}
                        value={config[field] ?? defaultValue ?? ''}
                        onChange={e => handleConfigChange(field, e.target.value)}
                        name={field}
                        id={`widget-config-${field}`}
                      />
                    );
                  })}
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-900 pt-2 pb-1 z-10 border-t border-gray-200 dark:border-gray-700">
              {step === 1 ? (
                <Button color="indigo" onClick={loadSourceColumns} loading={loading}>Suivant</Button>
              ) : (
                <>
                  <Button color="gray" onClick={() => setStep(1)}>Retour</Button>
                  <Button color="indigo" onClick={() => createMutation.mutate()} loading={createMutation.isPending}>Enregistrer</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
