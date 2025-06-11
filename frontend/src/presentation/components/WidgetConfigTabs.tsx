import type { WidgetConfigTabsProps } from "@/core/types/ui";
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
      className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors text-sm cursor-pointer ${
        active
          ? "border-indigo-500 text-indigo-600"
          : "border-transparent text-gray-500 hover:text-indigo-500"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const WidgetConfigTabs: React.FC<WidgetConfigTabsProps> = ({ tab, setTab }) => (
  <div className="flex border-b border-gray-300 mb-2 sticky top-0 z-20 ">
    <TabButton active={tab === "data"} onClick={() => setTab("data")}>
      Données
    </TabButton>
    <TabButton
      active={tab === "metricsAxes"}
      onClick={() => setTab("metricsAxes")}
    >
      Métriques & Axes
    </TabButton>
    <TabButton active={tab === "params"} onClick={() => setTab("params")}>
      Paramètres widget
    </TabButton>
  </div>
);

export default WidgetConfigTabs;
