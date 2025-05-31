import { useQuery } from '@tanstack/react-query';
import { WIDGETS } from '@/components/widgets';
import Button from '@/components/Button';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useSourceData } from '@/hooks/useSourceData';

function WidgetPreview({ w, widgetDef, WidgetComponent, source }: any) {
  const initialData = Array.isArray(source?.data) ? source.data : undefined;
  const { data: widgetData, loading, error } = useSourceData(source?.endpoint, initialData);
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
    <div className="bg-white dark:bg-gray-900 rounded shadow p-4 flex flex-col gap-2 dark:border dark:border-gray-700 ">
      <div className="font-semibold mb-1">{w.title}</div>
      <div className="text-xs text-gray-500 mb-2">{widgetDef.label} | Source : {source?.name || 'inconnue'}</div>
      {loading ? (
        <div className="text-sm text-gray-400">Chargement des données…</div>
      ) : dataError ? (
        <div className="text-sm text-red-500">{dataError}</div>
      ) : (
        <WidgetComponent data={widgetData} config={w.config} />
      )}
      <details className="mt-2">
        <summary className="text-xs text-indigo-500 cursor-pointer">Voir la configuration</summary>
        <pre className="text-xs bg-gray-100 dark:bg-gray-800 rounded p-2 overflow-x-auto">{JSON.stringify(w.config, null, 2)}</pre>
      </details>
    </div>
  );
}

export default function WidgetListPage() {
  const { data: widgets = [], isLoading } = useQuery({
    queryKey: ['widgets'],
    queryFn: async () => (await api.get('/widgets')).data,
  });
  const { data: sources = [] } = useQuery({
    queryKey: ['sources'],
    queryFn: async () => (await api.get('/sources')).data,
  });
  const navigate = useNavigate();
  const widgetsArray = Array.isArray(widgets) ? widgets : [];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold ">Visualisations</h1>
        <div className="flex items-center gap-2">
          <Button
            color="indigo"
            size="lg"
            onClick={() => navigate('/widgets/create')}
          >
            Ajouter une visualisation
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgetsArray.map((w: any) => {
            const widgetDef = WIDGETS[w.type as keyof typeof WIDGETS];
            const WidgetComponent = widgetDef?.component;
            const source = sources.find((s: any) => String(s._id) === String(w.dataSourceId));
            return <WidgetPreview key={w._id} w={w} widgetDef={widgetDef} WidgetComponent={WidgetComponent} source={source} />;
          })}
        </div>
      )}
    </>
  );
}
