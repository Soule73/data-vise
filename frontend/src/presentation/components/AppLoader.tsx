import React from "react";
import { AnimatedChartLogo } from "@/presentation/components/AnimatedChartLogo";

const AppLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="h-20 flex items-center">
        <AnimatedChartLogo />
      </div>
      <span className="mt-2 text-gray-400 text-sm tracking-wide">
        Chargement de l'application…
      </span>
    </div>
  );
};

export default AppLoader;
