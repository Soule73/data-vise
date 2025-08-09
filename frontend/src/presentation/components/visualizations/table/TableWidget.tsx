// import { useTableWidgetLogic } from "@hooks/visualizations/useTableWidgetVM";
import Table from "@components/Table";
import type { TableWidgetConfig } from "@type/visualization";
import NoDataWidget from "@components/widgets/NoDataWidget";
import InvalideConfigWidget from "@components/widgets/InvalideConfigWidget";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { useTableWidgetLogic } from "@/core/hooks/visualizations/useTableWidgetVM";

export default function TableWidget({
  data,
  config,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  config: TableWidgetConfig;
  editMode?: boolean;
}) {
  const { columns, displayData, tableTitle } = useTableWidgetLogic(
    data,
    config
  );

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

  return (
    <div className="bg-white shadow dark:bg-gray-900 rounded w-full max-w-full h-full p-2">
      <Table
        columns={columns}
        name={tableTitle}
        data={displayData}
        emptyMessage="Aucune donnée."
        paginable={true}
        searchable={true}
        rowPerPage={config.widgetParams?.pageSize ?? config.pageSize ?? 5}
      />
    </div>
  );
}
