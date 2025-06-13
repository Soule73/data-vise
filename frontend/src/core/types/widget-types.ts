// ======================================================
// 1. Widgets & Configuration
// ======================================================

export type WidgetType = "bar" | "pie" | "table" | "line";

export interface WidgetDefinition {
  type: WidgetType;
  label: string;
  component: React.ComponentType<any>;
  configSchema: any;
  // Optional: default configuration values
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Ajout de l'icône (composant SVG)
}

// --- Widget Configuration Sections

export interface WidgetDataConfigSectionProps {
  dataConfig: any;
  config: any;
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
  handleDragStart: (idx: number) => void;
  handleDragOver: (idx: number, e: React.DragEvent) => void;
  handleDrop: (idx: number) => void;
  handleMetricAggOrFieldChange?: (
    idx: number,
    field: "agg" | "field",
    value: any
  ) => void;
}

export interface WidgetMetricStyleConfigSectionProps {
  type: WidgetType;
  metrics: any[];
  metricStyles: any[];
  handleMetricStyleChange: (
    metricIdx: number,
    field: string,
    value: any
  ) => void;
}

export interface WidgetParamsConfigSectionProps {
  type: WidgetType;
  config: any;
  handleConfigChange: (field: string, value: any) => void;
}

export interface WidgetStyleConfigSectionProps {
  type: WidgetType;
  config: any;
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
}

// --- Widget Modals & Selecteurs

export interface WidgetConfigTabsProps {
  tab: "data" | "metricsAxes" | "params";
  setTab: (tab: "data" | "metricsAxes" | "params") => void;
}

export interface WidgetConfigFooterProps {
  step: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export interface WidgetSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (widget: any) => void;
}

export interface WidgetSaveTitleModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  setTitle: (t: string) => void;
  error: string;
  setError: (e: string) => void;
  onConfirm: () => void;
  loading: boolean;
}

export interface WidgetCreateSelectorResult {
  type: WidgetType;
  sourceId: string;
}
