import { useQuery } from "@tanstack/react-query";
import { WIDGETS } from "@/components/widgets";
import api from "@/services/api";
import { Link } from "react-router-dom";
import { useDashboardStore } from "@/store/dashboard";
import { useEffect, useState, useMemo } from "react";
import { ROUTES } from "@/constants/routes";
import Table from "@/components/Table";
import Modal from "@/components/Modal";

export default function WidgetListPage() {
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([{ url: "/widgets", label: "Visualisations" }]);
  }, [setBreadcrumb]);

  const { data: widgets = [], isLoading } = useQuery({
    queryKey: ["widgets"],
    queryFn: async () => (await api.get("/widgets")).data,
  });
  const { data: sources = [] } = useQuery({
    queryKey: ["sources"],
    queryFn: async () => (await api.get("/sources")).data,
  });

  const widgetsArray = Array.isArray(widgets) ? widgets : [];

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
      widgetsArray.map((w: any) => ({
        ...w,
        type: WIDGETS[w.type as keyof typeof WIDGETS]?.label || w.type,
        dataSourceId:
          sources.find((s: any) => String(s._id) === String(w.dataSourceId))
            ?.name || w.dataSourceId,
      })),
    [widgetsArray, sources]
  );

  // Ajout de l'état pour la modal de configuration
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);

  return (
    <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow mt-2s">
      <div className="flex items-center justify-end mb-3">
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.createWidget}
            className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
          >
            Ajouter une visualisation
          </Link>
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
            label: "Actions",
            render: (row: any) => (
              <div className="flex gap-2">
                <Link
                  to={ROUTES.editWidget.replace(":id", row._id)}
                  className="text-xs text-indigo-600 underline hover:text-indigo-800"
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  className="text-xs text-indigo-500 underline hover:text-indigo-700"
                  onClick={() => {
                    setSelectedConfig(row.config);
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
