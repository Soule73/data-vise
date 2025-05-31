import Table from '@/components/Table';

export interface TableWidgetConfig {
  columns: { key: string; label: string }[];
  pageSize?: number;
}

export default function TableWidget({ data, config }: { data: any[]; config: TableWidgetConfig }) {
  // Prépare les colonnes pour le composant Table
  const columns = Array.isArray(config.columns)
    ? config.columns.map(col => ({ key: col.key, label: col.label || col.key }))
    : [];
  const safeData = Array.isArray(data) ? data : [];
  return (
    <div className=" bg-white dark:bg-gray-900 rounded overflow-auto max-h-80 min-w-[300px] pt-1 md:pt-2">
      <div className="font-bold mb-2 px-4 pt-4">Table</div>
      <div className="relative overflow-x-auto overflow-y-auto max-h-64">
        <Table columns={columns} data={safeData.slice(0, config.pageSize || 10)} emptyMessage="Aucune donnée." />
      </div>
    </div>
  );
}
