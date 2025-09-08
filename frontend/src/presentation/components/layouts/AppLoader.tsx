import React from "react";
import { AnimatedChartLogo } from "@components/layouts/AnimatedChartLogo";
import ThemeDropdown from "@components/ThemeDropdown";

const AppLoader: React.FC = () => {
  return (
    <>
      <div className="hidden">
        <ThemeDropdown />
      </div>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="h-20 flex items-center">
          <AnimatedChartLogo width={300} height={120} />
        </div>
        <br />
        <p className="mt-2 text-gray-400 text-sm tracking-wide">
          Chargement de l'application…
        </p>
      </div>
    </>
  );
};

export default AppLoader;
