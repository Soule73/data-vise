import SelectField from "@components/SelectField";
import InputField from "@components/forms/InputField";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import type { Filter } from "@type/visualization";
import type { DatasetFilter } from "@type/metric-bucket-types";

// Interface commune pour les propriétés partagées
interface BaseFilter {
    field: string;
    value: string | number | readonly string[] | undefined;
    operator?: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'starts_with' | 'ends_with';
}

// Type union pour supporter les deux types de filtres
type FilterType = Filter | DatasetFilter;

interface BaseFilterConfigProps<T extends FilterType & BaseFilter> {
    filters: T[];
    columns: string[];
    data?: Record<string, unknown>[];
    onFiltersChange: (filters: T[]) => void;
    title: string;
    description: string;
    createNewFilter: (columns: string[]) => T;
    // Props optionnelles pour customisation
    prefix?: string; // Préfixe pour les IDs et noms des champs
    className?: string;
}

// Options pour les opérateurs (communes aux deux types)
const OPERATOR_OPTIONS = [
    { value: "equals", label: "Égal à" },
    { value: "not_equals", label: "Différent de" },
    { value: "contains", label: "Contient" },
    { value: "not_contains", label: "Ne contient pas" },
    { value: "greater_than", label: "Supérieur à" },
    { value: "less_than", label: "Inférieur à" },
    { value: "greater_equal", label: "Supérieur ou égal" },
    { value: "less_equal", label: "Inférieur ou égal" },
    { value: "starts_with", label: "Commence par" },
    { value: "ends_with", label: "Finit par" },
];

export default function BaseFilterConfig<T extends FilterType & BaseFilter>({
    filters = [],
    columns,
    data = [],
    onFiltersChange,
    title,
    description,
    createNewFilter,
    prefix = "filter",
    className = "",
}: BaseFilterConfigProps<T>) {
    const handleAddFilter = () => {
        const newFilter = createNewFilter(columns);
        onFiltersChange([...filters, newFilter]);
    };

    const handleRemoveFilter = (index: number) => {
        const newFilters = filters.filter((_, i) => i !== index);
        onFiltersChange(newFilters);
    };

    const handleFilterChange = (index: number, field: keyof T, value: string | number) => {
        const newFilters = [...filters];
        newFilters[index] = { ...newFilters[index], [field]: value };

        // Si on change le champ ou l'opérateur, réinitialiser la valeur
        if (field === 'field' || field === 'operator') {
            newFilters[index] = { ...newFilters[index], value: '' };
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
            { value: "", label: "- Toutes -" },
            ...uniqueValues.map((v) => ({ value: String(v), label: String(v) }))
        ];
    };

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {title}
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
                    {description}
                </p>
            ) : (
                <div className="space-y-3">
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 flex dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <SelectField
                                    label="Champ"
                                    textSize="sm"
                                    className=" !max-w-max"
                                    value={filter.field}
                                    onChange={(e) => handleFilterChange(index, 'field' as keyof T, e.target.value)}
                                    options={[
                                        { value: "", label: "-- Aucun --" },
                                        ...columns.map((col) => ({ value: col, label: col }))
                                    ]}
                                    name={`${prefix}-field-${index}`}
                                    id={`${prefix}-field-${index}`}
                                />

                                <SelectField
                                    label="Opérateur"
                                    textSize="sm"
                                    value={filter.operator || 'equals'}
                                    onChange={(e) => handleFilterChange(index, 'operator' as keyof T, e.target.value)}
                                    options={OPERATOR_OPTIONS}
                                    name={`${prefix}-operator-${index}`}
                                    id={`${prefix}-operator-${index}`}
                                    disabled={!filter.field}
                                />

                                {/* Champ valeur : SelectField si opérateur = equals, sinon InputField */}
                                {(filter.operator === 'equals' || !filter.operator) ? (
                                    <SelectField
                                        label="Valeur"
                                        textSize="sm"
                                        value={filter.value || ""}
                                        onChange={(e) => handleFilterChange(index, 'value' as keyof T, e.target.value)}
                                        options={getFieldValues(filter.field)}
                                        name={`${prefix}-value-${index}`}
                                        id={`${prefix}-value-${index}`}
                                        disabled={!filter.field}
                                    />
                                ) : (
                                    <InputField
                                        label="Valeur"
                                        textSize="sm"
                                        value={filter.value || ""}
                                        onChange={(e) => handleFilterChange(index, 'value' as keyof T, e.target.value)}
                                        name={`${prefix}-value-${index}`}
                                        id={`${prefix}-value-${index}`}
                                        disabled={!filter.field}
                                        placeholder="Saisir la valeur..."
                                    />
                                )}

                            </div>
                            <div className="flex items-end w-max">
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
                    ))}
                </div>
            )}
        </div>
    );
}
