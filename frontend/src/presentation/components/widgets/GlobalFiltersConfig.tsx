import SelectField from "@components/SelectField";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import type { Filter } from "@type/visualization";

interface GlobalFiltersConfigProps {
    filters: Filter[];
    columns: string[];
    data?: Record<string, unknown>[]; // Données pour extraire les valeurs possibles
    onFiltersChange: (filters: Filter[]) => void;
}

export default function GlobalFiltersConfig({
    filters = [],
    columns,
    data = [],
    onFiltersChange,
}: GlobalFiltersConfigProps) {
    const handleAddFilter = () => {
        const newFilter: Filter = {
            field: columns[0] || '',
            value: '',
        };
        onFiltersChange([...filters, newFilter]);
    };

    const handleRemoveFilter = (index: number) => {
        const newFilters = filters.filter((_, i) => i !== index);
        onFiltersChange(newFilters);
    };

    const handleFilterChange = (index: number, field: keyof Filter, value: string | number) => {
        const newFilters = [...filters];
        newFilters[index] = { ...newFilters[index], [field]: value };
        // Si on change le champ, réinitialiser la valeur
        if (field === 'field') {
            newFilters[index].value = '';
        }
        onFiltersChange(newFilters);
    };

    // Fonction pour obtenir les valeurs possibles pour un champ donné
    const getFieldValues = (fieldName: string) => {
        if (!fieldName || !data.length) {
            return [{ value: "", label: "-- Choisir --" }];
        }

        const uniqueValues = Array.from(
            new Set(
                data
                    .map((row) => row[fieldName])
                    .filter((v) => v !== undefined && v !== null && v !== "")
            )
        );

        return [
            { value: "", label: "-- Toutes --" },
            ...uniqueValues.map((v) => ({ value: String(v), label: String(v) }))
        ];
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Filtres globaux
                </h3>
                <button
                    type="button"
                    onClick={handleAddFilter}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                    <PlusCircleIcon className="w-4 h-4" />
                    Ajouter un filtre
                </button>
            </div>

            {filters.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Aucun filtre global configuré. Les filtres globaux s'appliquent à tous les datasets.
                </p>
            ) : (
                <div className="space-y-3">
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <SelectField
                                    label="Champ"
                                    value={filter.field}
                                    onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                                    options={[
                                        { value: "", label: "-- Aucun --" },
                                        ...columns.map((col) => ({ value: col, label: col }))
                                    ]}
                                    name={`global-filter-field-${index}`}
                                    id={`global-filter-field-${index}`}
                                />

                                <SelectField
                                    label="Valeur"
                                    value={filter.value || ""}
                                    onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                    options={getFieldValues(filter.field)}
                                    name={`global-filter-value-${index}`}
                                    id={`global-filter-value-${index}`}
                                    disabled={!filter.field}
                                />

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFilter(index)}
                                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                        title="Supprimer ce filtre"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
