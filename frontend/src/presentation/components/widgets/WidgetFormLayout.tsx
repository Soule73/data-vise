import type { ReactNode } from "react";
import WidgetConfigTabs from "@/presentation/components/widgets/WidgetConfigTabs";
import WidgetDataConfigSection from "@/presentation/components/widgets/WidgetDataConfigSection";
import WidgetSaveTitleModal from "@/presentation/components/widgets/WidgetSaveTitleModal";
import WidgetMetricStyleConfigSection from "@/presentation/components/widgets/WidgetMetricStyleConfigSection";
import WidgetParamsConfigSection from "@/presentation/components/widgets/WidgetParamsConfigSection";
import { WIDGET_DATA_CONFIG } from "@/data/adapters/visualizations";
import Button from "@/presentation/components/forms/Button";
import type { WidgetType } from "@/core/types/widget-types";
import type { ColumnInfo } from "@/core/types/metric-bucket-types";
import { useWidgetTabs } from "@/core/hooks/widget/useWidgetTabs";

interface WidgetFormLayoutProps {
    // Header
    title: string;
    isLoading: boolean;
    onSave: () => void;
    onCancel?: () => void;
    saveButtonText?: string;
    showCancelButton?: boolean;

    // Widget preview
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WidgetComponent: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataPreview: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metricsWithLabels: any[];
    isPreviewReady: boolean;

    // Configuration
    type: WidgetType;
    tab: "data" | "metricsAxes" | "params";
    setTab: (tab: "data" | "metricsAxes" | "params") => void;
    columns: string[];
    columnInfos?: ColumnInfo[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleConfigChange: (field: string, value: any) => void;
    handleDragStart: (idx: number) => void;
    handleDragOver: (idx: number, e: React.DragEvent) => void;
    handleDrop: (idx: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleMetricAggOrFieldChange: (idx: number, field: "agg" | "field", value: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleMetricStyleChange: (idx: number, field: string, value: any) => void;

    // Modal
    showSaveModal: boolean;
    setShowSaveModal: (show: boolean) => void;
    widgetTitle: string;
    setWidgetTitle: (title: string) => void;
    visibility: "public" | "private";
    setVisibility: (visibility: "public" | "private") => void;
    widgetTitleError: string;
    setWidgetTitleError: (error: string) => void;
    onModalConfirm: () => void;

    // Errors
    error?: string;

    // Optional content
    additionalHeaderContent?: ReactNode;
}

export default function WidgetFormLayout({
    title,
    isLoading,
    onSave,
    onCancel,
    saveButtonText = "Enregistrer",
    showCancelButton = false,
    WidgetComponent,
    dataPreview,
    config,
    metricsWithLabels,
    isPreviewReady,
    type,
    tab,
    setTab,
    columns,
    columnInfos = [],
    handleConfigChange,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleMetricAggOrFieldChange,
    handleMetricStyleChange,
    showSaveModal,
    setShowSaveModal,
    widgetTitle,
    setWidgetTitle,
    visibility,
    setVisibility,
    widgetTitleError,
    setWidgetTitleError,
    onModalConfirm,
    error,
    additionalHeaderContent
}: WidgetFormLayoutProps) {

    // Utilisation du hook pour déterminer les onglets disponibles
    const availableTabs = useWidgetTabs(config);

    // Recalcul des conditions pour l'affichage conditionnel
    const hasMetrics = config?.metrics && Array.isArray(config.metrics) && config.metrics.length > 0;
    const hasConfig = config && Object.keys(config).length > 0;

    return (
        <>
            <div className="lg:h-[90vh] h-full flex flex-col min-h-0 overflow-hidden">
                {/* Header avec titre et bouton de sauvegarde */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h1>
                        {additionalHeaderContent}
                    </div>
                    <div className="flex gap-2">
                        {showCancelButton && onCancel && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                        )}
                        <Button
                            size="sm"
                            color="indigo"
                            className="w-max"
                            onClick={onSave}
                            disabled={isLoading || !isPreviewReady}
                        >
                            {isLoading ? "Sauvegarde..." : saveButtonText}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row lg:flex-row h-full min-h-0 gap-2 pt-2">
                    {/* Colonne aperçu (preview): sticky/fixée, jamais scrollable */}
                    <div className="order-1 md:w-1/2 lg:w-2/3 flex-shrink-0 flex flex-col lg:sticky lg:top-0 h-full">
                        {isPreviewReady ? (
                            <WidgetComponent
                                data={dataPreview}
                                config={{
                                    ...config,
                                    metrics: metricsWithLabels,
                                    bucket: config.bucket,
                                }}
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                Configuration en cours...
                            </div>
                        )}
                    </div>

                    {/* Colonne config (droite): scrollable indépendamment */}
                    <div className="order-2 md:w-1/2 lg:w-1/3 flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        {/* Tabs conditionnels */}
                        {availableTabs.length > 1 && (
                            <WidgetConfigTabs
                                tab={tab}
                                setTab={setTab}
                                availableTabs={availableTabs}
                            />
                        )}

                        {/* Contenu scrollable */}
                        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 p-4 config-scrollbar">
                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
                                    {error}
                                </div>
                            )}

                            {tab === "data" && (
                                <WidgetDataConfigSection
                                    type={type}
                                    dataConfig={WIDGET_DATA_CONFIG[type as WidgetType]}
                                    config={{
                                        ...config,
                                        metrics: metricsWithLabels,
                                        bucket: config.bucket,
                                    }}
                                    columns={columns}
                                    columnInfos={columnInfos}
                                    data={dataPreview}
                                    handleConfigChange={handleConfigChange}
                                    handleDragStart={handleDragStart}
                                    handleDragOver={handleDragOver}
                                    handleDrop={handleDrop}
                                    handleMetricAggOrFieldChange={handleMetricAggOrFieldChange}
                                />
                            )}

                            {tab === "metricsAxes" && hasMetrics && (
                                <WidgetMetricStyleConfigSection
                                    type={type}
                                    metrics={metricsWithLabels}
                                    metricStyles={config.metricStyles || []}
                                    handleMetricStyleChange={handleMetricStyleChange}
                                />
                            )}

                            {tab === "params" && hasConfig && (
                                <WidgetParamsConfigSection
                                    type={type}
                                    config={config}
                                    handleConfigChange={handleConfigChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmation pour le titre du widget */}
            <WidgetSaveTitleModal
                open={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                title={widgetTitle}
                setTitle={setWidgetTitle}
                visibility={visibility}
                setVisibility={setVisibility}
                error={widgetTitleError}
                setError={setWidgetTitleError}
                loading={isLoading}
                onConfirm={onModalConfirm}
            />
        </>
    );
}
