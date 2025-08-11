import type { ButtonProps } from "@type/formTypes";
import { Button as HeadlessButton } from "@headlessui/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const colorClasses = {
  indigo: {
    solid:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  },
  red: {
    solid:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
    outline:
      "border border-red-300 text-red-700 bg-white hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  },
  green: {
    solid:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
    outline:
      "border border-green-300 text-green-700 bg-white hover:bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
  },
  gray: {
    solid:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
  },
};

export default function Button({
  children,
  size = "md",
  color = "indigo",
  variant = "solid",
  type = "button",
  loading = false,
  className = "",
  ...props
}: ButtonProps) {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const colorClass =
    colorClasses[color]?.[variant] || colorClasses.indigo.solid;
  return (
    <HeadlessButton
      type={type}
      className={[
        `flex w-full disabled:opacity-50 justify-center items-center rounded-md font-medium transition-colors ${sizeClass} ${colorClass} disabled:cursor-not-allowed cursor-pointer`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <ArrowPathIcon className="animate-spin mr-2 h-4 w-4" />
      )}
      {children}
    </HeadlessButton>
  );
}
