import type { CheckboxFieldProps } from "@type/formTypes";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import React from "react";

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  name,
  id,
  className = "",
  disabled = false,
}) => {
  return (
    <div
      className={["inline-flex items-center p-2", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Checkbox
        checked={checked}
        onChange={onChange}
        name={name}
        id={id}
        disabled={disabled}
        className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-indigo-800 data-focus:outline data-focus:outline-offset-2 data-focus:outline-indigo-600 border border-slate-300"
      >
        <CheckIcon className="hidden size-4 fill-white group-data-checked:block" />
      </Checkbox>
      {
        label && (

          <span className="select-none text-sm font-medium text-gray-900 dark:text-gray-300 ml-2">
            {label}
          </span>

        )
      }
    </div>
  );
};

export default CheckboxField;
