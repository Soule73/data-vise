import Button from "@/presentation/components/Button";
import Table from "@/presentation/components/Table";
import Modal from "@/presentation/components/Modal";
import { useSourcesPage } from "@/core/hooks/useSourcesPage";
import { useSources } from "@/core/hooks/useSources";
import { ROUTES } from "@/core/constants/routes";
import {
  EditSourceForm,
  DeleteSourceForm,
} from "@/presentation/components/source/SourceForms";
import { Link } from "react-router-dom";

export default function SourcesPage() {
  const {
    modalOpen,
    setModalOpen,
    selectedSource,
    setSelectedSource,
    modalType,
    setModalType,
    deleteMutation,
    handleEditSuccess,
    handleEditError,
  } = useSourcesPage();

  const { sources } = useSources();

  const columns = [
    {
      key: "name",
      label: "Nom",
      render: (row: any) => (
        <span className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {row.name}
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
      render: (row: any) => (
        <span className="font-mono text-xs break-all">{row.endpoint}</span>
      ),
    }
  ];

  return (
    <>
    <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold ">Sources de données</h1>
        <div className="flex items-center gap-2">
            <Link
              to={ROUTES.addSource}
                            className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"

            color="indigo"
          >
            Ajouter une source
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Mes sources</h2>
        <Table
          columns={columns}
          data={sources}
          emptyMessage="Aucune source enregistrée."
          actionsColumn={
            {
              label: "",
              render: (row: any) => (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="indigo"
                    className=" w-max"
                    onClick={() => {
                      setSelectedSource(row);
                      setModalType("edit");
                      setModalOpen(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    color="red"
                    className=" w-max"
                    onClick={() => {
                      setSelectedSource(row);
                      setModalType("delete");
                      setModalOpen(true);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              )
            }
          }
        />
      </div>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSource(null);
        }}
        title={
          modalType === "delete" ? "Supprimer la source" : "Modifier la source"
        }
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
        {modalType === "edit" && selectedSource && (
          <EditSourceForm
            source={selectedSource}
            onClose={() => {
              setModalOpen(false);
              setSelectedSource(null);
            }}
            afterEdit={handleEditSuccess}
            onError={handleEditError}
          />
        )}
      </Modal>
    </div>
    </>
  );
}
