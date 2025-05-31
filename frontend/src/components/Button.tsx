import { type ButtonHTMLAttributes } from 'react';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'red' | 'green' | 'gray';
  variant?: 'solid' | 'outline';
  loading?: boolean;
}

const sizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-1.5 text-base',
  lg: 'px-4 py-2 text-lg',
};

const colorClasses = {
  indigo: {
    solid: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
    outline: 'border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-indigo-700/20 dark:text-indigo-200 hover:dark:bg-indigo-700',
  },
  red: {
    solid: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600',
    outline: 'border border-red-600 text-red-600 bg-white hover:bg-red-50 dark:bg-red-700/20 dark:text-red-200 hover:dark:bg-red-700',
  },
  green: {
    solid: 'bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-600',
    outline: 'border border-green-600 text-green-600 bg-white hover:bg-green-50 dark:bg-green-700/20 dark:text-green-200 hover:dark:bg-green-700',
  },
  gray: {
    solid: 'bg-gray-600 text-white hover:bg-gray-500 focus-visible:outline-gray-600',
    outline: 'border border-gray-600 text-gray-600 bg-white hover:bg-gray-50 dark:bg-gray-700/20 dark:text-gray-200 hover:dark:bg-gray-700',
  },
};

export default function Button({
  children,
  size = 'md',
  color = 'indigo',
  variant = 'solid',
  type,
  loading = false,
  className = '',
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      className={[`flex w-full justify-center items-center rounded-md font-semibold shadow-xs focus-visible:outline-2 
        cursor-pointer
        focus-visible:outline-offset-2 ${sizeClasses[size]} ${colorClasses[color][variant]} transition-colors duration-300 dark:shadow-none`].filter(Boolean).join(' ')}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
