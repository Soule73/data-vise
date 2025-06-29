import React from "react";
import { useTableSearchStore } from "../../core/store/tableSearch";
import Pagination from "./Pagination";
import TableSearch from "./TableSearch";
import type { TableProps } from "@/core/types/table-types";

export default function Table<T extends { [key: string]: any }>({
  columns,
  data,
  emptyMessage,
  actionsColumn,
  onClickItem,
  paginable = false,
  searchable = false,
  onSearch,
  onPageChange,
  page = 1,
  rowPerPage = 10,
  totalRows,
  searchValue = "",
  name, // Ajout du paramètre name dans la destructuration
}: TableProps<T>) {
  React.useEffect(() => {
    // Suppression des logs de debug
    return () => {};
  }, []);

  // Filtrer les colonnes invalides (doivent avoir à la fois key ET label)
  const validColumns = columns.filter((col) => col.key && col.label);
  const hasActions = !!actionsColumn;

  // Recherche locale si pas de onSearch fourni
  // Utilisation de Zustand pour la recherche avec typage explicite
  const zustandSearch = useTableSearchStore<string>(
    (state: any) => state.search
  );
  const setZustandSearch = useTableSearchStore<(search: string) => void>(
    (state: any) => state.setSearch
  );
  const resetZustandSearch = useTableSearchStore<() => void>(
    (state: any) => state.reset
  );

  React.useEffect(() => {
    if (onSearch && searchValue !== zustandSearch) {
      setZustandSearch(searchValue || "");
    }
    // eslint-disable-next-line
  }, [searchValue]);

  React.useEffect(() => {
    // Nettoyage du store à l'unmount
    return () => {
      resetZustandSearch();
    };
  }, []);

  const effectiveSearch = searchable
    ? onSearch
      ? searchValue
      : zustandSearch
    : "";
  const filteredData =
    searchable && effectiveSearch
      ? data.filter((row) =>
          validColumns.some((col) => {
            const value = row[col.key as keyof T];
            return (
              value &&
              String(value)
                .toLowerCase()
                .includes(effectiveSearch.toLowerCase())
            );
          })
        )
      : data;

  // Pagination locale si pas de onPageChange fourni
  const [localPage, setLocalPage] = React.useState(1);
  const [localRowPerPage, setLocalRowPerPage] = React.useState(
    () => rowPerPage
  );
  React.useEffect(() => {
    // Ne pas réinitialiser localRowPerPage à chaque render, seulement si rowPerPage change vraiment
    setLocalRowPerPage(rowPerPage);
    // eslint-disable-next-line
  }, [rowPerPage]);
  const effectivePage = paginable ? (onPageChange ? page : localPage) : 1;
  const effectiveRowPerPage = paginable
    ? onPageChange
      ? rowPerPage
      : localRowPerPage
    : filteredData.length;
  const total = typeof totalRows === "number" ? totalRows : filteredData.length;
  const pageCount = paginable ? Math.ceil(total / effectiveRowPerPage) : 1;
  const paginatedData = paginable
    ? filteredData.slice(
        (effectivePage - 1) * effectiveRowPerPage,
        effectivePage * effectiveRowPerPage
      )
    : filteredData;

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) onSearch(e.target.value);
    else setZustandSearch(e.target.value);
    if (!onPageChange) setLocalPage(1);
  };
  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else setLocalPage(newPage);
  };
  const handleRowPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (onPageChange) {
      // Si pagination contrôlée, on notifie le parent
      if (onPageChange) onPageChange(1);
    } else {
      setLocalPage(1);
      setLocalRowPerPage(value);
    }
  };

  // Déplacer le ref en dehors du composant TableSearch
  const searchMountCount = React.useRef(0);

  return (
    <div className="relative w-full h-full max-w-full max-h-full overflow-auto config-scrollbar">
      {searchable && (
        <TableSearch
          value={effectiveSearch}
          onChange={handleSearch}
          name={name}
          mountCountRef={searchMountCount}
        />
      )}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-auto config-scrollbar">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
          <tr>
            {validColumns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className={col.className || "px-6 py-3"}
              >
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th className={actionsColumn?.className || "px-6 py-3"}>
                {actionsColumn?.label || ""}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 && (
            <tr>
              <td
                colSpan={validColumns.length + (hasActions ? 1 : 0)}
                className="px-6 py-4 text-center text-gray-500"
              >
                {emptyMessage || "Aucune donnée."}
              </td>
            </tr>
          )}
          {paginatedData.map((row, i) => {
            const rowKey = row._id ? String(row._id) : `row-${i}`;
            return (
              <tr
                key={rowKey}
                className={
                  "bg-white border-b dark:bg-gray-900 dark:border-gray-700 border-gray-200" +
                  (i === paginatedData.length - 1 ? " last:border-0" : "")
                }
                onClick={onClickItem ? () => onClickItem(row) : undefined}
                style={onClickItem ? { cursor: "pointer" } : undefined}
              >
                {validColumns.map((col, colIndex) => {
                  const colKey = col.key ?? col.label ?? colIndex;
                  const value = col.render
                    ? col.render(row)
                    : row[col.key as keyof T] ?? "";
                  return (
                    <td
                      key={`${rowKey}-${String(colKey)}`}
                      className={col.className || "px-6 py-4"}
                    >
                      {value}
                    </td>
                  );
                })}
                {hasActions && (
                  <td className={actionsColumn?.className || "px-6 py-4"}>
                    {actionsColumn?.render ? actionsColumn.render(row) : null}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Affiche toujours la pagination si paginable, même si pageCount === 1 */}
      {paginable && (
        <Pagination
          effectivePage={effectivePage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          effectiveRowPerPage={effectiveRowPerPage}
          handleRowPerPageChange={handleRowPerPageChange}
          total={total}
        />
      )}
    </div>
  );
}
