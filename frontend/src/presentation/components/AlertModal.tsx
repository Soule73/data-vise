import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Button from '@components/forms/Button';
import type { AlertModalProps } from '@type/notificationTypes';

const ICONS = {
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  info: InformationCircleIcon,
  default: InformationCircleIcon,
};

const COLORS = {
  error: 'red',
  warning: 'yellow',
  success: 'green',
  info: 'indigo',
  default: 'gray',
};

const BUTTON_COLORS: Record<string, 'indigo' | 'red' | 'green' | 'gray'> = {
  error: 'red',
  warning: 'indigo',
  success: 'green',
  info: 'indigo',
  default: 'gray',
};


export default function AlertModal({
  open,
  onClose,
  onConfirm,
  type = 'default',
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  loading = false,
}: AlertModalProps) {
  const Icon = ICONS[type] || ICONS.default;
  const color = COLORS[type] || COLORS.default;
  const buttonColor = BUTTON_COLORS[type] || 'gray';

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 transition-opacity" />
        </TransitionChild>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none w-max"
                onClick={onClose}
                aria-label="Fermer le modal"
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
              <div className="flex flex-col items-center text-center">
                <Icon
                  className={`mx-auto mb-4 w-12 h-12 text-${color}-500 dark:text-${color}-400`}
                  aria-hidden="true"
                />
                <DialogTitle as="h3" className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </DialogTitle>
                {description && (
                  <div className="mb-5 text-gray-500 dark:text-gray-300 text-sm">{description}</div>
                )}
                <div className="flex gap-2 justify-center mt-2">
                  <Button
                    color={buttonColor}
                    onClick={onConfirm}
                    loading={loading}
                  >
                    {confirmLabel}
                  </Button>
                  <Button
                    color="gray"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                  >
                    {cancelLabel}
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
