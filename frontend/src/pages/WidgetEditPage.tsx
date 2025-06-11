import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { WIDGETS, WIDGET_DATA_CONFIG } from "@/components/widgets";
import { useNotificationStore } from "@/store/notification";
import { useDashboardStore } from "@/store/dashboard";
import WidgetConfigTabs from "@/components/widgets/WidgetConfigTabs";
import WidgetDataConfigSection from "@/components/widgets/WidgetDataConfigSection";
import WidgetConfigFooter from "@/components/widgets/WidgetConfigFooter";
import WidgetSaveTitleModal from "@/components/widgets/WidgetSaveTitleModal";
import WidgetMetricStyleConfigSection from "@/components/widgets/WidgetMetricStyleConfigSection";
import WidgetParamsConfigSection from "@/components/widgets/WidgetParamsConfigSection";
import { useSourceData } from "@/hooks/useSourceData";

export default function WidgetEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [widget, setWidget] = useState<any>(null);
  const [config, setConfig] = useState<any>({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [widgetTitle, setWidgetTitle] = useState("");
  const [widgetTitleError, setWidgetTitleError] = useState("");
  const [tab, setTab] = useState<"data" | "metricsAxes" | "params">("data");
  const [columns, setColumns] = useState<string[]>([]);
  const [source, setSource] = useState<any>({ endpoint: null });

  // Charge les données de la source via endpoint
  // Toujours passer une valeur définie pour garantir l'ordre des hooks
  const { data: realSourceData } = useSourceData(source?.endpoint ?? "");

  // Initialise les colonnes à partir des données de la source (comme en création)
  useEffect(() => {
    if (
      realSourceData &&
      Array.isArray(realSourceData) &&
      realSourceData.length > 0
    ) {
      setColumns(Object.keys(realSourceData[0]));
    }
  }, [realSourceData]);

  // Met à jour le titre du breadcrumb lorsque le widget est chargé ou que le titre change
  useEffect(() => {
    if (id && widgetTitle) {
      setBreadcrumb([
        { url: "/widgets", label: "Visualisations" },
        { url: `/widgets/edit/${id}`, label: widgetTitle },
      ]);
    }
  }, [id, widgetTitle, setBreadcrumb]);

  // Charge le widget puis la source pour récupérer l'endpoint
  useEffect(() => {
    async function fetchWidgetAndSource() {
      setLoading(true);
      try {
        const res = await api.get(`/widgets/${id}`);
        setWidget(res.data);
        setConfig(res.data.config);
        setWidgetTitle(res.data.title);
        // Charge la source associée pour obtenir l'endpoint
        if (res.data.dataSourceId) {
          const srcRes = await api.get(`/sources/${res.data.dataSourceId}`);
          setSource(srcRes.data || { endpoint: null });
        } else {
          setSource({ endpoint: null });
        }
      } catch (e: any) {
        setError("Impossible de charger le widget");
      } finally {
        setLoading(false);
      }
    }
    fetchWidgetAndSource();
  }, [id]);

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!widget) return null;

  // Correction TS : typage explicite
  const type = widget.type as import("@/components/widgets").WidgetType;
  const WidgetComponent = WIDGETS[type]?.component;

  async function handleSave() {
    try {
      await api.put(`/widgets/${id}`, {
        ...widget,
        title: widgetTitle,
        config,
      });
      showNotification({
        open: true,
        type: "success",
        title: "Succès",
        description: "Widget modifié avec succès !",
      });
      navigate("/widgets");
    } catch (e: any) {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description:
          e.response?.data?.message ||
          "Erreur lors de la modification du widget",
      });
    }
  }

  return (
    <>
      <div className="lg:h-[90vh] h-full flex flex-col min-h-0 overflow-hidden">
        <div className="flex flex-col md:flex-row lg:flex-row h-full min-h-0 gap-2">
          {/* Colonne aperçu (preview) : sticky/fixée, jamais scrollable */}
          <div className="order-1 md:w-1/2 lg:w-2/3 flex-shrink-0 flex flex-col lg:sticky lg:top-0 h-full p-1 md:p-2 ">
            {WidgetComponent && (
              <WidgetComponent
                data={realSourceData || []}
                config={{ ...config, title: widgetTitle }}
              />
            )}
          </div>
          {/* Colonne config (droite) : scrollable indépendamment, boutons sticky en bas */}
          <div className="order-2 md:w-1/2 lg:w-1/3 flex flex-col h-[90vh] bg-gray-300/30 dark:bg-gray-900/30 rounded shadow relative">
            {/* Tabs */}
            <WidgetConfigTabs tab={tab} setTab={setTab} />
            {/* Contenu scrollable : tout sauf les boutons */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pb-24 config-scrollbar md:px-2">
              {tab === "data" && (
                <WidgetDataConfigSection
                  dataConfig={WIDGET_DATA_CONFIG[type]}
                  config={config}
                  columns={columns}
                  handleConfigChange={(field, value) =>
                    setConfig((c: any) => ({ ...c, [field]: value }))
                  }
                  handleDragStart={() => {}}
                  handleDragOver={() => {}}
                  handleDrop={() => {}}
                  handleMetricAggOrFieldChange={() => {}}
                />
              )}
              {tab === "metricsAxes" && (
                <WidgetMetricStyleConfigSection
                  type={type}
                  metrics={config.metrics || []}
                  metricStyles={config.metricStyles || []}
                  handleMetricStyleChange={(idx, field, value) => {
                    const newStyles = [...(config.metricStyles || [])];
                    newStyles[idx] = { ...newStyles[idx], [field]: value };
                    setConfig((c: any) => ({ ...c, metricStyles: newStyles }));
                  }}
                />
              )}
              {tab === "params" && (
                <WidgetParamsConfigSection
                  type={type}
                  config={config}
                  handleConfigChange={(field, value) =>
                    setConfig((c: any) => ({ ...c, [field]: value }))
                  }
                />
              )}
            </div>
            {/* Footer : boutons sticky en bas */}
            <WidgetConfigFooter
              step={2}
              loading={loading}
              onPrev={() => navigate("/widgets")}
              onNext={() => {}}
              onSave={() => setShowSaveModal(true)}
              isSaving={loading}
            />
          </div>
        </div>
      </div>
      {/* Modal de confirmation pour le titre du widget */}
      <WidgetSaveTitleModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title={widgetTitle}
        setTitle={setWidgetTitle}
        error={widgetTitleError}
        setError={setWidgetTitleError}
        loading={loading}
        onConfirm={() => {
          if (!widgetTitle.trim()) {
            setWidgetTitleError("Le titre est requis");
            return;
          }
          setShowSaveModal(false);
          handleSave();
        }}
      />
    </>
  );
}
