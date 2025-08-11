import type { GlobalFiltersConfigProps } from "@type/widgetTypes";
import BaseFilterConfig from "@components/widgets/BaseFilterConfig";
import type { Filter } from "@type/visualization";


export default function GlobalFiltersConfig({
    filters = [],
    columns,
    data = [],
    onFiltersChange,
}: GlobalFiltersConfigProps) {

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
