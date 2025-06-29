import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button as HeadlessButton } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ModalProps } from "@/core/types/layout-types";

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  size = "md",
  children,
  footer,
  hideCloseButton = false,
  className = "",
}: ModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 transition-opacity" />
        </TransitionChild>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={`relative w-full ${sizeMap[size]} p-4 max-h-full ${className} rounded-lg shadow-sm bg-white dark:bg-gray-800`}
            >
              {/* Header */}
              {(title || !hideCloseButton) && (
                <div className="flex items-center justify-between p-4 md:p-5">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  {!hideCloseButton && (
                    <HeadlessButton
                      type="button"
                      className="text-gray-400 cursor-pointer bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={onClose}
                      aria-label="Fermer le modal"
                    >
                      <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                    </HeadlessButton>
                  )}
                </div>
              )}
              {/* Body */}
              <div className="p-4 md:p-5 space-y-4">{children}</div>
              {/* Footer */}
              {footer && (
                <div className="flex items-center p-4 md:p-5">{footer}</div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
