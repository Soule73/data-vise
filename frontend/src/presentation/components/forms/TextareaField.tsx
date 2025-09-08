import type { TextareaFieldProps } from "@type/ui";
import { Field, Label } from "@headlessui/react";
import { forwardRef } from "react";


const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField({ label, error, id, className, ...props }, ref) {
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
          <textarea
            ref={ref}
            id={id}
            rows={props.minRows || props.rows}
            className={[
              "w-full rounded-md bg-white dark:bg-gray-900 px-3 py-2  text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
        </div>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </Field>
    );
  }
);

export default TextareaField;
