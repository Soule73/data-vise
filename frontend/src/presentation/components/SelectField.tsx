import { forwardRef } from 'react';
import type { SelectFieldProps } from "@/core/types/ui";

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, id, className, ...props }, ref) => (
    <>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
      <select
        ref={ref}
        id={id}
        className={["block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-2.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 transition-colors duration-300", className].filter(Boolean).join(' ')}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </>
  )
);

export default SelectField;
