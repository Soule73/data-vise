import type { InputFieldProps } from "@/core/types/form-types";
import { Field, Input, Label } from "@headlessui/react";
import { forwardRef } from "react";

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, error, id, className, ...props }, ref) {
    return (
      <Field>
        {label && (
          <Label
            htmlFor={id}
            className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <div>
          <Input
            ref={ref}
            id={id}
            name={props.name}
            autoComplete={props.autoComplete}
            required={props.required}
            className={[
              "block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
        </div>
        {error && <span className="text-red-600 dark:text-red-400 text-sm mt-1 block">{error}</span>}
      </Field>
    );
  }
);

export default InputField;
