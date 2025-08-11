import type { NotificationProps } from "@type/notificationTypes";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import Button from "@components/forms/Button";

export type NotificationType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default";

const typeStyles: Record<NotificationType, string> = {
  success: "bg-green-50 border-green-500 text-green-800",
  error: "bg-red-50 border-red-500 text-red-800",
  warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
  info: "bg-indigo-50 border-indigo-500 text-indigo-800",
  default: "bg-gray-50 border-gray-400 text-gray-800",
};

const barStyles: Record<NotificationType, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-indigo-500",
  default: "bg-gray-400",
};

const posStyles: Record<string, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

export default function Notification({
  open,
  onClose,
  type = "default",
  title,
  description,
  duration = 3500,
  position = "bottom-right",
}: NotificationProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      if (barRef.current) {
        barRef.current.style.width = "100%";
        barRef.current.style.transition = "none";

        void barRef.current.offsetWidth;
        barRef.current.style.transition = `width ${duration}ms linear`;
        barRef.current.style.width = "0%";
      }
      timerRef.current = setTimeout(onClose, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed z-50 ${posStyles[position]} flex flex-col items-end gap-2`}
      style={{ minWidth: 320 }}
    >
      <div
        className={`relative border-l-4 shadow-lg px-5 py-4 mb-2 w-full max-w-xs animate-fade-in-up ${typeStyles[type]} dark:bg-gray-900 dark:text-gray-100 dark:border-opacity-60`}
        role="alert"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold text-base text-gray-900 dark:text-gray-100">
            {title}
          </div>
          <Button
            className="ml-2 text-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none w-max"
            onClick={onClose}
            aria-label="Fermer la notification"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </div>
        {description && (
          <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            {description}
          </div>
        )}
        <div className="absolute left-0 bottom-0 h-1 w-full overflow-hidden">
          <div
            ref={barRef}
            className={`h-1 ${barStyles[type]} transition-all dark:opacity-80`}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
