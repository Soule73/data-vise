import Button from "@/presentation/components/forms/Button";
import { useNavigate } from "react-router-dom";
import Table from "@/presentation/components/Table";
import { useDashboardStore } from "@/core/store/dashboard";
import { useEffect } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/constants/routes";
import { useUserStore } from "@/core/store/user";
import type { Dashboard } from "@/core/types/dashboard-model";
import { dashboardsQuery } from "@/data/repositories/dashboards";

export default function DashboardListPage() {
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([{ url: "/dashboards", label: "Tableaux de bord" }]);
  }, [setBreadcrumb]);

  const { data: dashboards = [], isLoading } = dashboardsQuery();
  const navigate = useNavigate();
  const hasPermission = useUserStore((s) => s.hasPermission);

  const columns = [
    { key: "title", label: "Titre" },
    {
      key: "widgets",
      label: "Widgets",
      render: (row: Dashboard) => row.layout?.length || 0,
    },
  ];

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
              render: (row: Dashboard) =>
                hasPermission("dashboard:canView") && (
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
                ),
            }}
          />
        )}
      </div>
    </>
  );
}
