import { WIDGETS } from './widgets';
import { useSourceData } from '@/hooks/useSourceData';

interface DashboardWidgetPreviewProps {
  widget: any;
  sources: any[];
}

export default function DashboardWidgetPreview({ widget, sources }: DashboardWidgetPreviewProps) {
  const source = sources.find((s) => String(s._id) === String(widget.dataSourceId));
  const initialData = Array.isArray(source?.data) ? source.data : undefined;
  const { data: widgetData, loading, error } = useSourceData(source?.endpoint, initialData);
  const widgetDef = WIDGETS[widget.type as keyof typeof WIDGETS];
  const WidgetComponent = widgetDef?.component;
  let dataError = '';
  if (!source) {
    dataError = "Source de données introuvable.";
  } else if (error) {
    dataError = error;
  } else if (!loading && (!widgetData || !widgetData.length)) {
    dataError = "Aucune donnée disponible pour cette source.";
  }
  if (!WidgetComponent) return null;
  return (
      <>
        {loading ? (
          <div className="text-sm text-gray-400">Chargement des données…</div>
        ) : dataError ? (
          <div className="text-sm text-red-500">{dataError}</div>
        ) : (
          <WidgetComponent data={widgetData} config={widget.config} />
        )}
      </>
  );
}





