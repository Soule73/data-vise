import { useTableWidgetLogic } from "./useTableWidgetLogic";
import Table from "@/components/Table";

export interface TableWidgetConfig {
  columns?: { key: string; label: string }[];
  pageSize?: number;
  groupBy?: string;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  metrics?: { agg: string; field: string; label?: string }[];
  bucket?: { field: string; type?: string; label?: string };
  widgetParams?: { title?: string };
}

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
