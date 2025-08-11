import Table from "@components/Table";
import NoDataWidget from "@components/widgets/NoDataWidget";
import InvalideConfigWidget from "@components/widgets/InvalideConfigWidget";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { useTableWidgetLogic } from "@hooks/visualizations/useTableWidgetVM";
import { validateTableConfig } from "@utils/kpi/tableDataUtils";
import type { TableWidgetProps } from "@type/widgetTypes";

export default function TableWidget({
  data,
  config,
}: TableWidgetProps) {
  const { columns, displayData, tableTitle } = useTableWidgetLogic(
    {
      data,
      config
    }
  );

  // Validation moderne utilisant l'utilitaire
  const hasValidConfig = validateTableConfig(config, data);

  if (!hasValidConfig) {
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
