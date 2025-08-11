import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ModalProps } from '@type/layoutTypes';
import Button from '@components/forms/Button';

export default function ModalSidebarRight({
    open,
    onClose,
    title,
    children,
    footer,
    hideCloseButton = false,
    className = '',
    size = 'md',
}: ModalProps) {

    const widthMap = {
        sm: 'w-80',
        md: 'w-[28rem]',
        lg: 'w-[36rem]',
        xl: 'w-[48rem]',
        '2xl': 'w-[64rem]',
    };

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 transition-opacity" />
                </TransitionChild>
                {/* Sidebar Panel */}
                <div className="fixed inset-0 z-50 flex justify-end overflow-y-auto">
                    <TransitionChild
                        as={Fragment}
                        enter="transform transition ease-out duration-200"
                        enterFrom="translate-x-full opacity-0" enterTo="translate-x-0 opacity-100"
                        leave="transform transition ease-in duration-150"
                        leaveFrom="translate-x-0 opacity-100" leaveTo="translate-x-full opacity-0"
                    >
                        <DialogPanel
                            className={`relative h-full ${widthMap[size]} max-w-full bg-white dark:bg-gray-800 shadow-xl flex flex-col ${className}`}
                        >
                            {/* Header */}
                            {(title || !hideCloseButton) && (
                                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                                    {!hideCloseButton && (
                                        <Button
                                            type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm !w-8 !h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white "
                                            onClick={onClose}
                                            aria-label="Fermer le panneau"
                                        >
                                            <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                                        </Button>
                                    )}
                                </div>
                            )}
                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-4">{children}</div>
                            {/* Footer */}
                            {footer && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    {footer}
                                </div>
                            )}
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
