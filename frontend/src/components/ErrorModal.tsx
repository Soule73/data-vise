interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-6 shadow-xl max-w-sm w-full">
        <div className="text-red-600 text-lg font-semibold mb-2">Erreur</div>
        <div className="text-gray-900 dark:text-gray-100 mb-4">{message}</div>
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
