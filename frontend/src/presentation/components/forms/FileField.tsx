import type { InputFieldProps } from "@/core/types/form-types";
import { Field, Label } from "@headlessui/react";
import { forwardRef } from "react";

interface FileFieldProps
  extends Omit<InputFieldProps, "type" | "value" | "onChange"> {
  label?: string;
  error?: string;
  id?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  function FileField(
    { label, error, id, className, accept, onChange, ...props },
    ref
  ) {
    return (
      <Field>
        {label && (
          <Label
            htmlFor={id}
            className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
          >
            {label}
            {props.required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <div className="mt-2">
          <input
            ref={ref}
            id={id}
            name={props.name}
            type="file"
            accept={accept}
            required={props.required}
            className={[
              "block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 transition-colors duration-300 cursor-pointer border border-gray-300 dark:border-gray-700",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            onChange={onChange}
            {...props}
          />
        </div>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </Field>
    );
  }
);

export default FileField;
