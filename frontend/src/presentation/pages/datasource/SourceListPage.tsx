import Button from "@components/forms/Button";
import Table from "@components/Table";
import Modal from "@components/Modal";
import { useSourcesPage } from "@hooks/datasource/useSourcesPage";
import { ROUTES } from "@constants/routes";
import { Link } from "react-router-dom";
import { DeleteSourceForm } from "@components/source/DeleteSourceForm";
import type { DataSource } from "@type/dataSource";
import Badge from "@components/Badge";
import { DocumentTextIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

export default function SourcesPage() {
  const {
    sources,
    isLoading,
    modalOpen,
    setModalOpen,
    selectedSource,
    setSelectedSource,
    modalType,
    setModalType,
    deleteMutation,
    hasPermission,
    handleDownload,
    navigate,
  } = useSourcesPage();

  const columns = useMemo(
    () => [
      {
        key: "icon",
        label: " ",
        render: (row: DataSource) => {
          if (row.type === "csv") {
            return (
              <span className="flex items-center justify-center w-8 h-8">
                <TableCellsIcon className="w-6 h-6 text-indigo-500" />
              </span>
            );
          }
          if (row.type === "json" || row.type === "elasticsearch") {
            return (
              <span className="flex items-center justify-center w-8 h-8">
                <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
              </span>
            );
          }

          return <span className="w-8 h-8" />;
        },
      },
      {
        key: "name",
        label: "Nom",
        render: (row: DataSource) => (
          <span className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {row.name}
            {row.isUsed && <Badge color="yellow">utilisée</Badge>}
          </span>
        ),
      },
      {
        key: "type",
        label: "Type",
      },
      {
        key: "endpoint",
        label: "Endpoint",
        render: (row: DataSource) =>
          row.endpoint ? (
            <span className="font-mono text-xs break-all">{row.endpoint}</span>
          ) : row.filePath ? (
            <Button
              color="indigo"
              size="sm"
              variant="outline"
              title="Télécharger le fichier"
              className=" w-max !border-none"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(row.filePath, row.name + ".csv");
              }}
            >
              Télécharger le fichier
            </Button>
          ) : (
            <span className="text-gray-500 italic">Non applicable</span>
          ),
      },
    ],
    [handleDownload]
  );

  return (
    <>
      <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold ">Sources de données</h1>
          <div className="flex items-center gap-2">
            {hasPermission("datasource:canCreate") && (
              <Link
                to={ROUTES.addSource}
                className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
                color="indigo"
              >
                Ajouter une source
              </Link>
            )}
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">Mes sources</h2>
          {isLoading ? (
            <div>Chargemnt...</div>
          ) : (
            <Table
              columns={columns}
              data={sources}
              emptyMessage="Aucune source enregistrée."
              actionsColumn={{
                key: "empty",
                label: "",
                render: (row: DataSource) => (
                  <div className="flex gap-2">
                    {hasPermission("datasource:canUpdate") && (
                      <Button
                        color="indigo"
                        size="sm"
                        variant="outline"
                        title="Modfier la source"
                        className=" w-max !border-none"
                        onClick={() => {
                          navigate(`/sources/edit/${row._id}`);
                        }}
                      >
                        Modifier
                      </Button>
                    )}
                    {hasPermission("datasource:canDelete") && (
                      <Button
                        color="red"
                        size="sm"
                        variant="outline"
                        className="w-max !border-none "
                        title={
                          row.isUsed
                            ? "Impossible de supprimer une source utilisée"
                            : "Supprimer la source"
                        }
                        onClick={() => {
                          setSelectedSource(row);
                          setModalType("delete");
                          setModalOpen(true);
                        }}
                        disabled={row.isUsed}
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                ),
              }}
            />
          )}
        </div>
        <Modal
          open={modalOpen && modalType === "delete"}
          onClose={() => {
            setModalOpen(false);
            setSelectedSource(null);
          }}
          title={"Supprimer la source"}
          size="sm"
          footer={null}
        >
          {modalType === "delete" && selectedSource && (
            <DeleteSourceForm
              source={selectedSource}
              onDelete={() =>
                selectedSource && deleteMutation.mutate(selectedSource._id)
              }
              onCancel={() => setModalOpen(false)}
              loading={deleteMutation.isPending}
            />
          )}
        </Modal>
      </div>
    </>
  );
}
