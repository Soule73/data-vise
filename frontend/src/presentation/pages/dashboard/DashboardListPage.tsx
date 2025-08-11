import Button from "@components/forms/Button";
import Table from "@components/Table";
import type { Dashboard } from "@type/dashboardTypes";
import Modal from "@components/Modal";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { useDashboardList } from "@hooks/dashboard/useDashboardList";

export default function DashboardListPage() {
  const {
    dashboards,
    isLoading,
    modalOpen,
    setModalOpen,
    setSelectedDashboard,
    deleteLoading,
    handleDelete,
    columns,
    navigate,
    hasPermission,
  } = useDashboardList();

  return (
    <>
      <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold ">Tableaux de bord</h1>
          <div>
            {hasPermission("dashboard:canCreate") && (
              <Link
                to={ROUTES.createDashboard}
                className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
                color="indigo"
              >
                Nouveau tableau de bord
              </Link>
            )}
          </div>
        </div>
        {isLoading ? (
          <div>Chargement…</div>
        ) : dashboards.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            Aucun dashboard pour l’instant.
          </div>
        ) : (
          <Table
            searchable={true}
            paginable={true}
            rowPerPage={5}
            columns={columns}
            data={dashboards}
            emptyMessage="Aucun dashboard."
            onClickItem={(row) => navigate(`/dashboards/${row._id}`)}
            actionsColumn={{
              key: "actions",
              label: "",
              render: (row: Dashboard) => (
                <div className="flex gap-2">
                  {hasPermission("dashboard:canView") && (
                    <Button
                      color="gray"
                      size="sm"
                      variant="outline"
                      title="Ouvrir le dashboard"
                      className=" w-max !border-none !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboards/${row._id}`);
                      }}
                    >
                      <EyeIcon className="w-4 h-4 ml-1 inline" />
                    </Button>
                  )}
                  {hasPermission("dashboard:canDelete") && (
                    <Button
                      color="red"
                      size="sm"
                      variant="outline"
                      title="Supprimer le dashboard"
                      className=" w-max !border-none !bg-transparent hover:!bg-red-100 dark:hover:!bg-red-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDashboard(row);
                        setModalOpen(true);
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
      </div>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDashboard(null);
        }}
        title="Supprimer le dashboard"
        size="sm"
        footer={null}
      >
        <div className="space-y-8 py-2">
          <div className="text-gray-700 dark:text-gray-300  text-center">
            Voulez-vous vraiment supprimer ce dashboard&nbsp;?
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              color="gray"
              variant="outline"
              onClick={() => {
                setModalOpen(false);
                setSelectedDashboard(null);
              }}
              disabled={deleteLoading}
            >
              Annuler
            </Button>
            <Button color="red" onClick={handleDelete} loading={deleteLoading}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
