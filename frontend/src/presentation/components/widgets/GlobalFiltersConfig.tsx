import BaseFilterConfig from "./BaseFilterConfig";
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
    // Fonction pour créer un nouveau filtre global
    const createNewFilter = (columns: string[]): Filter => ({
        field: columns[0] || '',
        operator: 'equals',
        value: '',
    });

    return (
        <BaseFilterConfig<Filter>
            filters={filters}
            columns={columns}
            data={data}
            onFiltersChange={onFiltersChange}
            title="Filtres globaux"
            description="Aucun filtre global configuré. Les filtres globaux s'appliquent à tous les datasets."
            createNewFilter={createNewFilter}
            prefix="global-filter"
        />
    );
}
