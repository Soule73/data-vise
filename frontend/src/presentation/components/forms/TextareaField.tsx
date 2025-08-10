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
              "block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 transition-colors duration-300 font-mono",
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
