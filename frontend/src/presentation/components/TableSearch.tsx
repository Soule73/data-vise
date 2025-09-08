import type { TableSearchProps } from "@type/tableTypes";
import InputField from "@components/forms/InputField";

export default function TableSearch({
  value,
  onChange,
  name,
}: TableSearchProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2 mb-2 sticky top-0 z-20 bg-white dark:bg-gray-900 px-2 py-1 border-b border-gray-200 dark:border-gray-700 justify-between">
      {name && (
        <div className="text-base font-semibold text-gray-700 dark:text-gray-200 mr-2 whitespace-nowrap">
          {name}
        </div>
      )}
      <InputField
        placeholder="Rechercher..."
        value={value}
        onChange={onChange}
        className="w-full max-w-xs !text-sm !py-1 !px-2 !rounded-md !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 focus:!outline-indigo-600"
        autoComplete="off"
      />
    </div>
  );
}
