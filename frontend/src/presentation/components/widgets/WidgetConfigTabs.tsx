import type { WidgetConfigTabsProps } from "@/core/types/widget-types";
import React from "react";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${active
          ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const WidgetConfigTabs: React.FC<WidgetConfigTabsProps> = ({
  tab,
  setTab,
  availableTabs
}) => {
  // Si aucun onglet spécifique n'est fourni, utiliser les onglets par défaut
  const tabs = availableTabs || [
    { key: "data", label: "Données" },
    { key: "metricsAxes", label: "Métriques & Axes" },
    { key: "params", label: "Paramètres widget" }
  ];

  // Ne pas afficher les onglets s'il n'y en a qu'un seul
  if (tabs.length <= 1) {
    return null;
  }

  return (
    <div className="flex bg-gray-50 dark:bg-gray-800/50">
      {tabs.map((tabConfig) => (
        <TabButton
          key={tabConfig.key}
          active={tab === tabConfig.key}
          onClick={() => setTab(tabConfig.key as "data" | "metricsAxes" | "params")}
        >
          {tabConfig.label}
        </TabButton>
      ))}
    </div>
  );
};

export default WidgetConfigTabs;
