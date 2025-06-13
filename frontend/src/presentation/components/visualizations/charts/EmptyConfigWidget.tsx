export function EmptyConfigWidget({
    icon,
    message,
    details,
  }: {
    icon: React.ReactNode;
    message: string;
    details?: string;
  }) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex flex-col items-center justify-center overflow-x-auto p-4">
        <div className="flex items-center justify-center mb-2">
          {icon}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{message}</span>
        {details && <span className="text-xs text-gray-400 mt-1">{details}</span>}
      </div>
    );
  }
  