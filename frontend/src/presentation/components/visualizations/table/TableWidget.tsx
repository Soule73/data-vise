import { useTableWidgetLogic } from "@/core/hooks/visualizations/useTableWidgetVM";
import Table from "@/presentation/components/Table";
import type { TableWidgetConfig } from "@/core/types/visualization";

export default function TableWidget({
  data,
  config,
}: {
  data: any[];
  config: TableWidgetConfig;
  editMode?: boolean;
}) {
  const { columns, displayData, tableTitle } = useTableWidgetLogic(
    data,
    config
  );

  if (!columns.length) {
    return (
      <div className="text-xs text-gray-500">
        Aucune configuration valide pour le tableau.
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      name={tableTitle}
      data={displayData}
      emptyMessage="Aucune donnée."
      paginable={true}
      searchable={true}
      rowPerPage={config.pageSize || 5}
    />
  );
}
