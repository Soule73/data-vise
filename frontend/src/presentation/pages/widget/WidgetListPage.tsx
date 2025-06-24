import { Link } from "react-router-dom";
import { ROUTES } from "@/core/constants/routes";
import Table from "@/presentation/components/Table";
import Modal from "@/presentation/components/Modal";
import { useWidgetListPage } from "@/core/hooks/widget/useWidgetListPage";
import { DeleteWidgetModal } from "@/presentation/components/widget/DeleteWidgetModal";
import Button from "@/presentation/components/forms/Button";
import type { Widget } from "@/core/types/widget-types";
import { useMemo } from "react";
import { WIDGETS } from "@/data/adapters/visualizations";
import Badge from "@/presentation/components/Badge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function WidgetListPage() {
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

  // Définition des colonnes avec useMemo pour éviter le recalcul à chaque rendu
  // Correction : la Table filtre les colonnes sans label, donc il faut mettre un label non vide pour la colonne icône
  const columns = useMemo(
    () => [
      {
        key: "icon",
        label: " ", // espace pour que la colonne soit considérée comme valide
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
    </div>
  );
}
