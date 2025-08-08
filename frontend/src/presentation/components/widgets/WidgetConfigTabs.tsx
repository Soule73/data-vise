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
      className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors text-sm cursor-pointer ${active
          ? "border-indigo-500 text-indigo-600"
          : "border-transparent text-gray-500 hover:text-indigo-500"
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
    <div className="flex border-b border-gray-300 mb-2 sticky top-0 z-20 bg-white dark:bg-gray-900">
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
