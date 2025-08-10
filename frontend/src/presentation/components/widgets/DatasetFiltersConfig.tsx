import SelectField from "@components/SelectField";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import type { DatasetFilter } from "@type/metric-bucket-types";

interface DatasetFiltersConfigProps {
    filters: DatasetFilter[];
    columns: string[];
    data?: Record<string, unknown>[]; // Données pour extraire les valeurs possibles
    onFiltersChange: (filters: DatasetFilter[]) => void;
    datasetIndex: number;
}

const OPERATOR_OPTIONS = [
    { value: 'equals', label: 'Égal à' },
    { value: 'not_equals', label: 'Différent de' },
    { value: 'contains', label: 'Contient' },
    { value: 'greater_than', label: 'Supérieur à' },
    { value: 'less_than', label: 'Inférieur à' },
];

export default function DatasetFiltersConfig({
    filters = [],
    columns,
    data = [],
    onFiltersChange,
    datasetIndex,
}: DatasetFiltersConfigProps) {
    const handleAddFilter = () => {
        const newFilter: DatasetFilter = {
            field: columns[0] || '',
            value: '',
            operator: 'equals',
        };
        onFiltersChange([...filters, newFilter]);
    };

    const handleRemoveFilter = (index: number) => {
        const newFilters = filters.filter((_, i) => i !== index);
        onFiltersChange(newFilters);
    };

    const handleFilterChange = (index: number, field: keyof DatasetFilter, value: string) => {
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
        <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center">
                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Filtres du dataset {datasetIndex + 1}
                </h5>
                <button
                    type="button"
                    onClick={handleAddFilter}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                    <PlusCircleIcon className="w-3 h-3" />
                    Ajouter un filtre
                </button>
            </div>

            {filters.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    Aucun filtre configuré pour ce dataset
                </p>
            ) : (
                <div className="space-y-2">
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <SelectField
                                    label="Champ"
                                    value={filter.field}
                                    onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                                    options={columns.map((col) => ({ value: col, label: col }))}
                                    name={`filter-field-${datasetIndex}-${index}`}
                                    id={`filter-field-${datasetIndex}-${index}`}
                                />

                                <SelectField
                                    label="Opérateur"
                                    value={filter.operator || 'equals'}
                                    onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                                    options={OPERATOR_OPTIONS}
                                    name={`filter-operator-${datasetIndex}-${index}`}
                                    id={`filter-operator-${datasetIndex}-${index}`}
                                />

                                <SelectField
                                    label="Valeur"
                                    value={filter.value || ""}
                                    onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                    options={getFieldValues(filter.field)}
                                    name={`filter-value-${datasetIndex}-${index}`}
                                    id={`filter-value-${datasetIndex}-${index}`}
                                    disabled={!filter.field}
                                />

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFilter(index)}
                                        className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
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
