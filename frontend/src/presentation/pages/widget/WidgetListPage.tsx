import { WIDGETS } from "@/data/adapters/visualizations";
import { Link } from "react-router-dom";
import { useDashboardStore } from "@/core/store/dashboard";
import { useEffect, useState, useMemo } from "react";
import { ROUTES } from "@/core/constants/routes";
import Table from "@/presentation/components/Table";
import Modal from "@/presentation/components/Modal";
import { widgetsQuery } from "@/data/repositories/widgets";
import { useUserStore } from "@/core/store/user";
import { sourcesQuery } from "@/data/repositories/sources";
import type { DataSource } from "@/core/types/data-source";
import type { Widget } from "@/core/types/widget-types";
import { useQueryClient } from "@tanstack/react-query";

export default function WidgetListPage() {
  const queryClient = useQueryClient();
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([{ url: ROUTES.widgets, label: "Visualisations" }]);
  }, [setBreadcrumb]);

  // Chargement des widgets depuis l'API
  const { data: widgets = [], isLoading } = widgetsQuery();
  const widgetsArray: Widget[] = Array.isArray(widgets) ? widgets : [];

  const { data: sources = [] } = sourcesQuery({queryClient});
  const sourcesArray: DataSource[] = Array.isArray(sources) ? sources : [];

  // Utilisation de useMemo pour stabiliser columns et data
  const columns = useMemo(
    () => [
      { key: "title", label: "Titre" },
      { key: "type", label: "Type" },
      { key: "dataSourceId", label: "Source" },
    ],
    []
  );

  const tableData = useMemo(
    () =>
      widgetsArray.map((w) => ({
        ...w,
        type: WIDGETS[w.type as keyof typeof WIDGETS]?.label || w.type,
        dataSourceId:
          sourcesArray.find((s) => String(s._id) === String(w.dataSourceId))
            ?.name || w.dataSourceId,
      })),
    [widgetsArray, sourcesArray]
  );

  // Ajout de l'état pour la modal de configuration
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<Widget | null>(null);
  const hasPermission = useUserStore((s) => s.hasPermission);

  return (
    <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow mt-2s">
      <div className="flex items-center justify-end mb-3">
        <div className="flex items-center gap-2">
          {hasPermission("widget:canCreate") && (
            <Link
              to={ROUTES.createWidget}
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
            >
              Ajouter une visualisation
            </Link>
          )}
        </div>
      </div>
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <Table
          paginable={true}
          searchable={true}
          rowPerPage={5}
          columns={columns}
          data={tableData}
          emptyMessage="Aucune visualisation."
          actionsColumn={{
            key: "actions",
            label: "Actions",
            render: (row: Widget) => (
              <div className="flex gap-2">
                {hasPermission("widget:canUpdate") && (
                  <Link
                    to={
                      row._id ? ROUTES.editWidget.replace(":id", row._id) : "#"
                    }
                    className="text-xs text-indigo-600 underline hover:text-indigo-800"
                  >
                    Modifier
                  </Link>
                )}
                <button
                  type="button"
                  className="text-xs text-indigo-500 underline hover:text-indigo-700"
                  onClick={() => {
                    setSelectedConfig(row);
                    setModalOpen(true);
                  }}
                >
                  Voir la config
                </button>
              </div>
            ),
          }}
        />
      )}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Configuration du widget"
        size="lg"
      >
        <pre className="text-xs bg-gray-100 dark:bg-gray-800 rounded p-2 overflow-x-auto max-h-80">
          {selectedConfig ? JSON.stringify(selectedConfig, null, 2) : ""}
        </pre>
      </Modal>
    </div>
  );
}
