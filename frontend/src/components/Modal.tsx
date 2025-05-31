import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: string; // ex: 'blue', 'red', 'indigo', etc.
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export default function Modal({
  open,
  onClose,
  title,
  size = 'md',
  color = 'indigo',
  children,
  footer,
  hideCloseButton = false,
  className = '',
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto overflow-x-hidden">
      <div className={`relative w-full ${sizeMap[size]} p-4 max-h-full ${className}`}>
        <div className={`relative rounded-lg shadow-sm bg-white dark:bg-gray-800 border-t-2 ${
          color === 'red'
            ? 'border-red-600'
            : color === 'blue'
            ? 'border-indigo-600'
            : color === 'indigo'
            ? 'border-indigo-600'
            : color === 'green'
            ? 'border-green-600'
            : 'border-gray-200'
        }`}>
          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="flex items-center justify-between p-4 md:p-5">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              {!hideCloseButton && (
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={onClose}
                  aria-label="Fermer le modal"
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                </button>
              )}
            </div>
          )}
          {/* Body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
          {/* Footer */}
          {footer && (
            <div className="flex items-center p-4 md:p-5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
