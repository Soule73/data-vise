import BaseFilterConfig from "./BaseFilterConfig";
import type { DatasetFilter } from "@type/metric-bucket-types";

interface DatasetFiltersConfigProps {
    filters: DatasetFilter[];
    columns: string[];
    data?: Record<string, unknown>[]; // Données pour extraire les valeurs possibles
    onFiltersChange: (filters: DatasetFilter[]) => void;
    datasetIndex: number;
}

export default function DatasetFiltersConfig({
    filters = [],
    columns,
    data = [],
    onFiltersChange,
    datasetIndex,
}: DatasetFiltersConfigProps) {
    // Fonction pour créer un nouveau filtre de dataset
    const createNewFilter = (columns: string[]): DatasetFilter => ({
        field: columns[0] || '',
        value: '',
        operator: 'equals',
    });

    return (
        <BaseFilterConfig<DatasetFilter>
            filters={filters}
            columns={columns}
            data={data}
            onFiltersChange={onFiltersChange}
            title={`Filtres Dataset ${datasetIndex + 1}`}
            description="Aucun filtre configuré pour ce dataset. Les filtres de dataset s'appliquent uniquement à ce dataset spécifique."
            createNewFilter={createNewFilter}
            prefix={`filter-${datasetIndex}`}
            className="mt-3"
        />
    );
}
