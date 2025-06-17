import { useTableWidgetLogic } from "@/core/hooks/visualizations/useTableWidgetVM";
import Table from "@/presentation/components/Table";
import type { TableWidgetConfig } from "@/core/types/visualization";
import NoDataWidget from "../charts/NoDataWidget";
import InvalideConfigWidget from "../charts/InvalideConfigWidget";
import { TableCellsIcon } from "@heroicons/react/24/outline";

export default function TableWidget({
  data,
  config,
}: {
  data: Record<string, any>[];
  config: TableWidgetConfig;
  editMode?: boolean;
}) {
  if (
    !data ||
    !config.metrics ||
    !config.bucket ||
    !Array.isArray(config.metrics) ||
    !config.bucket.field
  ) {
    return <InvalideConfigWidget />;
  }

  if (data.length === 0) {
    return (
      <NoDataWidget
        icon={
          <TableCellsIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />
        }
      />
    );
  }
  const { columns, displayData, tableTitle } = useTableWidgetLogic(
    data,
    config
  );

  return (
    <div className="bg-white shadow dark:bg-gray-900 rounded w-full max-w-full h-full p-2">
      <Table
        columns={columns}
        name={tableTitle}
        data={displayData}
        emptyMessage="Aucune donnée."
        paginable={true}
        searchable={true}
        rowPerPage={config.pageSize || 5}
      />
    </div>
  );
}
