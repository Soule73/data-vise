import React from "react";

const AppLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <img
        src="/logo-datavise.svg"
        alt="Logo DataVise"
        className="h-20 w-auto mb-6"
        // style={{ filter: "drop-shadow(0 2px 8px #6366f1aa)" }}
      />
      <span className="text-indigo-600 dark:text-indigo-300 font-bold text-xl tracking-wide animate-pulse">
        DataVise
      </span>
      <span className="mt-2 text-gray-400 text-sm tracking-wide">
        Chargement de l'application…
      </span>
    </div>
  );
};

export default AppLoader;
