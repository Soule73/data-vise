import SelectField from "@components/SelectField";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import type { PaginationProps } from "@type/tableTypes";

export default function Pagination({
  effectivePage,
  pageCount,
  handlePageChange,
  effectiveRowPerPage,
  handleRowPerPageChange,
  total,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center mt-2 gap-2 flex-wrap sticky bottom-0 z-20 bg-white dark:bg-gray-900 px-2 py-2 border-t border-gray-200 dark:border-gray-700 ">
      <nav
        className="flex items-center gap-1 select-none"
        aria-label="Pagination"
      >
        {/* First */}
        <button
          className={`px-2 py-1 rounded text-xs font-medium ${effectivePage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
            }`}
          onClick={() => effectivePage !== 1 && handlePageChange(1)}
          disabled={effectivePage === 1}
          aria-label="Première page"
        >
          <ChevronDoubleLeftIcon className="w-4 h-4 align-middle" />
        </button>
        {/* Chevron gauche */}
        <button
          className={`px-2 py-1 rounded text-xs ${effectivePage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
            }`}
          onClick={() =>
            effectivePage > 1 && handlePageChange(effectivePage - 1)
          }
          disabled={effectivePage === 1}
          aria-label="Page précédente"
        >
          <ChevronLeftIcon className="w-4 h-4 align-middle" />
        </button>
        {/* Pages proches */}
        {effectivePage > 2 && (
          <button
            className="px-2 py-1 rounded text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
            onClick={() => handlePageChange(effectivePage - 1)}
          >
            {effectivePage - 1}
          </button>
        )}
        {/* Page courante */}
        <span className="px-2 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
          {effectivePage}
        </span>
        {effectivePage < pageCount - 1 && (
          <button
            className="px-2 py-1 rounded text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
            onClick={() => handlePageChange(effectivePage + 1)}
          >
            {effectivePage + 1}
          </button>
        )}
        {/* Chevron droite */}
        <button
          className={`px-2 py-1 rounded text-xs ${effectivePage === pageCount
            ? "text-gray-400 cursor-not-allowed"
            : "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
            }`}
          onClick={() =>
            effectivePage < pageCount && handlePageChange(effectivePage + 1)
          }
          disabled={effectivePage === pageCount}
          aria-label="Page suivante"
        >
          <ChevronRightIcon className="w-4 h-4 align-middle" />
        </button>
        {/* Last */}
        <button
          className={`px-2 py-1 rounded text-xs font-medium ${effectivePage === pageCount
            ? "text-gray-400 cursor-not-allowed"
            : "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
            }`}
          onClick={() =>
            effectivePage !== pageCount && handlePageChange(pageCount)
          }
          disabled={effectivePage === pageCount}
          aria-label="Dernière page"
        >
          <ChevronDoubleRightIcon className="w-4 h-4 align-middle" />
        </button>
      </nav>
      <div className="flex items-center gap-2 ml-4">
        <div className="text-xs">Lignes par page</div>
        <SelectField
          options={[5, 10, 20, 50, 100].map((n) => ({
            value: String(n),
            label: String(n),
          }))}
          value={String(effectiveRowPerPage)}
          onChange={handleRowPerPageChange}
          className="!w-16 mb-2 !text-xs !py-0.5 !px-1 !rounded"
          style={{ minWidth: 60 }}
          aria-label="Lignes par page"
        />
        <div className="text-xs">
          {effectiveRowPerPage * (effectivePage - 1) + 1}-
          {Math.min(effectivePage * effectiveRowPerPage, total)}
          &nbsp;sur&nbsp;{total}
        </div>
      </div>
    </div>
  );
}
