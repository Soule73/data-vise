import React from 'react';

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  actionsColumn?: {
    label?: string;
    render: (row: T) => React.ReactNode;
    className?: string;
  };
}

export default function Table<T extends { [key: string]: any }>(
  { columns, data, emptyMessage, actionsColumn }: TableProps<T>,
) {
  // Filtrer les colonnes invalides (doivent avoir à la fois key ET label)
  const validColumns = columns.filter(col => col.key && col.label);
  const hasActions = !!actionsColumn;

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {validColumns.map(col => (
              <th key={String(col.key)} scope="col" className={col.className || 'px-6 py-3'}>
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th className={actionsColumn?.className || 'px-6 py-3'}>{actionsColumn?.label || ''}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={validColumns.length + (hasActions ? 1 : 0)} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage || 'Aucune donnée.'}
              </td>
            </tr>
          )}
          {data.map((row, i) => {
            const rowKey = row._id ? String(row._id) : `row-${i}`;
            return (
              <tr
                key={rowKey}
                className={
                  'bg-white border-b dark:bg-gray-900 dark:border-gray-700 border-gray-200' +
                  (i === data.length - 1 ? ' last:border-0' : '')
                }
              >
                {validColumns.map((col, colIndex) => {
                  const colKey = col.key ?? col.label ?? colIndex;
                  const value = col.render ? col.render(row) : (row[col.key as keyof T] ?? '');
                  return (
                    <td key={`${rowKey}-${String(colKey)}`} className={col.className || 'px-6 py-4'}>
                      {value}
                    </td>
                  );
                })}
                {hasActions && (
                  <td className={actionsColumn?.className || 'px-6 py-4'}>
                    {actionsColumn?.render(row)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
