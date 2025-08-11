import type { WidgetDataConfigSectionFixedProps } from "@type/widgetTypes";
import WidgetBubbleDataConfigSection from "@components/widgets/WidgetBubbleDataConfigSection";
import WidgetScatterDataConfigSection from "@components/widgets/WidgetScatterDataConfigSection";
import WidgetRadarDataConfigSection from "@components/widgets/WidgetRadarDataConfigSection";
import WidgetKPIGroupDataConfigSection from "@components/widgets/WidgetKPIGroupDataConfigSection";
import BaseDataConfigSection from "@components/widgets/BaseDataConfigSection";
import DefaultMetricConfigSection from "@components/widgets/DefaultMetricConfigSection";
import MultiBucketSection from "@components/widgets/MultiBucketSection";
import { WIDGETS, WIDGET_DATA_CONFIG } from "@adapters/visualizations";
import { useMultiBuckets } from "@hooks/useMultiBuckets";
import type { BubbleMetricConfig, RadarMetricConfig } from "@type/metricBucketTypes";

export default function WidgetDataConfigSection({
  type,
  dataConfig,
  config,
  columns,
  handleConfigChange,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleMetricAggOrFieldChange,
  data = [],
}: WidgetDataConfigSectionFixedProps) {
  const widgetDef = WIDGETS[type];
  const dataConfigForWidget = WIDGET_DATA_CONFIG[type];

  const {
    buckets: currentBuckets,
    handleBucketsChange,
  } = useMultiBuckets({
    config,
    columns,
    allowMultiple: dataConfigForWidget.buckets?.allowMultiple,
    onConfigChange: handleConfigChange,
  });

  if (type === "bubble") {
    return (
      <BaseDataConfigSection
        config={config}
        columns={columns}
        data={data}
        handleConfigChange={handleConfigChange}
      >
        <WidgetBubbleDataConfigSection
          metrics={Array.isArray(config.metrics) ? config.metrics as BubbleMetricConfig[] : []}
          columns={columns}
          data={data}
          handleConfigChange={handleConfigChange}
        />
      </BaseDataConfigSection>
    );
  }

  if (type === "scatter") {
    return (
      <BaseDataConfigSection
        config={config}
        columns={columns}
        data={data}
        handleConfigChange={handleConfigChange}
      >
        <WidgetScatterDataConfigSection
          metrics={Array.isArray(config.metrics) ? config.metrics as BubbleMetricConfig[] : []}
          columns={columns}
          data={data}
          handleConfigChange={handleConfigChange}
        />
      </BaseDataConfigSection>
    );
  }

  if (type === "radar") {
    return (
      <BaseDataConfigSection
        config={config}
        columns={columns}
        data={data}
        handleConfigChange={handleConfigChange}
      >
        <WidgetRadarDataConfigSection
          metrics={Array.isArray(config.metrics) ? config.metrics as RadarMetricConfig[] : []}
          columns={columns}
          handleConfigChange={handleConfigChange}
          configSchema={{ dataConfig }}
          data={data}
        />
      </BaseDataConfigSection>
    );
  }

  if (type === "kpi_group") {
    return (
      <WidgetKPIGroupDataConfigSection
        dataConfig={dataConfig}
        config={config}
        columns={columns}
        handleConfigChange={handleConfigChange}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleMetricAggOrFieldChange={handleMetricAggOrFieldChange}
        data={data}
      />
    );
  }

  const showFilter = widgetDef?.enableFilter;
  const allowMultipleMetrics = widgetDef.allowMultipleMetrics ?? true;

  return (
    <BaseDataConfigSection
      config={config}
      columns={columns}
      data={data}
      handleConfigChange={handleConfigChange}
      showGlobalFilters={showFilter}
    >
      <DefaultMetricConfigSection
        dataConfig={dataConfig}
        config={config}
        columns={columns}
        handleConfigChange={handleConfigChange}
        handleMetricAggOrFieldChange={handleMetricAggOrFieldChange}
        allowMultipleMetrics={allowMultipleMetrics}
      />

      {widgetDef && !widgetDef.hideBucket && dataConfigForWidget.buckets?.allow && (
        <MultiBucketSection
          buckets={currentBuckets}
          columns={columns}
          data={data}
          allowMultiple={dataConfigForWidget.buckets.allowMultiple}
          sectionLabel={dataConfigForWidget.buckets.label || "Buckets"}
          onBucketsChange={handleBucketsChange}
        />
      )}
    </BaseDataConfigSection>
  );
}
