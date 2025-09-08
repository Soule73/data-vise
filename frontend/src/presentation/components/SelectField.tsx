import type { SelectFieldProps } from "@type/formTypes";
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


const SelectField = forwardRef<HTMLInputElement, SelectFieldProps>(
  (
    { label, options, error, textSize, id, className, value, onChange, ...props },
    ref
  ) => {
    const [query, setQuery] = useState("");

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

    const inputTextSize = useMemo(() => {
      switch (textSize) {
        case "sm":
          return "text-xs";
        case "md":
          return "text-sm";
        case "lg":
          return "text-base";
        default:
          return "text-sm";
      }
    }, [textSize]);

    return (
      <div>
        <label
          htmlFor={id}
          className={`block mb-2 font-medium text-gray-900 dark:text-white ${inputTextSize}`}
        >
          {label}
        </label>
        <Combobox
          value={selected}
          onChange={(opt) => {
            if (onChange && opt) {
              onChange({ target: { value: opt.value, name: id } } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          by={(a, b) => a?.value === b?.value}
        >
          <div className="relative flex items-center">
            <ComboboxInput
              className={clsx(
                `block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-2 ${inputTextSize} text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors `,
                className
              )}
              displayValue={(item) => {
                if (!item) return "";
                if (typeof item === "string" || typeof item === "number")
                  return String(item);
                if (Array.isArray(item)) return item.join(", ");
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
            <ComboboxButton className="absolute inset-y-0 right-0 px-3 flex items-center">
              <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </ComboboxButton>
          </div>
          <ComboboxOptions
            anchor="bottom"
            transition
            className={
              `w-(--input-width) config-scrollbar z-50 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 py-1 shadow-lg max-h-60 overflow-auto transition duration-100 ease-in data-leave:data-closed:opacity-0 ${inputTextSize} `
            }
          >
            {filteredOptions.map((opt) => (
              <ComboboxOption
                key={opt.value}
                value={opt}
                className={`group flex cursor-default items-center gap-2 px-3 py-2 select-none data-focus:bg-blue-50 dark:data-focus:bg-blue-900/50 transition-colors ${inputTextSize}`}
              >
                <CheckIcon className="invisible h-4 w-4 text-blue-600 dark:text-blue-400 group-data-selected:visible" />
                <div className={`text-sm text-gray-900 dark:text-gray-100 ${inputTextSize}`}>
                  {opt.label}
                </div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
        {error && <span className="text-red-600 dark:text-red-400 text-sm mt-1 block">{error}</span>}
      </div>
    );
  }
);

export default SelectField;
