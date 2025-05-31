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
}

export default function Table<T extends { [key: string]: any }>({ columns, data, emptyMessage }: TableProps<T>) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map(col => (
              <th key={col.key as string} scope="col" className={col.className || 'px-6 py-3'}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage || 'Aucune donnée.'}
              </td>
            </tr>
          )}
          {data.map((row, i) => (
            <tr
              key={row._id || i}
              className={
                'bg-white border-b dark:bg-gray-900 dark:border-gray-700 border-gray-200' +
                (i === data.length - 1 ? ' last:border-0' : '')
              }
            >
              {columns.map(col => (
                <td key={col.key as string} className={col.className || 'px-6 py-4'}>
                  {col.render ? col.render(row) : row[col.key as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
