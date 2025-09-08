import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import Table from "@components/Table";
import Modal from "@components/Modal";
import { useWidgetListPage } from "@hooks/widget/useWidgetListPage";
import { DeleteWidgetModal } from "@components/widgets/DeleteWidgetModal";
import Button from "@components/forms/Button";
import type { Widget, WidgetType } from "@type/widgetTypes";
import { useMemo, useState } from "react";
import { WIDGETS } from "@adapters/visualizations";
import Badge from "@components/Badge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import WidgetTypeSelectionModal from "@components/widgets/WidgetTypeSelectionModal";
import { useSourcesQuery } from "@/data/repositories/datasources";
import { useQueryClient } from "@tanstack/react-query";

export default function WidgetListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: sources = [] } = useSourcesQuery({ queryClient });

  const {
    tableData,
    isLoading,
    modalOpen,
    setModalOpen,
    selectedConfig,
    setSelectedConfig,
    deleteModalOpen,
    setDeleteModalOpen,
    selectedWidget,
    setSelectedWidget,
    deleteMutation,
    hasPermission,
  } = useWidgetListPage();

  const handleCreateWidget = (sourceId: string, type: WidgetType) => {
    setShowCreateModal(false);
    // Naviguer vers la page de création avec les paramètres
    navigate(`${ROUTES.createWidget}?sourceId=${sourceId}&type=${type}`);
  };

  const columns = useMemo(
    () => [
      {
        key: "icon",
        label: " ",
        render: (row: Widget) => {
          const widgetDef = WIDGETS[row.type as keyof typeof WIDGETS];
          const Icon = widgetDef?.icon;
          return Icon ? (
            <span className="flex items-center justify-center w-8 h-8">
              <Icon className="w-6 h-6 text-indigo-500" />
            </span>
          ) : (
            <span className="w-8 h-8" />
          );
        },
      },
      {
        key: "title",
        label: "Titre",
        render: (row: Widget) => (
          <span className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {row.title}
            {row.isUsed && <Badge color="yellow">utilisée</Badge>}
          </span>
        ),
      },
      {
        key: "typeLabel",
        label: "Type",
      },
      {
        key: "dataSourceId",
        label: "Source",
      },
    ],
    []
  );

  return (
    <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow mt-2s">
      <div className="flex items-center justify-end mb-3">
        <div className="flex items-center gap-2">
          {hasPermission("widget:canCreate") && (
            <Button
              color="indigo"
              onClick={() => setShowCreateModal(true)}
              className="w-max"
            >
              Ajouter une visualisation
            </Button>
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
                  >
                    <Button
                      color="indigo"
                      size="sm"
                      variant="outline"
                      className=" w-max !border-none"
                      title="Modifier le widget"
                    >
                      Modifier
                    </Button>
                  </Link>
                )}
                <Button
                  color="indigo"
                  size="sm"
                  variant="outline"
                  title="Modfier la source"
                  className=" w-max !border-none"
                  onClick={() => {
                    setSelectedConfig(row);
                    setModalOpen(true);
                  }}
                >
                  Voir la config
                </Button>
                {hasPermission("widget:canDelete") && (
                  <Button
                    color="red"
                    size="sm"
                    variant="outline"
                    className="w-max !border-none "
                    disabled={!!row.isUsed}
                    title={
                      row.isUsed
                        ? "Impossible de supprimer un widget utilisé dans un dashboard"
                        : "Supprimer le widget"
                    }
                    onClick={() => {
                      setSelectedWidget(row);
                      setDeleteModalOpen(true);
                    }}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            ),
          }}
        />
      )}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Configuration du widget"
        size="2xl"
      >
        <SyntaxHighlighter
          language="json"
          style={okaidia}
          className="text-x config-scrollbar rounded p-2 overflow-y-auto max-h-80"
        >
          {selectedConfig ? JSON.stringify(selectedConfig, null, 2) : ""}
        </SyntaxHighlighter>
      </Modal>
      <DeleteWidgetModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() =>
          selectedWidget && deleteMutation.mutate(selectedWidget._id!)
        }
        loading={deleteMutation.isPending}
        widget={selectedWidget}
      />

      <WidgetTypeSelectionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleCreateWidget}
        sources={sources}
      />
    </div>
  );
}
