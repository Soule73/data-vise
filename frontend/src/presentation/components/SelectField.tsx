import type { SelectFieldProps } from "@/core/types/form-types";
import { forwardRef, useState, useMemo } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

// Correction du typage du ref : HTMLInputElement (input), ou suppression si inutilisé
const SelectField = forwardRef<HTMLInputElement, SelectFieldProps>(
  (
    { label, options, error, id, className, value, onChange, ...props },
    ref
  ) => {
    const [query, setQuery] = useState("");
    // options: [{ value, label }]
    const selected = options.find((opt) => opt.value === value) || null;
    const filteredOptions = useMemo(
      () =>
        query === ""
          ? options
          : options.filter((opt) =>
              opt.label.toLowerCase().includes(query.toLowerCase())
            ),
      [query, options]
    );
    return (
      <div>
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <Combobox
          value={selected}
          onChange={(opt) => {
            if (onChange && opt) {
              // Simule un event natif pour compatibilité
              onChange({ target: { value: opt.value, name: id } } as any);
            }
          }}
          by={(a, b) => a?.value === b?.value}
        >
          <div className="relative flex items-center">
            <ComboboxInput
              className={clsx(
                "block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 transition-colors duration-300",

                // "w-full rounded-md bg-white dark:bg-gray-800 px-3 py-2.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 transition-colors duration-300",
                className
              )}
              displayValue={(item) => {
                if (!item) return "";
                if (typeof item === "string" || typeof item === "number")
                  return String(item);
                if (Array.isArray(item)) return item.join(", ");
                // Pour nos objets option { label }
                if (
                  typeof item === "object" &&
                  "label" in item &&
                  typeof item.label === "string"
                )
                  return item.label;
                return "";
              }}
              onChange={(event) => setQuery(event.target.value)}
              id={id}
              name={id}
              autoComplete="off"
              ref={ref}
              {...props}
            />
            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
              <ChevronDownIcon className="size-4 fill-gray-400 dark:fill-gray-200 group-data-hover:fill-indigo-600" />
            </ComboboxButton>
          </div>
          <ComboboxOptions
            anchor="bottom"
            transition
            className={clsx(
              "w-(--input-width) z-50 config-scrollbar rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1 [--anchor-gap:--spacing(1)] empty:invisible",
              "transition duration-100 ease-in data-leave:data-closed:opacity-0"
            )}
          >
            {filteredOptions.map((opt) => (
              <ComboboxOption
                key={opt.value}
                value={opt}
                className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-indigo-50 dark:data-focus:bg-indigo-900"
              >
                <CheckIcon className="invisible size-4 fill-indigo-600 group-data-selected:visible" />
                <div className="text-sm/6 text-gray-900 dark:text-gray-100">
                  {opt.label}
                </div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }
);

export default SelectField;
